const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const { engine } = require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public/'));
app.engine('handlebars', engine({ "defaultLayout": "main" }));
app.set('view engine', 'handlebars');
app.set("views", "./views");

app.use(
    session({
        name: 'StevensMarketPlace',
        secret: "This is a secret.. shhh don't tell anyone",
        saveUninitialized: true,
        resave: false,
        cookie: { maxAge: 60000 }
    })
);

app.use("*", (req, res, next) => {
    let log = `[${new Date().toUTCString()}]:${req.method} ${req.originalUrl}`;
    if (req.session.user) {
        log += ' (Authenticated User)';
    } else {
        log += ' (Non-Authenticated User)';
    }
    console.log(log);
    next();
});

app.get("/", (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/stevensMarketPlace');
    } else {
        return res.redirect('/user/login');
    }
});


configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
