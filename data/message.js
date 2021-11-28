const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");

const mongo = require("mongodb");

module.exports = {
    send,
    getAll,
    getOne
}

async function send(sender, receiver, content) {
    let errors = [];
    if (arguments.length != 3) errors.push("arguments");
    if (!(sender = check(sender, "account"))) errors.push("sender");
    if (!(receiver = check(receiver, "account"))) errors.push("receiver");
    if (!(content = check(content, "content"))) errors.push("content");
    if (sender == receiver) errors.push("same");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": sender });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("sender not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const checkAccount2 = await userCol.findOne({ "account": receiver });
    if (checkAccount2 == null) {
        await collection.closeCollection();
        errors.push("receiver not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    const messageCol = await collection.getCollection('message');

    const checkMessage = await messageCol.findOne({ "users": { $in: [sender, receiver] } });
    let message = {
        "sender": sender,
        "date": new Date(),
        "message": content
    };

    if (checkMessage == undefined) {
        const updatedInfo = await messageCol.insertOne({
            "users": [sender, receiver],
            "messages": [message]
        });
        if (updatedInfo.modifiedCount === 0) {
            await collection.closeCollection();
            throw "Can't create message in mongodb, something went wrong, please try again!";
        }

        const insertedMessage = await messageCol.findOne({ "users": { $in: [sender, receiver] } });
        if (insertedMessage === null) {
            await collection.closeCollection();
            throw "Can't find created message in mongodb, something went wrong! Please try again!";
        }

        await collection.closeCollection();

        insertedMessage._id = insertedMessage._id.toString();
        return { "hasErrors": false, "message": insertedMessage };
    } else {
        const updatedInfo = await messageCol.updateOne({ "users": { $in: [sender, receiver] } }, { $push: { "messages": message } });
        if (updatedInfo.modifiedCount === 0) {
            await collection.closeCollection();
            throw "Can't insert message in mongodb, something went wrong, please try again!";
        }

        const insertedMessage = await messageCol.findOne({ "users": { $in: [sender, receiver] } });
        if (insertedMessage === null) {
            await collection.closeCollection();
            throw "Can't find created message in mongodb, something went wrong! Please try again!";
        }

        await collection.closeCollection();

        insertedMessage._id = insertedMessage._id.toString();
        return { "hasErrors": false, "message": insertedMessage };
    }

}

async function getAll(account) {
    let errors = [];
    if (arguments.length != 1) errors.push("Message getAll arguments is not correct.");
    if (!(account = check(account, "account"))) errors.push("Account is not valid.");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("This account is not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    const messageCol = await collection.getCollection('message');

    const messages = await messageCol.find({ "users": { $in: [account] } }).toArray();

    await collection.closeCollection();

    messages.forEach(element => {
        element._id = element._id.toString();
    });
    return { "hasErrors": false, "messages": messages };
}

async function getOne(sender, receiver) {
    let errors = [];
    if (arguments.length != 2) errors.push("arguments");
    if (!(sender = check(sender, "account"))) errors.push("sender");
    if (!(receiver = check(receiver, "account"))) errors.push("receiver");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": sender });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("sender");
        return { "hasErrors": true, "errors": errors };
    }

    const checkAccount2 = await userCol.findOne({ "account": receiver });
    if (checkAccount2 == null) {
        await collection.closeCollection();
        errors.push("receiver");
        return { "hasErrors": true, "errors": errors };
    }

    const messageCol = await collection.getCollection('message');

    const checkMessage = await messageCol.findOne({ "users": { $in: [sender, receiver] } });

    await collection.closeCollection();

    if (checkMessage != undefined) {
        checkMessage._id = checkMessage._id.toString();
    }
    return { "hasErrors": false, "message": checkMessage };
}