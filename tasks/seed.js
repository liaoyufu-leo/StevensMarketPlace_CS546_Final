const connection = require("../config/mongoConnection");
const collection = require("../config/mongoCollections");

const { user } = require("../data/index");
const { item } = require("../data/index");
const { comment } = require("../data/index");
const { transaction } = require("../data/index");
const { chat } = require("../data/index");

const md5 = require("blueimp-md5");
const fs = require("fs");

main();

async function main() {
    const db = await connection.getDB();
    await db.dropDatabase();
    await connection.closeDB();

    await userSeed();
    await itemSeed();
    await commentSeed();
    await transactionSeed();
    await chatSeed();
}

async function userSeed() {
    const userCol = await collection.getCollection("user");
    await userCol.createIndex({ "account": "text" });
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

    let photo2 = [
        '7cd835bab0c29490e50d450bb0a1350a.jpg',
        '5524fa451edcb931ae1d5caed0d9103d.jpg',
        '3f13189a055ca4284d898cc41e5c5997.jpg',
        '769cda4e43ddeb878d74028b08ec2a56.jpg',
        '5583a1e6c9e43b2aeed1473ee37792a6.jpg',
        '2fb12d29231c1d878c72ec9fd1c67488.jpg',
        'acf10edaa996d8a7c72c3cdb334ac65e.jpg',
        'c0822f27e1dc65443c9499675bde7c12.jpg',
        '3c7c035225eb32c0720e653e6fd465f8.jpg',
        '1f212cb6fcb2e9708a7892433b45eae8.jpg',
        '0c09c2ff343ef45d29cee9221f6a7ee6.jpg'
    ];

    for (let i = 0; i < name.length; i++) {
        console.log(await item.create(account, name[i], i * 100 + 99, [photo[i], photo2[i]], name[i]));
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
    let photo3 = [
        '1b1b1f164b70fb8751febf8002697290.jpg',
        'ab61b48e4bfbde249e2bb5bcbbe6df6a.jpg',
        '1a2810090eab18ce9a3d5dc15b5ba9ea.jpg',
        'cbfe547a138724f5965ff9a7f05d6acc.jpg',
        '06be9b6f3797b1dc889e42d2a0fd475d.jpg',
        '90fad45881dc9bdd850c7d1c5c910262.jpg',
        'f2a7aee6dd075495119f00d08bf8b231.jpg'
    ];
    let photo4 = [
        'e2a22bcc75f9c6cc1fc9f331d2fe5273.jpg',
        'c16e128e6ca7a436e83b45963ef9b04e.jpg',
        '97bd18565ead892b36ba696158e1e815.jpg',
        '6fdc61c49105c187612fe8ffa060f3d2.jpg',
        'a9d2a53bbd3b0c7c6c510d31bd2595e9.jpg',
        '8a9dcee588d3306c3730581e2280f01b.jpg',
        '88ab1640b7a1f85d09965fc5d254a110.jpg'
    ];
    for (let i = 0; i < name2.length; i++) {
        console.log(await item.create(account2, name2[i], i * 100 + 99, [photo3[i], photo4[i]], name2[i]));
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

    console.log(await transaction.create(aimItems[1]._id, "yliao10@stevens.edu", { "type": "credit card", "cardNumber": "1234 1234 1234 1234", "validDate": "09/26", "securityCode": "123" }));
}

async function chatSeed() {
    for (let i = 0; i < 10; i++) {
        console.log(await chat.send("yliao10@stevens.edu", "ygandhi2@stevens.edu", "This is the " + i + " message from seed!"));
        console.log(await chat.send("ygandhi2@stevens.edu", "yliao10@stevens.edu", "ygandhi2 get message" + i + "!"));
        console.log(await chat.send("yliao10@stevens.edu", "ajayadev@stevens.edu", "This is the " + i + " message from seed!"));
        console.log(await chat.send("ajayadev@stevens.edu", "yliao10@stevens.edu", "ajayadev get message" + i + "!"));
        console.log(await chat.send("yliao10@stevens.edu", "bkongara@stevens.edu", "This is the " + i + " message from seed!"));
        console.log(await chat.send("bkongara@stevens.edu", "yliao10@stevens.edu", "bkongara get message" + i + "!"));
        console.log(await chat.send("yliao10@stevens.edu", "vkusumur@stevens.edu", "This is the " + i + " message from seed!"));
        console.log(await chat.send("vkusumur@stevens.edu", "yliao10@stevens.edu", "vkusumur get message" + i + "!"));
    }

}


// storePhotos();

async function storePhotos() {
    let name2 = [
        "desk lamp",
        "official desk",
        "mouse",
        "laptop",
        "desk arm",
        "mark cup",
        "time clock"
    ]

    let photo4 = [
        'e2a22bcc75f9c6cc1fc9f331d2fe5273.jpg',
        'c16e128e6ca7a436e83b45963ef9b04e.jpg',
        '97bd18565ead892b36ba696158e1e815.jpg',
        '6fdc61c49105c187612fe8ffa060f3d2.jpg',
        'a9d2a53bbd3b0c7c6c510d31bd2595e9.jpg',
        '8a9dcee588d3306c3730581e2280f01b.jpg',
        '88ab1640b7a1f85d09965fc5d254a110.jpg'
    ];

    // name2.forEach(element => {
    //     photo4.push(md5(element + new Date()) + '.jpg');
    // });

    // console.log(photo4)

    // for (let i = 0; i < name2.length; i++) {
    //     fs.renameSync("./public/images/" + name2[i] + '.jpg', "./public/images/"+ photo4[i] );
    // }

}