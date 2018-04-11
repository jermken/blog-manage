
const { loginHandler, getHandler, postHandler } = require('./util');
const { User, Article } = require('../models/index');
const apiRouters = (app) => {
    loginHandler(app, '/api/login.json', (req, res) => {
        return User.query(req.body).then((result)=>{
            if(result.name == req.body.name && result.password == req.body.password) {
                req.session.name = result.name;
                res.send({
                    code: 0,
                    msg: '登录成功！'
                });
            } else {
                res.send({
                    code: 100,
                    msg: '用户名或密码不匹配！'
                });
            }
            res.end();
        });
    });
    getHandler(app, '/api/article_list.json',(req, res) => {
        return Article.query(req.query)
    });
    postHandler(app, '/api/add_article.json', (req, res) => {
        return Article.create(req.body).then(()=>{
            res.send({
                code: 0,
                msg: '新增成功！'
            });
            res.end();
        });
    });
};

module.exports = apiRouters;