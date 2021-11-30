const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const { engine } = require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");

app.use(
    session({
        name: 'StevensMarketPlace',
        secret: "This is a secret.. shhh don't tell anyone",
        saveUninitialized: true,
        resave: false
    })
);

app.use(express.static(__dirname + '/public'));

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

app.use("*", (req, res, next) => {

    if (req.session.user &&
        (req.originalUrl == '/user/login' ||
            req.originalUrl == '/user/signup' ||
            req.originalUrl == '/user/forgetPassword')
    ) {
        res.redirect("/");
    }
    if (!req.session.user &&
        req.originalUrl != '/user/login' &&
        req.originalUrl != '/user/signup' &&
        req.originalUrl != '/user/forgetPassword'
    ) {
        res.redirect("/user/login");
    }

    next();

});

app.get('/', (req, res, next) => {
    req.url = "/stevensMarketPlace";
    next();
});

app.get('/stevensMarketPlace', (req, res, next) => {
    res.render("stevensMarketPlace", { "title": "stevensMarketPlace", "layout": "main" });
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
