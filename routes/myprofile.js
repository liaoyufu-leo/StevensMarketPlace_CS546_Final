const express = require('express');
const router = express.Router();
const { check } = require("../public/js/check");
const { user } = require('../data');

const xss = require('xss');

router.get('/', async (req, res) => {
    let userData = (await user.findOne(req.session.user.account)).user;
    res.status(200).json(userData);
})

router.post('/', async (req, res) => {
    // res.status(500).send("something wrong");
    // res.status(400).json({ "hasErrors": true, "errors": [ "account", "password","arguments","account not exist","password not correct"] });
    // req.session.user = { "account": "123" };
    // res.status(200).json({ "message": "signup success" });
    // return;

    let errors = [];
    if (Object.keys(req.body).length != 3) errors.push("arguments");
    if (!(nickname = check(xss(req.body.nickname), "nickname"))) errors.push("nickname");
    if (!(gender = check(xss(req.body.gender), "gender"))) errors.push("gender");
    if (!(address = check(req.body.address, "address"))) errors.push("address");

    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    try {
        const data = await user.updateInformation(account, nickname, gender, address);
        if (data.hasErrors) {
            res.status(400).json({ "message": "signup success" });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;