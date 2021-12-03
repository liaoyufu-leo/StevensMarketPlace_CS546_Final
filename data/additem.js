const mongoCollections = require('../config/mongoCollections');
const products = mongoCollections.item
const ObjectId = require("mongodb").ObjectId

async function additem(vendor, contactInfo, productName, category, description, price, image){
    if(!vendor || !contactInfo || !productName || !category || !description || !price || !image) throw `Error: missing data`
    if(typeof(vendor) !== "string" || typeof(contactInfo) !== "string" || typeof(productName) !== "string" || typeof(category) !== "string" || typeof(image)!=="string") throw `Error: must be a string`
    if(typeof(price) !== "number") throw `Error: must be number`
    
    const productCollection = await products()
    let object = {
        'vendor': vendor,
        'contactInfo': contactInfo,
        'productName' : productName,
        'category': category,
        'description' : description,
        'price': price,
        'image': image,
    }

    const add = await productCollection.insertOne(object);
    if(add.insertedCount===0) throw `Error: could not add listing`
    const new_iD = add.inserted_id;

    return await this.getitem(new_id);

    // if(listingData.vendor === null) throw "Product must have a creator"
    // if(listingData.productName === null) throw "Listing must have a title"
    // if(listingData.price === null) throw "Listing must have a price"
    // if(listingData.description === null) throw "Listing must have a description"
    // if(listingData.contactInfo === null) throw "Listing must have a description"

}

module.exports = {
    getitem,additem
}