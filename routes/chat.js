const express = require('express');
const router = express.Router();

const { check } = require("../public/js/check");

const { chat } = require('../data')

const xss = require('xss');

router.get('/getAll', async (req, res) => {

    try {
        const chats = (await chat.getAll(req.session.user.account)).chats;

        chats.forEach(element => {
            let index = element.users.indexOf(req.session.user.account);
            element.users = element.users[1 - index];
        });

        res.status(200).json({ "chats": chats });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/getOne/:account', async (req, res) => {
    let errors = [];
    if (Object.keys(req.params).length != 1) errors.push("arguments");
    if (!(account = check(req.params.account, "account"))) errors.push("account");

    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    try {
        const result = (await chat.getOne(req.session.user.account, account));
        if (result.hasErrors) {
            res.status(404).json(result);
        } else {
            let chat = result.chat;
            chat.users = chat.users[1 - chat.users.indexOf(req.session.user.account)];
            res.status(200).json(chat);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/send', async (req, res) => {
    let errors = [];
    if (Object.keys(req.body).length != 2) errors.push("arguments");
    if (!(receiver = check(xss(req.body.receiver), "account"))) errors.push("account");
    if (!(content = check(xss(req.body.content), "content"))) errors.push("content");

    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    } 

    try {
        const data = await chat.send(req.session.user.account, receiver, content);
        if (data.hasErrors == false) {
            let chat = data.chat;
            chat.users = chat.users[1 - chat.users.indexOf(req.session.user.account)];
            res.status(200).json(chat);
        } else {
            res.status(400).json(data);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;