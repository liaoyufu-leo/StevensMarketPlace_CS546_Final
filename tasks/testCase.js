// please add data in your collection first and then add test case

const { user } = require("../data/index");
const { item } = require("../data/index");
const { comment } = require("../data/index");
const { transaction } = require("../data/index");
const { chat } = require("../data/index");
main();

async function main() {
    // // user function test case
    // await userCreateTest();
    // await userloginTest();
    // await userForgetPasswordTest();
    // await userUpdateInformationTest();
    // await userFindOneTest();
    await userSearchTest();

    // // item function test case
    // await itemCreateTest();
    // await itemUpdateInfoTest();
    // await itemDeleteTest();
    // await itemFindAllTest();
    // await itemFindOneTest();
    // await itemSearchTest();
    // await itemAddCartTest();
    // await itemRemoveCartTest();

    // // comment function test case
    // await commentCreateTest();

    // // transaction function test case
    // await transactionCreateTest();
    // await transactionGetAllTest();
    // await transactionGetOne();

    // // chat function test case
    // await chatSendTest();
    // await chatGetAllTest();
    // await chatGetOneTest();
}


async function userCreateTest() {
    console.log("This test case should have error in invaild arguments!");
    console.log(await user.create(
        "yliao10stevens.edu",
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

    console.log("This test case should have error for exsit account!");
    console.log(await user.create(
        "yliao10@stevens.edu",
        "Aa!1234567",
        "safs",
        "male",
        {
            "street": "  123 andrew st.",
            "apt": "123",
            "city": "hoboken",
            "state": "new jersey",
            "zipCode": "07030"
        }
    ));

    console.log("This test case just use more spaces in input to check it will not occur error, but an used account error will occur too!");
    console.log(await user.create(
        "   yliao10@stevens.edu   ",
        "Aa!1234567",
        "safs  ",
        "male  ",
        {
            "street": "  123   andrew   st.",
            "apt": "  123  ",
            "city": "  hoboken  ",
            "state": "  new   jersey  ",
            "zipCode": "   07030  "
        }
    ));

    console.log("This test case should success at creating and delete space!");
    console.log(await user.create(
        "   yliao10111@stevens.edu   ",
        "Aa!1234567",
        "safs  ",
        "  male  ",
        {
            "street": "  123   andrew   st.",
            "apt": "  123  ",
            "city": "  hoboken  ",
            "state": "  new   jersey  ",
            "zipCode": "   07030  "
        }
    ));
}

async function userloginTest() {
    console.log("This test case should have error in invalid arguments!");
    console.log(await user.login(
        "  yliAo10stevens.edu   ",
        "Aa!1234567"
    ));

    console.log("This test case should have error in not existed account!");
    console.log(await user.login(
        "   yliao101@stevens.edu   ",
        "Aa!1234567"
    ));

    console.log("This test case should have error in password not correct!");
    console.log(await user.login(
        "   yliao10@stevens.edu   ",
        "Aa!12345671"
    ));

    console.log("This test case should have no error!");
    console.log(await user.login(
        "   yliao10@stevens.edu   ",
        "Aa!1234567"
    ));
}

async function userForgetPasswordTest() {

    console.log("This test case should have error in invalid arguments!");
    console.log(await user.forgetPassword(
        "yliao10stevens.edu",
        "1234567Aa!"
    ));

    console.log("This test case should update success!");
    console.log(await user.forgetPassword(
        "yliao10@stevens.edu",
        "1234567Aa!"
    ));

    console.log("This test case should use new password to login success!");
    console.log(await user.login(
        "yliao10@stevens.edu",
        "1234567Aa!"
    ));
}

async function userUpdateInformationTest() {
    console.log("This test case should have error in account!");
    console.log(await user.updateInformation(
        "yliao10stevens.edu",
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

    console.log("This test case should have error in nickname!");
    console.log(await user.updateInformation(
        "yliao10@stevens.edu",
        "  ",
        "male",
        {
            "street": "123 andrew st.",
            "apt": "123",
            "city": "hoboken",
            "state": "new jersey",
            "zipCode": "07030"
        }
    ));

    console.log("This test case should have error in gender!");
    console.log(await user.updateInformation(
        "yliao10@stevens.edu",
        "Yufu Liao",
        "males",
        {
            "street": "123 andrew st.",
            "apt": "123",
            "city": "hoboken",
            "state": "new jersey",
            "zipCode": "07030"
        }
    ));

    console.log("This test case should have error in address!");
    console.log(await user.updateInformation(
        "yliao10@stevens.edu",
        "Yufu Liao",
        "male",
        {
            "street": "123 andrew st.",
            "apt": "123",
            "city": "hobokens",
            "state": "new jersey",
            "zipCode": "07030"
        }
    ));

    console.log("This test case should have error for same information!");
    console.log(await user.updateInformation(
        "yliao10@stevens.edu",
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

    console.log("This test case should update success!");
    console.log(await user.updateInformation(
        "yliao10@stevens.edu",
        "somegood",
        "male",
        {
            "street": "123 andrew st.",
            "apt": "123",
            "city": "hoboken",
            "state": "new jersey",
            "zipCode": "07030"
        }
    ));

    console.log("This test case should recover information!");
    console.log(await user.updateInformation(
        "yliao10@stevens.edu",
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
}

async function userFindOneTest() {

    console.log("This test case should have error in account!");
    console.log(await user.findOne(
        "yliao10stevens.edu"
    ));

    console.log("This test case should have error in account not exist!");
    console.log(await user.findOne(
        "yliao101@stevens.edu"
    ));

    console.log("This test case should find account success!");
    console.log(await user.findOne(
        "yliao10@stevens.edu"
    ));
}

async function userSearchTest() {
    console.log(await user.search("y", "yliao10@stevens.edu"));
}

async function itemCreateTest() {
    console.log("This test case should have error for not vaild arguments");
    console.log(await item.create(
        "yliao10stevens.edu",
        "   ",
        -1,
        ["aaaabbbbccccdddd1111222233334444.jpg",
            "aaaabbbbccccdddd1111222233334444.png"],
        "try in test case"
    ));

    console.log("This test case should have error for not exist account");
    console.log(await item.create(
        "yliao10111@stevens.edu",
        "try",
        123,
        ["aaaabbbbccccdddd1111222233334444.jpg",
            "aaaabbbbccccdddd1111222233334444.png"],
        "try in test case"
    ));

}

async function itemUpdateInfoTest() {
    const aimItem = (await item.findAll("yliao10@stevens.edu")).items[0];
    console.log("This is the aim item we will test");
    console.log(aimItem);

    console.log("This test case should have error for not vaild arguments");
    console.log(await item.updateInfo(
        "asdasdfa",
        "   ",
        -1,
        ["aaaabbbbccccdddd1111222233334444.jpg",
            "aaaabbbbccccdddd1111222233334444.png"],
        "try in test case"
    ));

    console.log("This test case should have error for not exist item");
    console.log(await item.updateInfo(
        "aaaabbbbccccdddd11112222",
        "try",
        123,
        ["aaaabbbbccccdddd1111222233334444.jpg",
            "aaaabbbbccccdddd1111222233334444.png"],
        "try in test case"
    ));

    console.log("This test case should have error for new information is same as old");
    console.log(await item.updateInfo(
        aimItem._id,
        aimItem.title,
        aimItem.price,
        aimItem.photos,
        aimItem.description
    ));

    console.log("This test case should update success");
    console.log(await item.updateInfo(
        aimItem._id,
        "try",
        12312,
        ["aaaabbbbccccdddd1111222233334444.jpg",
            "aaaabbbbccccdddd1111222233334444.png"],
        "try"
    ));

}

async function itemDeleteTest() {
    const aimItem = (await item.findAll("yliao10@stevens.edu")).items[0];
    console.log("This is the aim item we will test");
    console.log(aimItem);

    console.log("This test case should have error for not vaild arguments");
    console.log(await item.deleteItem(
        "asdasdfa"
    ));

    console.log("This test case should have error for not exist item");
    console.log(await item.deleteItem(
        "aaaabbbbccccdddd11112222"
    ));

    console.log("This test case should success");
    console.log(await item.deleteItem(
        aimItem._id
    ));

}

async function itemFindAllTest() {
    console.log("This test case should have error for not vaild arguments");
    console.log(await item.findAll(
        "asdasdfa"
    ));

    console.log("This test case should success");
    console.log(await item.findAll(
        "yliao10@stevens.edu"
    ));

}

async function itemFindOneTest() {
    const aimItem = (await item.findAll("yliao10@stevens.edu")).items[0];
    console.log("This is the aim item we will test");
    console.log(aimItem);

    console.log("This test case should have error for not vaild arguments");
    console.log(await item.findOne(
        "asdasdfa"
    ));

    console.log("This test case should have error for not exist item");
    console.log(await item.findOne(
        "aaaabbbbccccdddd11112222"
    ));

    console.log("This test case should success");
    console.log(await item.findOne(
        aimItem._id
    ));

}

async function itemSearchTest() {

    console.log("This test case should have error for not vaild arguments");
    console.log(await item.search(
        "    "
    ));

    console.log("This test case should success");
    console.log(await item.search(
        "IPHONE"
    ));

}

async function itemAddCartTest() {

    const aimItem = (await item.findAll("ygandhi2@stevens.edu")).items[0];
    console.log("This is the aim item we will test");
    console.log(aimItem);

    console.log("This test case should have error in invalid arguments!");
    console.log(await item.addCart(
        "yliao10stevens.edu",
        "618d74a35a3c37d918cce32"
    ));

    console.log("This test case should have error in account is not exist!");
    console.log(await item.addCart(
        "yliao1011@stevens.edu",
        aimItem._id
    ));

    console.log("This test case should have error in item is not exist!");
    console.log(await item.addCart(
        "yliao10@stevens.edu",
        "619fc8bbc20ee3426439d4b0"
    ));

    console.log("This test case should add success!");
    console.log(await item.addCart(
        "yliao10@stevens.edu",
        aimItem._id
    ));
}

async function itemRemoveCartTest() {

    const aimItem_id = (await user.findOne("yliao10@stevens.edu")).user.cart[0];
    console.log("This is the aim item we will test");
    console.log(aimItem_id);

    console.log("This test case should have error in invalid arguments!");
    console.log(await item.removeCart(
        "yliao10stevens.edu",
        "618d74a35a3c37d918cce32"
    ));

    console.log("This test case should have error in account is not exist!");
    console.log(await item.removeCart(
        "yliao1011@stevens.edu",
        aimItem_id
    ));

    console.log("This test case should have error in item is not exist!");
    console.log(await item.removeCart(
        "yliao10@stevens.edu",
        "619fc8bbc20ee3426439d4b0"
    ));

    console.log("This test case should add success!");
    console.log(await item.removeCart(
        "yliao10@stevens.edu",
        aimItem_id
    ));
}

async function commentCreateTest() {
    const aimItem = (await item.findAll("yliao10@stevens.edu")).items[0];
    console.log("This is the aim item we will test");
    console.log(aimItem);

    console.log("This test case should have error in invalid arguments!");
    console.log(await comment.create(
        "aaaabbbbcccc11112222333",
        "yliao",
        "modify comments"
    ));

    console.log("This test case should have error in account is not exist!");
    console.log(await comment.create(
        "aaaabbbbcccc111122223333",
        "yliao@stevens.edu",
        "modify comments"
    ));

    console.log("This test case should have error in item is not exist!");
    console.log(await comment.create(
        "aaaabbbbcccc111122223333",
        "yliao10@stevens.edu",
        "modify comments"
    ));

    console.log("This test case should success!");
    console.log(await comment.create(
        aimItem._id,
        "yliao10@stevens.edu",
        "modify comments"
    ));
}

async function transactionCreateTest() {
    const aimItem = (await item.search("desk", "yliao10@stevens.edu")).items[0];
    console.log("This is the aim item we will test");
    console.log(aimItem);

    console.log("This test case should have error in invalid arguments!");
    console.log(await transaction.create(
        "aaaabbbbcccc1111222233",
        "yliao",
        {}
    ));

    console.log("This test case should have error in account is not exist!");
    console.log(await transaction.create(
        aimItem._id,
        "yliao@stevens.edu",
        { "type": "cash" }
    ));

    console.log("This test case should have error in item is not exist!");
    console.log(await transaction.create(
        "aaaabbbbcccc111122223333",
        "yliao10@stevens.edu",
        { "type": "cash" }
    ));

    console.log("This test case should success!");
    console.log(await transaction.create(
        aimItem._id,
        "yliao10@stevens.edu",
        { "type": "cash" }
    ));
}

async function transactionGetAllTest() {

    console.log("This test case should have error in invalid arguments!");
    console.log(await transaction.getAll(
        "yliao"
    ));

    console.log("This test case should have error in account not exist!");
    console.log(await transaction.getAll(
        "yliao121@stevens.edu"
    ));

    console.log("This test case should success!");
    console.log(await transaction.getAll(
        "yliao10@stevens.edu"
    ));
}

async function transactionGetOne() {
    const aimTransaction = (await transaction.getAll("yliao10@stevens.edu")).bought[0];
    console.log("This is the aim transaction we will test");
    console.log(aimTransaction);

    console.log("This test case should have error in invalid arguments!");
    console.log(await transaction.getOne(
        "aaaabbbbcccc111122223",
    ));

    console.log("This test case should have error in transaction is not exist!");
    console.log(await transaction.getOne(
        "aaaabbbbcccc111122223333",
    ));

    console.log("This test case should success!");
    console.log(await transaction.getOne(
        aimTransaction._id
    ));
}

async function chatSendTest() {
    console.log("This test case should have error in invaild arguments!");
    console.log(await chat.send(
        "yliao10stevens.edu",
        "Aa!1234567",
        "  "
    ));

    console.log("This test case should have error for not exsit account!");
    console.log(await chat.send(
        "yliao1012@stevens.edu",
        "yliao1031@stevens.edu",
        "123"
    ));

    console.log("This test case shoule show not allowed to send message to themself!");
    console.log(await chat.send(
        "yliao10@stevens.edu",
        "yliao10@stevens.edu",
        "123"
    ));

    console.log("This test case should success!");
    console.log(await chat.send(
        "yliao10@stevens.edu",
        "ygandhi2@stevens.edu",
        "ygandhi2@stevens.edu"
    ));
}

async function chatGetAllTest() {
    console.log("This test case should have error in invaild arguments!");
    console.log(await chat.getAll(
        "yliao10stevens.edu"
    ));

    console.log("This test case should have error for not exsit account!");
    console.log(await chat.getAll(
        "yliao101@stevens.edu"
    ));

    console.log("This test case should success!");
    console.log(await chat.getAll(
        "yliao10@stevens.edu"
    ));
}

async function chatGetOneTest() {
    console.log("This test case should have error in invaild arguments!");
    console.log(await chat.getOne(
        "yliao10stevens.edu",
        "Aa!1234567"
    ));

    console.log("This test case should have error for not exsit account!");
    console.log(await chat.getOne(
        "yliao1012@stevens.edu",
        "yliao1031@stevens.edu"
    ));

    console.log("This test case should success!");
    console.log(await chat.getOne(
        "yliao10@stevens.edu",
        "ygandhi2@stevens.edu"
    ));
}