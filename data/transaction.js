const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");

const mongo = require("mongodb");
const user = require("./user");

module.exports = {
    create,
    getAll,
    changeStatus
}

async function create(item_id,buyer,type){
    let errors = [];
    if (arguments.length != 3) errors.push("Transaction create arguments is not correct.");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("Item_id is not valid.");
    if (!(buyer = check(buyer, "account"))) errors.push("Account is not valid!");
    if (!(type = check(type, "type"))) errors.push("type is not valid.");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    // check item exist

    const checkAccount = await user.findOne(account);
    if (checkAccount.hasErrors == true) {
        errors.push("Account is not exist!");
    }

    let transaction = {
        "item_id" : item_id,
        "buyer": buyer,
        "date": new Date(),
        "type": "credit card",
        "status": "delivering"
    }

    const transactionCol = await collection.getCollection('transaction');

    const insertInfo = await transactionCol.insertOne(transaction);
    if (insertInfo.insertedCount === 0) {
        await collection.closeCollection();
        throw "Can't create transaction in mongodb, something went wrong, please try again!";
    }

    const insertedTransaction = await commentCol.findOne({ _id: insertInfo.insertedId });
    if (insertedTransaction === null) {
        await collection.closeCollection();
        throw "Can't find created transaction in mongodb, something went wrong! Please try again!";
    }

    await collection.closeCollection();


}