// please add data in your collection first and then add test case

const { user } = require("../data/index");

// userCreateTest();
userloginTest();
// userUpdatePasswordTest();
// userForgetPasswordTest();
// userUpdateInformationTest();
// userFindOneTest();
// userAddCartTest();
// userRemoveCartTest();

async function userCreateTest() {
    console.log("This test case should have error in account!");
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

    console.log("This test case should have error in password!");
    console.log(await user.create(
        "yliao10@stevens.edu",
        "Aa!",
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
    console.log(await user.create(
        "yliao10@stevens.edu",
        "Aa!1234567",
        "   ",
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
    console.log(await user.create(
        "yliao10@stevens.edu",
        "Aa!1234567",
        "safs",
        "asdfa",
        {
            "street": "123 andrew st.",
            "apt": "123",
            "city": "hoboken",
            "state": "new jersey",
            "zipCode": "07030"
        }
    ));

    console.log("This test case should have error in address!");
    console.log(await user.create(
        "yliao10@stevens.edu",
        "Aa!1234567",
        "safs",
        "male",
        {
            "street": "123 andrew st.",
            "apt": "123",
            "city": "hoboken",
            "state": "jersey",
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
}

async function userloginTest() {
    console.log("This test case should have error in account!");
    console.log(await user.login(
        "  yliAo10stevens.edu   ",
        "Aa!1234567"
    ));

    console.log("This test case should have error in password!");
    console.log(await user.login(
        "   yliao10@stevens.edu   ",
        "Aa!123456"
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

async function userUpdatePasswordTest() {

    console.log("This test case should have error in account!");
    console.log(await user.updatePassword(
        "yliao10stevens.edu",
        "Aa!1234567",
        "1234567Aa!"
    ));

    console.log("This test case should have error in oldPassword!");
    console.log(await user.updatePassword(
        "yliao10@stevens.edu",
        "Aa!123456",
        "1234567Aa!"
    ));

    console.log("This test case should have error in newPassword!");
    console.log(await user.updatePassword(
        "yliao10@stevens.edu",
        "Aa!1234567",
        "1234567Aa"
    ));

    console.log("This test case should have error in oldPassword and newPassword same!");
    console.log(await user.updatePassword(
        "yliao10@stevens.edu",
        "Aa!1234567",
        "Aa!1234567"
    ));

    console.log("This test case should have error in account not exist!");
    console.log(await user.updatePassword(
        "yliao101@stevens.edu",
        "Aa!1234567",
        "1234567Aa!"
    ));

    console.log("This test case should have error in oldPassword not correct!");
    console.log(await user.updatePassword(
        "yliao10@stevens.edu",
        "Aa!12345671",
        "1234567Aa!"
    ));

    console.log("This test case should update success!");
    console.log(await user.updatePassword(
        "yliao10@stevens.edu",
        "Aa!1234567",
        "1234567Aa!"
    ));

    console.log("This test case should use new password to login success!");
    console.log(await user.login(
        "yliao10@stevens.edu",
        "1234567Aa!"
    ));

    console.log("This test case just recover password!");
    console.log(await user.updatePassword(
        "yliao10@stevens.edu",
        "1234567Aa!",
        "Aa!1234567"
    ));

}

async function userForgetPasswordTest() {

    console.log("This test case should have error in account!");
    console.log(await user.forgetPassword(
        "yliao10stevens.edu",
        "1234567Aa!"
    ));

    console.log("This test case should have error in newPassword!");
    console.log(await user.forgetPassword(
        "yliao10@stevens.edu",
        "1234567Aa"
    ));

    console.log("This test case should have error in newPassword same as oldPassword!");
    console.log(await user.forgetPassword(
        "yliao10@stevens.edu",
        "Aa!1234567"
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

    console.log("This test case just recover password!");
    console.log(await user.updatePassword(
        "yliao10@stevens.edu",
        "1234567Aa!",
        "Aa!1234567"
    ));
}

async function userUpdateInformationTest(){
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

async function userAddCartTest() {

    console.log("This test case should have error in account!");
    console.log(await user.addCart(
        "yliao10stevens.edu",
        "618d74a35a3c37d918cce32e"
    ));

    console.log("This test case should have error in item_id!");
    console.log(await user.addCart(
        "yliao10@stevens.edu",
        "618d74a35a3c37d918cce2e"
    ));

    console.log("This test case should add success!");
    console.log(await user.addCart(
        "yliao10@stevens.edu",
        "618d74a35a3c37d918cce34e"
    ));

    console.log("This test case should have error in exist item_id!");
    console.log(await user.addCart(
        "yliao10@stevens.edu",
        "618d74a35a3c37d918cce34e"
    ));
}

async function userRemoveCartTest(){
    console.log("This test case should have error in account!");
    console.log(await user.removeCart(
        "yliao10stevens.edu",
        "618d74a35a3c37d918cce32e"
    ));

    console.log("This test case should have error in item_id!");
    console.log(await user.removeCart(
        "yliao10@stevens.edu",
        "618d74a35a3c37d918cce3e"
    ));

    console.log("This test case should not found item in user cart!");
    console.log(await user.removeCart(
        "yliao10@stevens.edu",
        "618d74a35a3c37d918cce37e"
    ));

    console.log("This test case should remove item from user cart succuss!");
    console.log(await user.removeCart(
        "yliao10@stevens.edu",
        "618d74a35a3c37d918cce32e"
    ));
}