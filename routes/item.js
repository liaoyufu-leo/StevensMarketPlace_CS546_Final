const express = require('express');
const router = express.Router();
const { check } = require("../public/js/check");
const { item } = require("../data");

router.get('/getOne/:item_id', async (req, res) => {
    console.log(req.params);

    let errors = [];
    if (Object.keys(req.params).length != 1) errors.push("arguments");
    if (!(item_id = check(req.params.item_id, "id") ? (mongo.ObjectId.isValid(req.params.item_id) ? mongo.ObjectId(req.params.item_id) : false) : false)) errors.push("item_id");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    try {
        const data = await item.findOne(item_id);

        if (data.hasErrors == false) {
            req.session.user = { "account": data.user.account };

        }
        res.status(200).json(data);
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