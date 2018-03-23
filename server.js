const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const apiHandler = require('./api/index');
const bodyParser = require('body-parser');
const { sessionConfig, mongodbConfig } = require('./config/config.js');

//设定静态文件目录，比如本地文件
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
// session 中间件
app.use(session({
    name: sessionConfig.name,
    key: sessionConfig.key,
    cookie: {
        maxAge: sessionConfig.maxAge
    },
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
        url: mongodbConfig.mongoUrl
    })
}));
//接口
apiHandler(app);

// 解决浏览器刷新问题
app.use('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(3337, () => {
    console.log('running at port 3337');
});