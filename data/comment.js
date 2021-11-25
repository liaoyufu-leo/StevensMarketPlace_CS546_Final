const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");

const mongo = require("mongodb");
const user = require("./user");


module.exports = {
    create
}

async function create(item_id, account, content) {
    let errors = [];
    if (arguments.length != 3) errors.push("Comment create arguments is not correct.");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("Item_id is not valid.");
    if (!(account = check(account, "account"))) errors.push("Account is not valid.");
    if (!(content = check(content, "content"))) errors.push("Content is not valid.");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const checkItem = item.findOne(item_id);
    if (checkItem.hasErrors == true) {
        errors.push("This item is not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    const checkAccount = await user.findOne(account);
    if (checkAccount.hasErrors == true) {
        errors.push("Account is not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    let comment = {
        "_id": mongo.ObjectId(),
        "commenter": account,
        "date": new Date(),
        "content": content,
    }

    const itemCol = await collection.getCollection('item');

    const insertInfo = await itemCol.updateOne({ "_id": item_id }, { $push: { "comments": comment } });
    if (insertInfo.insertedCount === 0) {
        await collection.closeCollection();
        throw "Can't create comment for this item in mongodb, something went wrong, please try again!";
    }

    const insertedItem = await itemCol.findOne({ _id: insertInfo.insertedId });
    if (insertedItem === null) {
        await collection.closeCollection();
        throw "Can't find created comment in mongodb, something went wrong! Please try again!";
    }

    await collection.closeCollection();

    insertedItem = insertedItem._id.toString();
    insertedItem.comments.forEach(element => {
        element._id = element._id.toString();
    });
    return { "hasErrors": false, "comment": insertedItem };
}