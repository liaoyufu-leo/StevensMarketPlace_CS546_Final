const express = require('express');
const router = express.Router();
const { check } = require("../public/js/check");
const { item } = require("../data");

router.get('/search', async (req, res) => {

    try {
        const data = await item.search("", req.session.user.account);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }

});

router.get('/search/:keyword', async (req, res) => {

    try {
        const data = await item.search(req.params.keyword, req.session.user.account);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }

});

module.exports = router;