const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");

const mongo = require("mongodb");

module.exports = {
    create,
    getAll,
    getOne
}

async function create(item_id, account, payment) {
    let errors = [];
    if (arguments.length != 3) errors.push("arguments");
    if (!(item_id = check(item_id, "id") ? (mongo.ObjectId.isValid(item_id) ? mongo.ObjectId(item_id) : false) : false)) errors.push("item_id");
    if (!(account = check(account, "account"))) errors.push("account");
    if (!(payment = check(payment, "payment"))) errors.push("payment");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const itemCol = await collection.getCollection('item');

    const checkItem = await itemCol.findOne({ "_id": item_id });
    if (checkItem == null) {
        await collection.closeCollection();
        errors.push("item not exist");
        return { "hasErrors": true, "errors": errors };
    }
    if (checkItem.status != "selling") {
        await collection.closeCollection();
        errors.push("item not selling");
        return { "hasErrors": true, "errors": errors };
    }
    if (checkItem.seller == account) {
        await collection.closeCollection();
        errors.push("same");
        return { "hasErrors": true, "errors": errors };
    }

    const userCol = await collection.getCollection('user');

    const checkAccount = await userCol.findOne({ "account": account });
    if (checkAccount == null) {
        await collection.closeCollection();
        errors.push("account not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const transactionCol = await collection.getCollection('transaction');

    let transaction = {
        "item_id": item_id,
        "seller": checkItem.seller,
        "buyer": account,
        "date": new Date(),
        "price": checkItem.price,
        "payment": payment,
        "status": "completed"
    }

    const insertInfo = await transactionCol.insertOne(transaction);
    if (insertInfo.insertedCount === 0) {
        await collection.closeCollection();
        throw "Can't create transaction in mongodb, something went wrong, please try again!";
    }

    const updatedInfo = await itemCol.updateOne(
        { "_id": item_id },
        { $set: { "status": "sold" } }
    );

    const updatedcart = await userCol.updateMany({ "cart": { $in: [item_id] } }, { $pull: { "cart": item_id } });

    const insertedTransaction = await transactionCol.findOne({ _id: insertInfo.insertedId });
    if (insertedTransaction === null) {
        await collection.closeCollection();
        throw "Can't find created transaction in mongodb, something went wrong! Please try again!";
    }

    await collection.closeCollection();

    insertedTransaction._id = insertedTransaction._id.toString();
    insertedTransaction.item_id = insertedTransaction.item_id.toString();
    return { "hasErrors": false, "transaction": insertedTransaction };
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

    const transactionCol = await collection.getCollection('transaction');

    const soldTransactions = await transactionCol.find({ "seller": account }).toArray();
    const boughtTransactions = await transactionCol.find({ "buyer": account }).toArray();

    await collection.closeCollection();

    soldTransactions.forEach(element => {
        element._id = element._id.toString();
        element.item_id = element.item_id.toString();
    });
    boughtTransactions.forEach(element => {
        element._id = element._id.toString();
        element.item_id = element.item_id.toString();
    });
    return { "hasErrors": false, "sold": soldTransactions, "bought": boughtTransactions };
}

async function getOne(transaction_id) {
    let errors = [];
    if (arguments.length != 1) errors.push("arguments");
    if (!(transaction_id = check(transaction_id, "id") ? (mongo.ObjectId.isValid(transaction_id) ? mongo.ObjectId(transaction_id) : false) : false)) errors.push("transaction_id");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const transactionCol = await collection.getCollection('transaction');

    const checkTrasaction = await transactionCol.findOne({ "_id": transaction_id });
    if (checkTrasaction == null) {
        await collection.closeCollection();
        errors.push("transaction not exist");
        return { "hasErrors": true, "errors": errors };
    }

    await collection.closeCollection();

    checkTrasaction._id = checkTrasaction._id.toString();
    checkTrasaction.item_id = checkTrasaction.item_id.toString();
    return { "hasErrors": false, "transaction": checkTrasaction };
}