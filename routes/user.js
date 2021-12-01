const express = require('express');
const router = express.Router();
const { check } = require("../public/js/check");
const { user } = require("../data");
const { item} = require("../data");

router.get('/login', async (req, res) => {
    res.status(200).render("login", { "title": "login", "layout": "landing" });
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
        return ;
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
    res.status(200).render("signup", { "title": "signup", "layout": "landing" });
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

    if (errors.length > 0) {
        res.status(200).json({ "hasErrors": true, "errors": errors });
        return ;
    }

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

router.get('/forgetPassword', async (req, res) => {
    res.status(200).render('forgetPassword', { "title": "updatePassword", "layout": "landing" });
});

router.post('/forgetPassword', async (req, res) => {
    let errors = [];
    if (Object.keys(req.body).length != 2) errors.push("arguments");
    if (!(account = check(req.body.account, "account"))) errors.push("account");
    if (!(password = check(req.body.password, "password"))) errors.push("password");

    if (errors.length > 0) {
        res.status(200).json({ "hasErrors": true, "errors": errors });
        return ;
    }

    try {
        const data = await user.forgetPassword(account, password);
        if (data.hasErrors == false) {
            req.session.user = { "account": data.user.account };
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/updatePassword', async (req, res) => {
    res.status(200).json({ "title": "updatePassword" });
});

router.post('/updatePassword', async (req, res) => {
    res.status(200).json({ "title": "updatePassword" });
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

router.get('/addCart/:item_id', async (req, res) => {
    let errors = [];
    if (Object.keys(req.params).length != 1) errors.push("arguments");
    if (!(item_id = check(req.params.item_id, "id"))) errors.push("item_id");

    if (errors.length > 0) {
        res.status(200).json({ "hasErrors": true, "errors": errors });
        return;
    }
    try {
        const data = await item.addCart(req.session.user.account, item_id);
        if (data.hasErrors == true) {
            res.status(404).render()
        } else {
            
            res.status(200).render("cart", { "item": data.item });
        }

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/removeCart', async (req, res) => {
    res.status(200).json({ "title": "addCart" });
});

module.exports = router;