const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");

const mongo = require("mongodb");
const user = require("./user");

module.exports = {
    create

}

async function create(account, title, price, photos, description) {
    let errors = [];
    if (arguments.length != 5) errors.push("Item create arguments is not correct.");
    if (!(account = check(account, "account"))) errors.push("account is not valid!");
    if (!(title = check(title, "title"))) errors.push("title is not valid!");
    if (!(price = check(price, "price"))) errors.push("price is not valid!");
    if (!(photos = check(photos, "photos"))) errors.push("photos is not valid!");
    if (!(description = check(description, "description"))) errors.push("description is not valid!");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const checkAccount = await user.findOne(account);
    if (checkAccount.hasErrors == true) {
        errors.push("Account is not exist!");
    }

    const itemCol = await collection.getCollection('item');

    let item = {
        "seller": account,
        "status": "selling",
        "date": new Date(),
        "title": title,
        "price": price,
        "photos": photos,
        "description": description
    };

    const insertInfo = await itemCol.insertOne(item);
    if (insertInfo.insertedCount === 0) {
        await collection.closeCollection();
        throw "Can't create item in mongodb, something went wrong, please try again!";
    }

    const insertedItem = await itemCol.findOne({ _id: insertInfo.insertedId });
    if (insertedItem === null) {
        await collection.closeCollection();
        throw "Can't find created comment in mongodb, something went wrong! Please try again!";
    }

    await collection.closeCollection();

    insertedItem._id = insertedItem._id.toString();
    return { "hasErrors": false, "item": insertedItem };
}