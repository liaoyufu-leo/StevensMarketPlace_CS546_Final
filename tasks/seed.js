const { user } = require("../data/index");

async function userSeed() {
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

userSeed();