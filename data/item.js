const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");

const mongo = require("mongodb");
const user = require("./user");

module.exports = {
    create,
    updateInfo,
    deleteItem,
    findAll,
    findOne,
    search
}

async function create(account, title, price, photos, description) {
    let errors = [];
    if (arguments.length != 5) errors.push("Item create arguments is not correct.");
    if (!(account = check(account, "account"))) errors.push("account is not valid!");
    if (!(title = check(title, "title"))) errors.push("title is not valid!");
    if (!(price = check(price, "price"))) errors.push("price is not valid!");
    if (!(photos = check(photos, "photos"))) errors.push("photos is not valid!");
    if (!(description = check(description, "description"))) errors.push("description is not valid!");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const checkAccount = await user.findOne(account);
    if (checkAccount.hasErrors == true) {
        errors.push("Account is not exist!");
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
    if (arguments.length != 5) errors.push("Item updateInfo arguments is not correct.");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("Item_id is not valid.");
    if (!(title = check(title, "title"))) errors.push("title is not valid!");
    if (!(price = check(price, "price"))) errors.push("price is not valid!");
    if (!(photos = check(photos, "photos"))) errors.push("photos is not valid!");
    if (!(description = check(description, "description"))) errors.push("description is not valid!");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const itemCol = await collection.getCollection('item');

    const checkItem = await itemCol.findOne({ "_id": item_id });
    if (checkItem == null) {
        await collection.closeCollection();
        errors.push("This item is not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    if (checkItem.title == title &&
        checkItem.price == price &&
        checkItem.description == description &&
        checkItem.photos.length == photos.length &&
        ((input, input2) => {
            let flag = true;
            input.forEach(element => {
                flag = flag && input2.inclues(element);
            });
            return flag;
        })(checkItem.photos, photos)) {
        await collection.closeCollection();
        errors.push("Item information not changed!");
        return { "hasErrors": true, "errors": errors };
    }

    let item = {
        "_id": item_id,
        "seller": checkItem.account,
        "status": checkItem.status,
        "date": new Date(),
        "title": title,
        "price": price,
        "photos": photos,
        "description": description,
        "comments": checkItem.comment
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

    updatedItem = updatedItem._id.toString();
    updatedItem.comments.forEach(element => {
        element._id = element._id.toString();
    });
    return { "hasErrors": false, "item": updatedItem };
}

async function deleteItem(item_id) {
    let errors = [];
    if (arguments.length != 1) errors.push("Item delete arguments is not correct.");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("Item_id is not valid.");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const itemCol = await collection.getCollection('item');

    const checkItem = await itemCol.findOne({ "_id": item_id });
    if (checkItem == null) {
        await collection.closeCollection();
        errors.push("This item is not exist!");
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

    await collection.closeCollection();

    updatedItem = updatedItem._id.toString();
    updatedItem.comments.forEach(element => {
        element._id = element._id.toString();
    });
    return { "hasErrors": false, "item": updatedItem };
}

async function findAll(account) {
    let errors = [];
    if (arguments.length != 1) errors.push("Item findAll arguments is not correct.");
    if (!(account = check(account, "account"))) errors.push("account is not valid!");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const checkAccount = await user.findOne(account);
    if (checkAccount.hasErrors == true) {
        errors.push("Account is not exist!");
    }

    const itemCol = await collection.getCollection('item');

    const items = await itemCol.find({ "account": account }).toArray();

    await collection.closeCollection();

    items.forEach(element => {
        element._id = element._id.toString();
        element.comments.forEach(element2 => {
            element2._id = element2._id.toString();
        });
    });
    return { "hasErrors": false, "item": items };

}

async function findOne(item_id) {
    let errors = [];
    if (arguments.length != 1) errors.push("Item updateInfo arguments is not correct.");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("Item_id is not valid.");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const itemCol = await collection.getCollection('item');

    const checkItem = await itemCol.findOne({ "_id": item_id });
    if (checkItem == null) {
        await collection.closeCollection();
        errors.push("This item is not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    await collection.closeCollection();

    checkItem = checkItem._id.toString();
    checkItem.comments.forEach(element => {
        element._id = element._id.toString();
    });
    return { "hasErrors": false, "item": checkItem };
}

async function search(keyword) {
    let errors = [];
    if (arguments.length != 0) errors.push("Item updateInfo arguments is not correct.");
    if (!(keyword = check(keyword, "keyword"))) errors.push("keyword is not valid!");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const itemCol = await collection.getCollection('item');

    const items = await itemCol.find({ $text: { $search: keyword } }).toArray();

    await collection.closeCollection();

    items.forEach(element => {
        element._id = element._id.toString();
        element.comments.forEach(element2 => {
            element2._id = element2._id.toString();
        });
    });
    return { "hasErrors": false, "item": items };
}