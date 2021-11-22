const express = require('express');
const router = express.Router();
const { check } = require("../public/check");
const { user } = require("../data");

router.get('/login', async (req, res) => {
    res.status(200).json({ "title": "login" });
});

router.post('/login', async (req, res) => {
    res.status(200).json({ "title": "login" });
});

router.get('/signup', async (req, res) => {
    res.status(200).json({ "title": "signup" });
});

router.post('/signup', async (req, res) => {
    res.status(200).json({ "title": "signup" });
});

router.get('/logout', async (req, res) => {
    res.status(200).json({ "title": "logout" });
});

router.get('/updatePassword', async (req, res) => {
    res.status(200).json({ "title": "updatePassword" });
});

router.post('/updatePassword', async (req, res) => {
    res.status(200).json({ "title": "updatePassword" });
});

router.get('/forgetPassword', async (req, res) => {
    res.status(200).json({ "title": "forgetPassword" });
});

router.post('/forgetPassword', async (req, res) => {
    res.status(200).json({ "title": "forgetPassword" });
});

router.get('/updateInformation', async (req, res) => {
    res.status(200).json({ "title": "updateInformation" });
});

router.post('/updateInformation', async (req, res) => {
    res.status(200).json({ "title": "updateInformation" });
});

router.get('/getOne', async (req, res) => {
    res.status(200).json({ "title": "getOne" });
});

router.post('/addCart', async (req, res) => {
    res.status(200).json({ "title": "addCart" });
});

router.post('/removeCart', async (req, res) => {
    res.status(200).json({ "title": "addCart" });
});

module.exports = router;