const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

module.exports = {
    create,
    login,
    updatePassword,
    updateInformation,
    forgetPassword,
    findOne
}

async function create(account, password, nickName, gender, address) {
    let errors = [];
    if (arguments.length != 5) errors.push("User create arguments is not correct.");
    if (!(account = check(account, "account"))) errors.push("Account is not valid.");
    if (!(password = check(password, "password"))) errors.push("Password is not valid.");
    if (!(nickName = check(nickName, "nickName"))) errors.push("NickName is not valid.");
    if (!(gender = check(gender, "gender"))) errors.push("Gender is not valid.");
    if (!(address = check(address, "address"))) errors.push("Address is not valid.");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    let user = {
        "account": account,
        "password": await bcrypt.hash(password, saltRounds),
        "nickName": nickName,
        "gender": gender,
        "address": address,
        "cart": []
    }

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount != null) {
        await collection.closeCollection();
        errors.push("This account email had been used, please change another email!");
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
    if (arguments.length != 2) errors.push("User login arguments is not correct!");
    if (!(account = check(account, "account"))) errors.push("Account is not valid!");
    if (!(password = check(password, "password"))) errors.push("Password is not valid!");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');
    
    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("This account is not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    if (! await bcrypt.compare(password, checkAccount.password)) {
        await collection.closeCollection();
        errors.push("Password is not correct!");
        return { "hasErrors": true, "errors": errors };
    }

    await collection.closeCollection();

    checkAccount._id = checkAccount._id.toString();
    for (let i = 0; i < checkAccount.cart.length; i++) {
        checkAccount.cart[i] = checkAccount.cart[i].toString();
    }
    return { "hasErrors": false, "user": checkAccount };
}

async function updatePassword(account, oldPassword, newPassword) {
    let errors = [];
    if (arguments.length != 3) errors.push("User updatePassword arguments is not correct!");
    if (!(user_id = check(account, "account"))) errors.push("account is not valid!");
    if (!(oldPassword = check(oldPassword, "password"))) errors.push("OldPassword is not valid!");
    if (!(newPassword = check(newPassword, "password"))) errors.push("NewPassword is not valid!");
    if (oldPassword == newPassword) errors.push("NewPassword is same as oldPassword!");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');
    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("This account is not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    if (! await bcrypt.compare(oldPassword, checkAccount.password)) {
        await collection.closeCollection();
        errors.push("Oldpassword is not correct!");
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
        throw "Can't find updated account in mongodb, something went wrong, Please try again!";
    }
    await collection.closeCollection();

    updatedUser._id = updatedUser._id.toString();
    for (let i = 0; i < updatedUser.cart.length; i++) {
        updatedUser.cart[i] = updatedUser.cart[i].toString();
    }
    return { "hasErrors": false, "user": updatedUser };
}

async function forgetPassword(account, newPassword) {
    let errors = [];
    if (arguments.length != 2) errors.push("User login arguments is not correct!");
    if (!(account = check(account, "account"))) errors.push("Account is not valid!");
    if (!(newPassword = check(newPassword, "password"))) errors.push("NewPassword is not valid!");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("This account is not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    if (await bcrypt.compare(newPassword, checkAccount.password)) {
        await collection.closeCollection();
        errors.push("New password is same as old password, it should not be changed!");
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

async function updateInformation(account, nickName, gender, address) {
    let errors = [];
    if (arguments.length != 4) errors.push("User updateInformation arguments is not correct.");
    if (!(account = check(account, "account"))) errors.push("Account is not valid.");
    if (!(nickName = check(nickName, "nickName"))) errors.push("NickName is not valid.");
    if (!(gender = check(gender, "gender"))) errors.push("Gender is not valid.");
    if (!(address = check(address, "address"))) errors.push("Address is not valid.");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("This account email is not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    if (checkAccount.nickName == nickName &&
        checkAccount.gender == gender &&
        checkAccount.address.street == address.street &&
        checkAccount.address.apt == address.apt &&
        checkAccount.address.city == address.city &&
        checkAccount.address.state == address.state &&
        checkAccount.address.zipCode == address.zipCode) {
        await collection.closeCollection();
        errors.push("This account new information is the same as old information, please try again!");
        return { "hasErrors": true, "errors": errors };
    }

    let newUser = {
        "account": account,
        "password": checkAccount.password,
        "nickName": nickName,
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
    if (arguments.length != 1) errors.push("User findOne arguments is not correct!");
    if (!(account = check(account, "account"))) errors.push("account is not valid!");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');
    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("This account is not exist!");
        return { "hasErrors": true, "errors": errors };
    }

    await collection.closeCollection();

    checkAccount._id = checkAccount._id.toString();
    for (let i = 0; i < checkAccount.cart.length; i++) {
        checkAccount.cart[i] = checkAccount.cart[i].toString();
    }
    return { "hasErrors": false, "user": checkAccount };
}