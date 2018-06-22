const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const apiRouters = require('./backend/api/index');
const bodyParser = require('body-parser');
const { sessionConfig, mongodbConfig } = require('./backend/config/config.js');
const routesConfig = require('./backend/config/routes.config');
//设定静态文件目录，比如本地文件
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
// session 中间件
app.use(session({
    name: sessionConfig.name,
    secret: sessionConfig.key,
    cookie: {
        maxAge: sessionConfig.maxAge
    },
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
        url: mongodbConfig.mongoUrl
    })
}));

//接口
apiRouters(app);

// 解决浏览器刷新问题
app.use('*', (request, response) => {
    if(!routesConfig[request.baseUrl]) {
        // 404处理
        response.send('<div><script type="text/javascript" src="http://www.qq.com/404/search_children.js" charset="utf-8"></script><script>setTimeout(function(){document.getElementsByClassName("desc")[0].innerHTML="<a href=\'/home\' class=\'desc_link\'>返回首页</a>"},200)</script></div>');
        response.end();
    } else {
        response.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    }
});

app.listen(9000, () => {
    console.log('running at port 9000');
});