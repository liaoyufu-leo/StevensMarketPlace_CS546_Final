const express = require('express');
const router = express.Router();
const { user } = require('../data');

router.get('/', async (req, res) => {
    let user = (await user.findOne(req.session.user.account)).user;
    res.json(user);

})

module.exports = router;