const express = require('express');
const router = express.Router();
const { check } = require("../public/js/check");
const { user } = require("../data");
const { item } = require("../data");
const xss = require('xss');

router.get('/login', async (req, res) => {
    res.status(200).render("landing/login", { "title": "login", "layout": "landing" });
});

router.post('/login', async (req, res) => {

    // res.status(500).send("something wrong");
    // res.status(400).json({ "hasErrors": true, "errors": [ "account", "password","arguments","account not exist","password not correct"] });
    // req.session.user = { "account": "123" };
    // res.status(200).json({ "message": "login success" });
    // return;

    let errors = [];
    if (Object.keys(req.body).length != 2) errors.push("arguments");
    if (!(account = check(xss(req.body.account), "account"))) errors.push("account");
    if (!(password = check(xss(req.body.password), "password"))) errors.push("password");

    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    try {
        const data = await user.login(account, password);
        if (data.hasErrors == false) {
            req.session.user = { "account": data.user.account };
            res.status(200).json({ "message": "login success" });
        } else {
            res.status(400).json(data);
        }
    } catch (error) {
        res.status(500).send(error);
    }

});

router.get('/signup', async (req, res) => {
    res.status(200).render("landing/signup", { "title": "signup", "layout": "landing" });
});

router.post('/signup', async (req, res) => {
    // res.status(500).send("something wrong");
    // res.status(400).json({ "hasErrors": true, "errors": [ "account", "password","arguments","account not exist","password not correct"] });
    // req.session.user = { "account": "123" };
    // res.status(200).json({ "message": "signup success" });
    // return;

    let errors = [];
    if (Object.keys(req.body).length != 5) errors.push("arguments");
    if (!(account = check(xss(req.body.account), "account"))) errors.push("account");
    if (!(password = check(xss(req.body.password), "password"))) errors.push("password");
    if (!(nickname = check(xss(req.body.nickname), "nickname"))) errors.push("nickname");
    if (!(gender = check(xss(req.body.gender), "gender"))) errors.push("gender");
    if (!(address = check(req.body.address, "address"))) errors.push("address");

    if (errors.length > 0) {
        console.log(errors)
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    

    try {
        const data = await user.create(account, password, nickname, gender, address);
        if (data.hasErrors == false) {
            req.session.user = { "account": data.user.account };
            res.status(200).json({ "message": "signup success" });
        } else {
            res.status(400).json(data);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/stevensMarketPlace');
});

router.get('/forgetPassword', async (req, res) => {
    res.status(200).render('landing/forgetPassword', { "title": "updatePassword", "layout": "landing" });
});

router.post('/forgetPassword', async (req, res) => {
    let errors = [];
    if (Object.keys(req.body).length != 2) errors.push("arguments");
    if (!(account = check(xss(req.body.account), "account"))) errors.push("account");
    if (!(password = check(xss(req.body.password), "password"))) errors.push("password");

    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    try {
        const data = await user.forgetPassword(account, password);
        if (data.hasErrors == false) {
            req.session.user = { "account": data.user.account };
            res.status(200).json({ "message": "reset password success" });
        } else {
            res.status(400).json(data);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/cart', async (req, res) => {

    const userData = (await user.findOne(req.session.user.account)).user;
    let items = [];
    for (let i = 0; i < userData.cart.length; i++) {
        items.push((await item.findOne(userData.cart[i])).item)
    }
    res.status(200).json({ "items": items });
});

router.get('/getOne/:account', async (req, res) => {
    let errors = [];
    if (Object.keys(req.params).length != 1) errors.push("arguments");
    if (!(account = check(xss(req.params.account), "account"))) errors.push("account");

    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    try {
        const data = await user.findOne(account);
        if (data.hasErrors) {
            res.status(404).json(data);
        } else {
            res.status(200).json(data.user);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/addCart/:item_id', async (req, res) => {
    let errors = [];
    if (Object.keys(req.params).length != 1) errors.push("arguments");
    if (!(item_id = check(xss(req.params.item_id), "id"))) errors.push("item_id");

    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    try {
        const result = (await item.addCart(req.session.user.account, item_id));
        if (result.hasErrors) {
            res.status(404).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/removeCart/:item_id', async (req, res) => {
    let errors = [];
    if (Object.keys(req.params).length != 1) errors.push("arguments");
    if (!(item_id = check(xss(req.params.item_id), "id"))) errors.push("item_id");

    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    try {
        const result = (await item.removeCart(req.session.user.account, item_id));
        if (result.hasErrors) {
            res.status(404).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/removeCart/:item_id', async (req, res) => {
    let errors = [];
    if (Object.keys(req.params).length != 1) errors.push("arguments");
    if (!(item_id = check(xss(req.params.item_id), "id"))) errors.push("item_id");

    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    try {
        const result = (await item.removeCart(req.session.user.account, item_id));
        if (result.hasErrors) {
            res.status(404).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/search/:keyword', async (req, res) => {
    let errors = [];
    if (Object.keys(req.params).length != 1) errors.push("arguments");
    if (!(keyword = check(xss(req.params.keyword), "keyword"))) errors.push("keyword");

    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    try {
        const users = (await user.search(keyword, req.session.user.account)).users;
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = router;