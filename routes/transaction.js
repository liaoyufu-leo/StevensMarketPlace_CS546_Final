const express = require('express');
const router = express.Router();
const { check } = require("../public/js/check");
const { item, transaction } = require("../data");

const xss = require('xss');

router.get('/myTransactions', async (req, res) => {
    // console.log("a")
    // res.status(500).send("something wrong");
    // res.status(400).json({ "hasErrors": true, "errors": [ "account", "password","arguments","account not exist","password not correct"] });
    // req.session.user = { "account": "123" };
    // res.status(200).json({ "message": "signup success" });
    // return;
    // console.log(req.body)
    // res.status(200).json({ "message": "good" });
    // return ;

    try {
        const data = await transaction.getAll(req.session.user.account);

        if (data.hasErrors) {
            res.status(400).send(data);
        } else {
            const sold = data.sold, bought = data.bought;
            for (let i = 0; i < sold.length; i++) {
                sold[i]["item"] = (await item.findOne(sold[i].item_id)).item;
            }
            for (let i = 0; i < bought.length; i++) {
                bought[i]["item"] = (await item.findOne(bought[i].item_id)).item;
            }

            res.status(200).json({ "sold": sold, "bought": bought });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

router.post('/create', async (req, res) => {
    // console.log("a")
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
    let item_ids = req.body.item_ids;
    for (let i = 0; i < item_ids.length; i++) {
        if (!(item_ids[i] = check(xss(item_ids[i]), "id"))) {
            errors.push("item_id");
            break;
        }
    }
    if (!(payment = check(req.body.payment, "payment"))) errors.push("payment");
    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    try {
        for (let i = 0; i < item_ids.length; i++) {
            await transaction.create(item_ids[i], req.session.user.account, payment);
        }
        res.status(200).json({ "message": "all success" });
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

module.exports = router;