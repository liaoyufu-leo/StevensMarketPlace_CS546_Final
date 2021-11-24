const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");

const mongo = require("mongodb");
const user = require("./user");


module.exports = {
    create,
    getAll
}

async function create(item_id, account, content) {
    let errors = [];
    if (arguments.length != 3) errors.push("Comment create arguments is not correct.");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("Item_id is not valid.");
    if (!(account = check(account, "account"))) errors.push("Account is not valid!");
    if (!(content = check(content, "content"))) errors.push("Content is not valid.");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    // check item_id exist after item finished

    const checkAccount = await user.findOne(account);
    if (checkAccount.hasErrors == true) {
        errors.push("Account is not exist!");
    }

    let comment = {
        "item_id": item_id,
        "commenter": account,
        "date": new Date(),
        "content": content,
    }

    const commentCol = await collection.getCollection('comment');

    const insertInfo = await commentCol.insertOne(comment);
    if (insertInfo.insertedCount === 0) {
        await collection.closeCollection();
        throw "Can't create account in mongodb, something went wrong, please try again!";
    }

    const insertedComment = await commentCol.findOne({ _id: insertInfo.insertedId });
    if (insertedComment === null) {
        await collection.closeCollection();
        throw "Can't find created comment in mongodb, something went wrong! Please try again!";
    }

    await collection.closeCollection();

    insertedComment._id = insertedComment._id.toString();
    insertedComment.item_id = insertedComment.item_id.toString();
    return { "hasErrors": false, "comment": insertedComment };
}

async function getAll(item_id) {
    let errors = [];
    if (arguments.length != 1) errors.push("Comment getAll arguments is not correct.");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("Item_id is not valid.");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const commentCol = await collection.getCollection('comment');

    const comments = await commentCol.find({ "item_id": item_id }).toArray();

    await collection.closeCollection();

    comments.forEach(element => {
        element._id = element._id.toString();
        element.item_id = element.item_id.toString();
    });
    return { "hasErrors": false, "comments": comments };

}