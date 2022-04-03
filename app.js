const express = require('express');
const app = express();
const session = require('express-session');
const { engine } = require('express-handlebars');
const fileUpload = require('express-fileupload');
const configRoutes = require('./routes');

const xss = require('xss');

app.use(express.json()); 	// 设置为传输数据为json
app.use(fileUpload());		// 设置用户传文件用的package
app.use(express.urlencoded({ extended: true }));	// 这个不知道干啥的

// 下面三行用来设置handlebars，表示用这个engine
app.engine('handlebars', engine());		
app.set('view engine', 'handlebars');
app.set("views", "./views");

// 设置session格式
app.use(
    session({
        name: 'StevensMarketPlace',
        secret: "This is a secret.. shhh don't tell anyone",
        saveUninitialized: true,
        resave: false
    })
);

// 配置静态文件路径
app.use(express.static(__dirname + '/public'));

// 设置中间件，做authenticate
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

// 将app传给route的index
configRoutes(app);

// app.listen(3000, () => {
//     console.log("We've now got a server!");
//     console.log('Your routes will be running on http://localhost:3000');
// });

// 设置socket，用来实现聊天室功能，写法和routes差不多，可以在server里面找到index
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
