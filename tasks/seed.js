const connection = require("../config/mongoConnection");
const collection = require("../config/mongoCollections");

const md5 = require("blueimp-md5");
const fs = require("fs");

const { user } = require("../data/index");
const { item } = require("../data/index");
const { comment } = require("../data/index");
const { transaction } = require("../data/index");
const { message } = require("../data/index");

main();

async function main() {
    const db = await connection.getDB();
    await db.dropDatabase();
    await connection.closeDB();

    await userSeed();
    await itemSeed();
    await commentSeed();
    await transactionSeed();
    await messageSeed();
}

async function userSeed() {
    const userCol = await collection.getCollection("user");
    await userCol.createIndex({ "nickname": "text" });
    await connection.closeDB();

    console.log(await user.create(
        "yliao10@stevens.edu",
        "Lunatic3548!",
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
        "iphone 1",
        "iphone 3",
        "iphone 4",
        "iphone 5",
        "iphone 6",
        "iphone 7",
        "iphone 8",
        "iphone 9",
        "iphone 10",
        "iphone 11",
        "iphone 12",
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
        console.log(await item.create(account, name[i], i * 100 + 99, [photo[i]], name[i]));
    }

    let account2 = "ygandhi2@stevens.edu";
    let name2 = [
        "desk lamp",
        "official desk",
        "mouse",
        "laptop",
        "desk arm",
        "mark cup",
        "time clock"
    ]
    let photo2 = [
        '1b1b1f164b70fb8751febf8002697290.jpg',
        'ab61b48e4bfbde249e2bb5bcbbe6df6a.jpg',
        '1a2810090eab18ce9a3d5dc15b5ba9ea.jpg',
        'cbfe547a138724f5965ff9a7f05d6acc.jpg',
        '06be9b6f3797b1dc889e42d2a0fd475d.jpg',
        '90fad45881dc9bdd850c7d1c5c910262.jpg',
        'f2a7aee6dd075495119f00d08bf8b231.jpg'
    ];
    for (let i = 0; i < name2.length; i++) {
        console.log(await item.create(account2, name2[i], i * 100 + 99, [photo2[i]], name2[i]));
    }

    const aimItem = (await item.findAll("ygandhi2@stevens.edu")).items[0];
    console.log(await item.addCart("yliao10@stevens.edu", aimItem._id));
}

async function commentSeed() {
    const aimItem = (await item.findAll("yliao10@stevens.edu")).items[0];
    console.log(await comment.create(aimItem._id, "yliao10@stevens.edu", "This is the first comment."));
}

async function transactionSeed() {
    const aimItems = (await item.findAll("ygandhi2@stevens.edu")).items;

    console.log(await transaction.create(aimItems[0]._id, "yliao10@stevens.edu", { "type": "cash" }));
    console.log(await transaction.create(aimItems[1]._id, "yliao10@stevens.edu", { "type": "credit card", "card number": "1234 1234 1234 1234", "valid date": "09/26", "security code": "123" }));
}

async function messageSeed() {
    console.log(await message.send("yliao10@stevens.edu", "ygandhi2@stevens.edu", "This is the first message from seed!"))
}