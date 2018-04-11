
const { getHandler, postHandler } = require('./util');
const { User, Article } = require('../models/index');
const apiRouters = (app) => {
    postHandler(app, '/api/login.json', (req, res) => {
        return User.query(req.body).then((result)=>{
            res.send({
                code: 0,
                msg: '登录成功！',
                req: result
            });
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