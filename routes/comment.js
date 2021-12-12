const express = require('express');
const router = express.Router();
const { check } = require("../public/js/check");
const { comment } = require("../data");

const xss = require('xss');

router.post('/create', async (req, res) => {
    // res.status(500).send("something wrong");
    // res.status(400).json({ "hasErrors": true, "errors": [ "account", "password","arguments","account not exist","password not correct"] });
    // req.session.user = { "account": "123" };
    // res.status(200).json({ "message": "signup success" });
    // return;
    // console.log(req.body)
    // res.status(200).json({ "message": "good" });
    // return ;

    let errors = [];
    if (Object.keys(req.body).length != 2) errors.push("arguments");
    if (!(item_id = check(xss(req.body.item_id), "id"))) errors.push("item_id");
    if (!(content = check(xss(req.body.content), "content"))) errors.push("content");

    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    try {
        const data = await comment.create(item_id, req.session.user.account, content);
        if (data.hasErrors) {
            res.status(400).send(data);
        } else {
            res.status(200).json({ "message": "success" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

module.exports = router;