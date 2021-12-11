const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

module.exports = {
    create,
    login,
    updateInformation,
    forgetPassword,
    findOne,
    search
}

async function create(account, password, nickname, gender, address) {
    let errors = [];
    if (arguments.length != 5) errors.push("arguments");
    if (!(account = check(account, "account"))) errors.push("account");
    if (!(password = check(password, "password"))) errors.push("password");
    if (!(nickname = check(nickname, "nickname"))) errors.push("nickname");
    if (!(gender = check(gender, "gender"))) errors.push("gender");
    if (!(address = check(address, "address"))) errors.push("address");


    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    let user = {
        "account": account,
        "password": await bcrypt.hash(password, saltRounds),
        "nickname": nickname,
        "gender": gender,
        "address": address,
        "cart": []
    }

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount != null) {
        await collection.closeCollection();
        errors.push("account exist");
        return { "hasErrors": true, "errors": errors };
    }

    const insertInfo = await userCol.insertOne(user);
    if (insertInfo.insertedCount === 0) {
        await collection.closeCollection();
        throw "Can't create account in mongodb, something went wrong, please try again!";
    }

    const insertedUser = await userCol.findOne({ _id: insertInfo.insertedId });
    if (insertedUser === null) {
        await collection.closeCollection();
        throw "Can't find created account in mongodb, something went wrong! Please try again!";
    }
    await collection.closeCollection();

    insertedUser._id = insertedUser._id.toString();
    return { "hasErrors": false, "user": insertedUser };
}

async function login(account, password) {
    let errors = [];
    if (arguments.length != 2) errors.push("arguments");
    if (!(account = check(account, "account"))) errors.push("account");
    if (!(password = check(password, "password"))) errors.push("password");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("account not exist");
        return { "hasErrors": true, "errors": errors };
    }

    if (! await bcrypt.compare(password, checkAccount.password)) {
        await collection.closeCollection();
        errors.push("password not correct");
        return { "hasErrors": true, "errors": errors };
    }

    await collection.closeCollection();

    checkAccount._id = checkAccount._id.toString();
    for (let i = 0; i < checkAccount.cart.length; i++) {
        checkAccount.cart[i] = checkAccount.cart[i].toString();
    }
    return { "hasErrors": false, "user": checkAccount };
}

async function forgetPassword(account, newPassword) {
    let errors = [];
    if (arguments.length != 2) errors.push("arguments");
    if (!(account = check(account, "account"))) errors.push("account");
    if (!(newPassword = check(newPassword, "password"))) errors.push("password");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("account not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    if (await bcrypt.compare(newPassword, checkAccount.password)) {
        await collection.closeCollection();
        errors.push("same");
        return { "hasErrors": true, "errors": errors };
    }

    const updatedInfo = await userCol.updateOne(
        { "account": account },
        { $set: { "password": await bcrypt.hash(newPassword, saltRounds) } }
    );
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw "Can't update password in mongodb, something went wrong, please try again!";
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

async function updateInformation(account, nickname, gender, address) {
    let errors = [];
    if (arguments.length != 4) errors.push("arguments");
    if (!(account = check(account, "account"))) errors.push("account");
    if (!(nickname = check(nickname, "nickname"))) errors.push("nickname");
    if (!(gender = check(gender, "gender"))) errors.push("gender");
    if (!(address = check(address, "address"))) errors.push("address");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("account not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    if (checkAccount.nickname == nickname &&
        checkAccount.gender == gender &&
        checkAccount.address.street == address.street &&
        checkAccount.address.apt == address.apt &&
        checkAccount.address.city == address.city &&
        checkAccount.address.state == address.state &&
        checkAccount.address.zipCode == address.zipCode) {
        await collection.closeCollection();
        errors.push("same");
        return { "hasErrors": true, "errors": errors };
    }

    let newUser = {
        "account": account,
        "password": checkAccount.password,
        "nickname": nickname,
        "gender": gender,
        "address": address,
        "cart": checkAccount.cart
    }

    const updatedInfo = await userCol.updateOne(
        { "account": account },
        { $set: newUser }
    );
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw "Can't update password in mongodb, something went wrong, please try again!";
    }

    const updatedUser = await userCol.findOne({ "account": account });
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

async function findOne(account) {
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

    await collection.closeCollection();

    checkAccount._id = checkAccount._id.toString();
    for (let i = 0; i < checkAccount.cart.length; i++) {
        checkAccount.cart[i] = checkAccount.cart[i].toString();
    }
    return { "hasErrors": false, "user": checkAccount };
}

async function search(keyword, account) {
    let errors = [];
    if (arguments.length != 2) errors.push("arguments");
    if ((keyword = check(keyword, "keyword")) === false) errors.push("keyword");
    if (!(account = check(account, "account"))) errors.push("account");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const users = await userCol.find(
        {
            $and: [{ "account": { $ne: account } },
            { "account": new RegExp(keyword) }]
        },
        { projection: { "account": 1, "_id": 0 } }).toArray();

    await collection.closeCollection();

    return { "hasErrors": false, "users": users };
}