const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");

const mongo = require("mongodb");

module.exports = {
    create,
    updateInfo,
    deleteItem,
    findAll,
    findOne,
    search,
    addCart,
    removeCart
}

async function create(account, title, price, photos, description) {
    let errors = [];
    if (arguments.length != 5) errors.push("arguments");
    if (!(account = check(account, "account"))) errors.push("account");
    if (!(title = check(title, "title"))) errors.push("title");
    if (!(price = check(price, "price"))) errors.push("price");
    if (!(photos = check(photos, "photos"))) errors.push("photos");
    if (!(description = check(description, "description"))) errors.push("description");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("account not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const itemCol = await collection.getCollection('item');

    let item = {
        "seller": account,
        "status": "selling",
        "date": new Date(),
        "title": title,
        "price": price,
        "photos": photos,
        "description": description,
        "comments": []
    };

    const insertInfo = await itemCol.insertOne(item);
    if (insertInfo.insertedCount === 0) {
        await collection.closeCollection();
        throw "Can't create item in mongodb, something went wrong, please try again!";
    }

    const insertedItem = await itemCol.findOne({ _id: insertInfo.insertedId });
    if (insertedItem === null) {
        await collection.closeCollection();
        throw "Can't find created comment in mongodb, something went wrong! Please try again!";
    }

    await collection.closeCollection();

    insertedItem._id = insertedItem._id.toString();
    return { "hasErrors": false, "item": insertedItem };
}

async function updateInfo(item_id, title, price, photos, description) {
    let errors = [];
    if (arguments.length != 5) errors.push("arguments");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("item_id");
    if (!(title = check(title, "title"))) errors.push("title");
    if (!(price = check(price, "price"))) errors.push("price");
    if (!(photos = check(photos, "photos"))) errors.push("photos");
    if (!(description = check(description, "description"))) errors.push("description");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const itemCol = await collection.getCollection('item');

    const checkItem = await itemCol.findOne({ "_id": item_id });
    if (checkItem == null) {
        await collection.closeCollection();
        errors.push("item not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    if (checkItem.title == title &&
        checkItem.price == price &&
        checkItem.description == description &&
        checkItem.photos.length == photos.length &&
        ((input, input2) => {
            let flag = true;
            input.forEach(element => {
                flag = flag && input2.includes(element);
            });
            return flag;
        })(checkItem.photos, photos)) {
        await collection.closeCollection();
        errors.push("same");
        return { "hasErrors": true, "errors": errors };
    }

    let item = {
        "seller": checkItem.seller,
        "status": checkItem.status,
        "date": new Date(),
        "title": title,
        "price": price,
        "photos": photos,
        "description": description,
        "comments": checkItem.comments
    };

    const updatedInfo = await itemCol.updateOne(
        { "_id": item_id },
        { $set: item }
    );
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw "Can't update item information in mongodb, something went wrong, please try again!";
    }

    const updatedItem = await itemCol.findOne({ "_id": item_id });
    if (updatedItem === null) {
        await collection.closeCollection();
        throw "Can't find updated item in mongodb, something went wrong, Please try again!";
    }

    await collection.closeCollection();

    updatedItem._id = updatedItem._id.toString();
    updatedItem.comments.forEach(element => {
        element._id = element._id.toString();
    });
    return { "hasErrors": false, "item": updatedItem };
}

async function deleteItem(item_id) {
    let errors = [];
    if (arguments.length != 1) errors.push("arguments");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("item_id");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const itemCol = await collection.getCollection('item');

    const checkItem = await itemCol.findOne({ "_id": item_id });
    if (checkItem == null) {
        await collection.closeCollection();
        errors.push("item not exist");
        return { "hasErrors": true, "errors": errors };
    }

    if (checkItem.status == "withdrawn") {
        await collection.closeCollection();
        errors.push("withdrawn");
        return { "hasErrors": true, "errors": errors };
    }

    const updatedInfo = await itemCol.updateOne(
        { "_id": item_id },
        {
            $set: {
                "status": "withdrawn"
            }
        }
    );
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw "Can't delete item in mongodb, something went wrong, please try again!";
    }

    const updatedItem = await itemCol.findOne({ "_id": item_id });
    if (updatedItem === null) {
        await collection.closeCollection();
        throw "Can't find updated item in mongodb, something went wrong, Please try again!";
    }

    const userCol = await collection.getCollection('user');
    const updatedcart = await userCol.updateMany({ "cart": { $in: [item_id] } }, { $pull: { "cart": item_id } });

    await collection.closeCollection();

    updatedItem._id = updatedItem._id.toString();
    updatedItem.comments.forEach(element => {
        element._id = element._id.toString();
    });
    return { "hasErrors": false, "item": updatedItem };
}

async function findAll(account) {
    let errors = [];
    if (arguments.length != 1) errors.push("arguments");
    if (!(account = check(account, "account"))) errors.push("account");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("account not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    const itemCol = await collection.getCollection('item');

    const items = await itemCol.find({ "seller": account }).toArray();

    await collection.closeCollection();

    items.forEach(element => {
        element._id = element._id.toString();
        element.comments.forEach(element2 => {
            element2._id = element2._id.toString();
        });
    });
    return { "hasErrors": false, "items": items };

}

async function findOne(item_id) {
    let errors = [];
    if (arguments.length != 1) errors.push("arguments");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("item_id");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const itemCol = await collection.getCollection('item');

    const checkItem = await itemCol.findOne({ "_id": item_id });
    if (checkItem == null) {
        await collection.closeCollection();
        errors.push("item not exist");
        return { "hasErrors": true, "errors": errors };
    }

    await collection.closeCollection();

    checkItem._id = checkItem._id.toString();
    checkItem.comments.forEach(element => {
        element._id = element._id.toString();
    });
    return { "hasErrors": false, "item": checkItem };
}

async function search(keyword, account) {
    let errors = [];
    if (arguments.length != 2) errors.push("arguments");
    if ((keyword = check(keyword, "keyword")) === false) errors.push("keyword");
    if (!(account = check(account, "account"))) errors.push("account");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("account not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const itemCol = await collection.getCollection('item');

    let items;
    if (keyword != "") {
        items = await itemCol.find({ $and: [{ "status": "selling" }, { "seller": { $ne: account } }], $text: { $search: keyword } }).toArray();
    } else {
        items = await itemCol.find({ $and: [{ "status": "selling" }, { "seller": { $ne: account } }] }).toArray();
    }

    await collection.closeCollection();

    items.forEach(element => {
        element._id = element._id.toString();
        element.comments.forEach(element2 => {
            element2._id = element2._id.toString();
        });
    });
    return { "hasErrors": false, "items": items };
}

async function addCart(account, item_id) {
    let errors = [];
    if (arguments.length != 2) errors.push("arguments");
    if (!(account = check(account, "account"))) errors.push("account");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("item_id");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const itemCol = await collection.getCollection('item');

    const checkItem = await itemCol.findOne({ "_id": item_id });
    if (checkItem == null) {
        await collection.closeCollection();
        errors.push("item not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("account not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const checkAccountAndItem = await userCol.findOne({ "account": account, "cart": { $in: [item_id] } });
    if (checkAccountAndItem != null) {
        await collection.closeCollection();
        errors.push("item exist in cart");
        return { "hasErrors": true, "errors": errors };
    }

    const updatedInfo = await userCol.updateOne({ "account": account }, { $push: { "cart": item_id } });
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw "Could not add item to user's cart in mongodb, something went wrong, Please try again!";
    }

    const updatedUser = await userCol.findOne({ "account": account });
    if (updatedUser === null) {
        await collection.closeCollection();
        throw "Can't find updated account in mongodb, something went wrong! Please try again!";
    }

    await collection.closeCollection();

    updatedUser._id = updatedUser._id.toString();
    for (let i = 0; i < updatedUser.cart.length; i++) {
        updatedUser.cart[i] = updatedUser.cart[i].toString();
    }
    return { "hasErrors": false, "user": updatedUser };
}

async function removeCart(account, item_id) {
    let errors = [];
    if (arguments.length != 2) errors.push("arguments");
    if (!(account = check(account, "account"))) errors.push("account");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("item_id");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("account not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const itemCol = await collection.getCollection('item');

    const checkItem = await itemCol.findOne({ "_id": item_id });
    if (checkItem == null) {
        await collection.closeCollection();
        errors.push("item not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const checkAccountAndItem = await userCol.findOne({ "account": account, "cart": { $in: [item_id] } });
    if (checkAccountAndItem == null) {
        await collection.closeCollection();
        errors.push("item not have");
        return { "hasErrors": true, "errors": errors };
    }

    const updatedInfo = await userCol.updateOne({ account: account }, { $pull: { "cart": item_id } });
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw "Could not delete item from user's cart in mongodb, something went wrong, Please try again!";
    }

    const updatedUser = await userCol.findOne({ account: account });
    if (updatedUser === null) {
        await collection.closeCollection();
        throw "Can't find updated account in mongodb, something went wrong, Please try again!";
    }

    await collection.closeCollection();

    updatedUser._id = updatedUser._id.toString();
    for (let i = 0; i < updatedUser.cart.length; i++) {
        updatedUser.cart[i] = updatedUser.cart[i].toString();
    }
    return { "hasErrors": false, "user": updatedUser };
}