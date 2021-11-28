const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");

const mongo = require("mongodb");

module.exports = {
    create
}

async function create(item_id, account, content) {
    let errors = [];
    if (arguments.length != 3) errors.push("arguments");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("item_id");
    if (!(account = check(account, "account"))) errors.push("account");
    if (!(content = check(content, "content"))) errors.push("content");

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

    let comment = {
        "_id": mongo.ObjectId(),
        "commenter": account,
        "date": new Date(),
        "content": content,
    };

    const updatedInfo = await itemCol.updateOne({ "_id": item_id }, { $push: { "comments": comment } });
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw "Can't create comment for this item in mongodb, something went wrong, please try again!";
    }

    const insertedItem = await itemCol.findOne({ _id: item_id });
    if (insertedItem === null) {
        await collection.closeCollection();
        throw "Can't find created comment in mongodb, something went wrong! Please try again!";
    }

    await collection.closeCollection();

    insertedItem._id = insertedItem._id.toString();
    insertedItem.comments.forEach(element => {
        element._id = element._id.toString();
    });
    return { "hasErrors": false, "item": insertedItem };
}