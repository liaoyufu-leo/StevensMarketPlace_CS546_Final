const { check } = require('../config/check');
const mongo = require("mongodb");
const { ObjectId } = require("bson");
const collection = require("../config/mongoCollections");

module.exports = {
    create
}

async function create(account, password, nickName, gender, address) {
    let errors = [];
    if (arguments.length != 5) errors.push("User create arguments is not correct\n");
    if (!(account = check(account, "account"))) errors.push("Account is not valid\n");
    if (!(password = check(password, "password"))) errors.push("Password is not valid\n");
    if (!(nickName = check(nickName, "nickName"))) errors.push("NickName is not valid\n");
    if (!(gender = check(gender, "gender"))) errors.push("Gender is not valid\n");
    if (!(address = check(address, "address"))) errors.push("Address is not valid\n");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    let user = {
        "account": account,
        "password": password,
        "nickName": nickName,
        "gender": gender,
        "address": address,
        "cart": []
    }

    const col = await collection.getCollection('user');

    const checkAccount = await col.findOne({ "account": account });
    if (checkAccount != null) {
        await collection.closeCollection();
        errors.push("This account email has been used, please change another email");
        return { "hasErrors": true, "errors": errors };
    }

    const insertInfo = await col.insertOne(user);
    if (insertInfo.insertedCount === 0) {
        await collection.closeCollection();
        throw "Can't create account in mongodb, something went wrong, please try again!";
    }

    const insertedUser = await col.findOne({ _id: insertInfo.insertedId });
    if (insertedUser === null) {
        await collection.closeCollection();
        throw "Can't find created account in mongodb, something went wrong! Please try again.";
    }
    await collection.closeCollection();

    insertedUser._id = insertedUser._id.toString();
    return { "hasErrors": false, "user": insertedUser };
}

async function login(account, password) {
    let errors = [];
    if (arguments.length != 2) errors.push("User login arguments is not correct\n");
    if (!(account = check(account, "account"))) errors.push("Account is not valid\n");
    if (!(password = check(password, "password"))) errors.push("Password is not valid\n");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const col = await collection.getCollection('user');
    const checkAccount = await col.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("This account is not exist.");
        return { "hasErrors": true, "errors": errors };
    }

    if (checkAccount.password != password) {
        await collection.closeCollection();
        errors.push("Password is not correct.");
        return { "hasErrors": true, "errors": errors };
    }

    await collection.closeCollection();

    checkAccount._id = checkAccount._id.toString();
    return { "hasErrors": false, "user": checkAccount };
}

async function updatePassword(user_id, oldPassword, newPassword) {
    let errors = [];
    if (arguments.length != 3) errors.push("User updatePassword arguments is not correct\n");
    if (!(user_id = check(user_id, "id"))) errors.push("user_id is not valid\n");
    if (!(oldPassword = check(oldPassword, "password"))) errors.push("OldPassword is not valid\n");
    if (!(newPassword = check(newPassword, "password"))) errors.push("newPassword is not valid\n");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const col = await collection.getCollection('user');
    const checkAccount = await col.findOne({ "_id": user_id });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("This account is not exist.");
        return { "hasErrors": true, "errors": errors };
    }

    if (checkAccount.password != oldPassword) {
        await collection.closeCollection();
        errors.push("Password is not correct.");
        return { "hasErrors": true, "errors": errors };
    }

    const updatedInfo = await col.updateOne(
        { _id: user_id },
        { $set: { "password": newPassword } }
    );
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw "Can't update password in mongodb, something went wrong, please try again!";
    }

    const updatedUser = await col.findOne({ _id: insertInfo.insertedId });
    if (updatedUser === null) {
        await collection.closeCollection();
        throw "Can't find updated account in mongodb, something went wrong! Please try again.";
    }
    await collection.closeCollection();

    updatedUser._id = updatedUser._id.toString();
    return { "hasErrors": false, "user": updatedUser };
}

async function forgetPassword(account) {
    let errors = [];
    if (arguments.length != 1) errors.push("User login arguments is not correct\n");
    if (!(account = check(account, "account"))) errors.push("Account is not valid\n");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const col = await collection.getCollection('user');
    const checkAccount = await col.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("This account is not exist.");
        return { "hasErrors": true, "errors": errors };
    }

    await collection.closeCollection();

    checkAccount._id = checkAccount._id.toString();
    return { "hasErrors": false, "user": checkAccount };
}

async function findOne(user_id) {
    let errors = [];
    if (arguments.length != 1) errors.push("User findOne arguments is not correct\n");
    if (!(user_id = check(user_id, "id"))) errors.push("user_id is not valid\n");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const col = await collection.getCollection('user');
    const checkAccount = await col.findOne({ "_id": user_id });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("This account is not exist.");
        return { "hasErrors": true, "errors": errors };
    }

    await collection.closeCollection();

    checkAccount._id = checkAccount._id.toString();
    return { "hasErrors": false, "user": checkAccount };
}

async function cart(user_id, item_id) {
    let errors = [];
    if (arguments.length != 2) errors.push("User cart arguments is not correct\n");
    if (!(user_id = check(user_id, "id"))) errors.push("user_id is not valid\n");
    if (!(item_id = check(item_id, "id"))) errors.push("item_id is not valid\n");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const col = await collection.getCollection('user');
    const checkAccount = await col.findOne({ "_id": user_id });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("This account is not exist.");
        return { "hasErrors": true, "errors": errors };
    }

    const updatedInfo = await col.updateOne({ _id: user_id }, { $push: { "cart": item_id } });
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw "Could not add item to user's cart in mongodb, something went wrong! Please try again.";
    }

    const updatedUser = await col.findOne({ _id: user_id });
    if (updatedUser === null) {
        await collection.closeCollection();
        throw "Can't find updated account in mongodb, something went wrong! Please try again.";
    }

    await collection.closeCollection();

    updatedUser._id = updatedUser._id.toString();
    return { "hasErrors": false, "user": updatedUser };
}

async function removeCart(user_id, item_id) {
    let errors = [];
    if (arguments.length != 2) errors.push("User cart arguments is not correct\n");
    if (!(user_id = check(user_id, "id"))) errors.push("user_id is not valid\n");
    if (!(item_id = check(item_id, "id"))) errors.push("item_id is not valid\n");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const col = await collection.getCollection('user');
    const checkAccount = await col.findOne({ "_id": user_id });
    if (checkAccount != null) {
        await collection.closeCollection();
        errors.push("This account is not exist.");
        return { "hasErrors": true, "errors": errors };
    }

    const item = await col.findOne({ "_id": user_id, "cart": { $elemMatch: item_id } });
    if (item == null) {
        await collection.closeCollection();
        errors.push("User didn't have this item in cart.");
        return { "hasErrors": true, "errors": errors };
    }

    const updatedInfo = await col.updateOne({ _id: user_id }, { $pull: { "cart": item_id } });
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw "Could not add item to user's cart in mongodb, something went wrong! Please try again.";
    }

    const updatedUser = await col.findOne({ _id: user_id });
    if (updatedUser === null) {
        await collection.closeCollection();
        throw "Can't find updated account in mongodb, something went wrong! Please try again.";
    }

    await collection.closeCollection();

    updatedUser._id = updatedUser._id.toString();
    return { "hasErrors": false, "user": updatedUser };
}