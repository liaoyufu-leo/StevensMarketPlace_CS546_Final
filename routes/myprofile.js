const express = require('express');
const router = express.Router();
const {user} = require('../data');

router.get('/', async(req, res) => {
    let user_id = req.session.user.user_id

    let userInfo = await user.findOne(req.session.user.account)
    res.render("myprofile", {"user":userInfo.user, "layout":"main"});
        
})

module.exports = router;