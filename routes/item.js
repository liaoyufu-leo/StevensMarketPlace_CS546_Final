const express = require('express');
const router = express.Router();
const { check } = require("../public/js/check");
const { user } = require("../data");
const { item } = require("../data");

router.get('/getOne/:item_id', async (req, res) => {
    // res.status(400).json({ "hasErrors": true, "errors": ["item_id"] });
    // return;

    let errors = [];
    if (Object.keys(req.params).length != 1) errors.push("arguments");
    if (!(item_id = check(req.params.item_id, "id"))) errors.push("item_id");

    if (errors.length > 0) {
        res.status(404).render('error',{ "title": "404 not found", "layout": "main", "message": "the item_id is not valid" });
        return;
    }
    try {
        const data = await item.findOne(item_id);
        if (data.hasErrors == true) {
            res.status(404).render('error',{ "title": "404 not found", "layout": "main", "message": "the item_id is not exist" });
        } else {
            const data2 = await user.findOne(req.session.user.account);
            let exist = false;
            // console.log(data2)
            if(data2.user.cart.includes(data.item._id)) exist = true;
            res.status(200).render("main/item", { "item": data.item, "exist":exist, "layout": "main", "title":"item"});
        }

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/search', async (req, res) => {
    try {
        const data = await item.search(req.query.keyword, req.session.user.account);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;

// item routes//