const connection = require("../config/mongoConnection");
const collection = require("../config/mongoCollections");

const fs = require("fs");

const { user } = require("../data/index");
const { item } = require("../data/index");
const { comment } = require("../data/index");

main();

async function main() {
    const db = await connection.getDB();
    await db.dropDatabase();
    await connection.closeDB();

    await userSeed();
    await itemSeed();
}

async function userSeed() {
    const userCol = await collection.getCollection("user");
    await userCol.createIndex({ "nickname": "text" });
    await connection.closeDB();

    console.log(await user.create(
        "yliao10@stevens.edu",
        "Aa!1234567",
        "Yufu Liao",
        "male",
        {
            "street": "123 andrew st.",
            "apt": "123",
            "city": "hoboken",
            "state": "new jersey",
            "zipCode": "07030"
        }
    ));

    console.log(await user.create(
        "ygandhi2@stevens.edu",
        "Aa!1234567",
        "Yash Gandhi",
        "male",
        {
            "street": "123 andrew st.",
            "apt": "123",
            "city": "hoboken",
            "state": "new jersey",
            "zipCode": "07030"
        }
    ));

    console.log(await user.create(
        "ajayadev@stevens.edu",
        "Aa!1234567",
        "Aditya Jayadevan Menon",
        "male",
        {
            "street": "123 andrew st.",
            "apt": "123",
            "city": "hoboken",
            "state": "new jersey",
            "zipCode": "07030"
        }
    ));

    console.log(await user.create(
        "bkongara@stevens.edu",
        "Aa!1234567",
        "Balakishore Kongara",
        "male",
        {
            "street": "123 andrew st.",
            "apt": "123",
            "city": "hoboken",
            "state": "new jersey",
            "zipCode": "07030"
        }
    ));

    console.log(await user.create(
        "vkusumur@stevens.edu",
        "Aa!1234567",
        "Venkat Kusumurthy",
        "male",
        {
            "street": "123 andrew st.",
            "apt": "123",
            "city": "hoboken",
            "state": "new jersey",
            "zipCode": "07030"
        }
    ));

}

async function itemSeed() {
    const itemCol = await collection.getCollection("item");
    await itemCol.createIndex({ "title": "text" });
    await connection.closeDB();

    let account = "yliao10@stevens.edu";
    let name = [
        "iphone1",
        "iphone3",
        "iphone4",
        "iphone5",
        "iphone6",
        "iphone7",
        "iphone8",
        "iphone9",
        "iphone10",
        "iphone11",
        "iphone12",
    ];
    let photo = [
        '1d4832eb46696de47a6347c7bd0648c1.jpg',
        '1a9539c895b6457a1ecde44827b9b10b.jpg',
        'cb766c4df27e9ead08f1541fe6239e58.jpg',
        '6a1f6af5f128fe86c813db17a5028ad1.jpg',
        '1175d2a024a5a1d7f88f4471efd402ef.jpg',
        '8aeafe2c96e423b2c63f25238490eed3.jpg',
        'eb8bbed4acd5207f9584cc7255c5a219.jpg',
        '365253d7c8532d346071320eb202c33d.jpg',
        '21033f1d4ff0c301254c99d96d913351.jpg',
        '16050e984aef08ace9819583216d625c.jpg',
        'dc31ed5360fe601e24ce8d0da3902518.jpg'
    ];

    for (let i = 0; i < name.length; i++) {
        console.log(await item.create(account,name[i],i*100+1,[photo[i]],name[i]));
    }
}