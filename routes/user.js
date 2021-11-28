const express = require('express');
const router = express.Router();
const { check } = require("../public/js/check");
const { user } = require("../data");

router.get('/login', async (req, res) => {
    if (req.session.user) {
        req.method = "GET"
        res.render("stevensMarketPlace", { "title": "stevensMarketPlace" })
    } else {
        res.status(200).render("login", { "title": "login" })
    }

});

router.post('/login', async (req, res) => {
    // res.status(500).send(new Error("something error").message);
    // res.status(200).json({ "hasErrors": true, "errors": [ "account", "password"] });
    // res.status(200).json({ "hasErrors": true, "errors": [ "account", "password","arguments","account not exist","password not correct"] });
    // return;

    let errors = [];
    if (Object.keys(req.body).length != 2) errors.push("arguments");
    if (!(account = check(req.body.account, "account"))) errors.push("account");
    if (!(password = check(req.body.password, "password"))) errors.push("password");

    if (errors.length > 0) {
        res.status(200).json({ "hasErrors": true, "errors": errors });
    }

    try {
        const data = await user.login(account, password);
        if (data.hasErrors == false) {
            req.session.user = { "account": data.user.account };
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }

});

router.get('/signup', async (req, res) => {
    res.status(200).render("signup", { "title": "signup" });
});

router.post('/signup', async (req, res) => {
    // res.status(500).send(new Error("something error").message);
    // res.status(200).json({ "hasErrors": true, "errors": [ "account", "password"] });
    // res.status(200).json({ "hasErrors": true, "errors": [ "account", "password","arguments","account not exist","password not correct"] });
    // return;

    let errors = [];
    if (Object.keys(req.body).length != 5) errors.push("arguments");
    if (!(account = check(req.body.account, "account"))) errors.push("account");
    if (!(password = check(req.body.password, "password"))) errors.push("password");
    if (!(nickname = check(req.body.nickname, "nickname"))) errors.push("nickname");
    if (!(gender = check(req.body.gender, "gender"))) errors.push("gender");
    if (!(address = check(req.body.address, "address"))) errors.push("address");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };
    
    try {
        const data = await user.create(account, password, nickname, gender, address);
        
        if (data.hasErrors == false) {
            req.session.user = { "account": data.user.account };
            
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/updatePassword', async (req, res) => {
    res.status(200).json({ "title": "updatePassword" });
});

router.post('/updatePassword', async (req, res) => {
    res.status(200).json({ "title": "updatePassword" });
});

router.get('/forgetPassword', async (req, res) => {
    res.status(200).json({ "title": "forgetPassword" });
});

router.post('/forgetPassword', async (req, res) => {
    res.status(200).json({ "title": "forgetPassword" });
});

router.get('/updateInformation', async (req, res) => {
    res.status(200).json({ "title": "updateInformation" });
});

router.post('/updateInformation', async (req, res) => {
    res.status(200).json({ "title": "updateInformation" });
});

router.get('/getOne', async (req, res) => {
    res.status(200).json({ "title": "getOne" });
});

router.post('/addCart', async (req, res) => {
    res.status(200).json({ "title": "addCart" });
});

router.post('/removeCart', async (req, res) => {
    res.status(200).json({ "title": "addCart" });
});

module.exports = router;