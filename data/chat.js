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
        errors.push("receiver not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const chatCol = await collection.getCollection('chat');

    const checkchat = await chatCol.findOne({ "users": { $all: [sender, receiver] } });

    let message = {
        "sender": sender,
        "date": new Date(),
        "message": content
    };
    if (checkchat == undefined) {
        const updatedInfo = await chatCol.insertOne({
            "users": [sender, receiver],
            "messages": [message]
        });
        if (updatedInfo.modifiedCount === 0) {
            await collection.closeCollection();
            throw "Can't create chat in mongodb, something went wrong, please try again!";
        }

        const insertedChat = await chatCol.findOne({ "users": { $all: [sender, receiver] } });
        if (insertedChat === null) {
            await collection.closeCollection();
            throw "Can't find created chat in mongodb, something went wrong! Please try again!";
        }

        await collection.closeCollection();

        insertedChat._id = insertedChat._id.toString();
        return { "hasErrors": false, "chat": insertedChat };
    } else {
        const updatedInfo = await chatCol.updateOne({ "users": { $all: [sender, receiver] } }, { $push: { "messages": message } });
        if (updatedInfo.modifiedCount === 0) {
            await collection.closeCollection();
            throw "Can't insert message in mongodb, something went wrong, please try again!";
        }

        const insertedChat = await chatCol.findOne({ "users": { $all: [sender, receiver] } });
        if (insertedChat === null) {
            await collection.closeCollection();
            throw "Can't find created message in mongodb, something went wrong! Please try again!";
        }

        await collection.closeCollection();

        insertedChat._id = insertedChat._id.toString();
        return { "hasErrors": false, "chat": insertedChat };
    }

}

async function getAll(account) {
    let errors = [];
    if (arguments.length != 1) errors.push("arguments");
    if (!(account = check(account, "account"))) errors.push("account");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("account not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const chatCol = await collection.getCollection('chat');

    const chats = await chatCol.find({ "users": { $all: [account] } }).toArray();

    await collection.closeCollection();

    chats.forEach(element => {
        element._id = element._id.toString();
    });
    return { "hasErrors": false, "chats": chats };
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
        errors.push("sender not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const checkAccount2 = await userCol.findOne({ "account": receiver });
    if (checkAccount2 == null) {
        await collection.closeCollection();
        errors.push("receiver not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const chatCol = await collection.getCollection('chat');

    const checkChat = await chatCol.findOne({ "users": { $all: [sender, receiver] } });

    await collection.closeCollection();

    if (checkChat != undefined) {
        checkChat._id = checkChat._id.toString();
    }
    return { "hasErrors": false, "chat": checkChat };
}