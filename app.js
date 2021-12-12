const express = require('express');
const app = express();
const session = require('express-session');
const { engine } = require('express-handlebars');
const fileUpload = require('express-fileUpload');
const configRoutes = require('./routes');

const xss = require('xss');

app.use(express.json());
app.use(fileUpload());
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
        res.redirect("/stevensMarketPlace");
        return;
    }
    if (!req.session.user &&
        req.originalUrl != '/user/login' &&
        req.originalUrl != '/user/signup' &&
        req.originalUrl != '/user/forgetPassword'
    ) {
        res.redirect("/user/login");
        return;
    }

    next();

});

app.get('/', (req, res, next) => {
    res.redirect("/stevensMarketPlace");
});

app.get('/stevensMarketPlace', (req, res, next) => {
    res.render("main", { "currentUser": xss(req.session.user.account), "layout": false });
});

configRoutes(app);

// app.listen(3000, () => {
//     console.log("We've now got a server!");
//     console.log('Your routes will be running on http://localhost:3000');
// });

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const configServer = require('./servers');
configServer(io);

server.listen(3000, () => {
    console.log("We've now got a server with socket!");
    console.log('Your routes will be running on http://localhost:3000');
});