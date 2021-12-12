const express = require('express');
const router = express.Router();
const { check } = require("../public/js/check");
const { user } = require("../data");
const { item } = require("../data");

const md5 = require("blueimp-md5");
const fs = require("fs");
const xss = require('xss');

router.post('/create', async (req, res) => {
    let errors = [];
    if (Object.keys(req.body).length != 3) errors.push("arguments");
    if (!(title = check(xss(req.body.title), "title"))) errors.push("title");
    if (!(price = check(xss(req.body.price), "price"))) errors.push("price");
    if (!(description = check(xss(req.body.description), "description"))) errors.push("description");
    if (!(req.files.photos)) errors.push("photos");

    let photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
    photos.forEach(element => {
        element.name = md5(req.session.user.account + element.name + new Date()) + element.name.match(/\.[\w]+$/g);
    });

    for (let i = 0; i < photos.length; i++) {
        if (!check(photos[i].name, 'photo')) {
            errors.push("files");
            break;
        }
    }

    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    for (let i = 0; i < photos.length; i++) {
        fs.appendFileSync("./public/images/" + photos[i].name, photos[i].data);
        photos[i] = photos[i].name;
    }


    try {
        const data = await item.create(req.session.user.account, title, price, photos, description);
        if (data.hasErrors == true) {
            res.status(400).json(data);
        } else {
            res.status(200).json(data.item);
        }
    } catch (error) {
        res.status(500).send(error);
    }

});

router.post('/update', async (req, res) => {
    let errors = [];
    if (Object.keys(req.body).length != 4) errors.push("arguments");
    if (!(item_id = check(xss(req.body.item_id), "id"))) errors.push("item_id");
    if (!(title = check(xss(req.body.title), "title"))) errors.push("title");
    if (!(price = check(xss(req.body.price), "price"))) errors.push("price");
    if (!(description = check(xss(req.body.description), "description"))) errors.push("description");
    let photos = [];
    if (req.files) {
        photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
        photos.forEach(element => {
            element.name = md5(req.session.user.account + element.name + new Date()) + element.name.match(/\.[\w]+$/g);
        });
        for (let i = 0; i < photos.length; i++) {
            if (!check(photos[i].name, 'photo')) {
                errors.push("files");
                break;
            }
        }
    }

    if (errors.length > 0) {
        res.status(400).json({ "hasErrors": true, "errors": errors });
        return;
    }

    for (let i = 0; i < photos.length; i++) {
        fs.appendFileSync("./public/images/" + photos[i].name, photos[i].data);
        photos[i] = photos[i].name;
    }

    try {
        const data = await item.findOne(item_id);

        const data2 = await item.updateInfo(item_id, title, price, data.item.photos.concat(photos), description);
        if (data2.hasErrors == true) {
            res.status(400).json(data2);
        } else {
            res.status(200).json(data2.item);
        }
    } catch (error) {
        res.status(500).send(error);
    }

});

router.get('/getAll', async (req, res) => {
    try {
        const items = (await item.findAll(req.session.user.account)).items;
        res.status(200).json(items);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/getOne/:item_id', async (req, res) => {
    // res.status(400).json({ "hasErrors": true, "errors": ["item_id"] });
    // return;

    let errors = [];
    if (Object.keys(req.params).length != 1) errors.push("arguments");
    if (!(item_id = check(req.params.item_id, "id"))) errors.push("item_id");

    if (errors.length > 0) {
        res.status(404).json(data);
        return;
    }
    try {
        const data = await item.findOne(item_id);
        if (data.hasErrors == true) {
            res.status(404).json(data);
        } else {
            const data2 = await user.findOne(req.session.user.account);
            let exist = false;
            // console.log(data2)
            if (data2.user.cart.includes(data.item._id)) exist = true;
            res.status(200).json({ "item": data.item, "exist": exist });
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

router.get('/withdraw/:item_id', async (req, res) => {
    let errors = [];
    if (Object.keys(req.params).length != 1) errors.push("arguments");
    if (!(item_id = check(req.params.item_id, "id"))) errors.push("item_id");

    if (errors.length > 0) {
        res.status(404).json(data);
        return;
    }
    try {
        const data = await item.deleteItem(item_id);
        if (Date.hasErrors) {
            res.status(400).json(data);
        } else {
            res.status(200).json({ "message": "success" });
        }

    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;