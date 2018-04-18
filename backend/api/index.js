
const { noCheckHandler, getHandler, postHandler } = require('./util');
const { User, Article } = require('../models/index');
const sha1 = require('sha1');
const apiRouters = (app) => {
    // 登录接口
    noCheckHandler(app, '/api/login.json', (req, res) => {
        return User.query(req.body).then((result)=>{
            if(result && result.name == req.body.name && result.password == sha1(req.body.password)) {
                req.session.user = result;
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
        }).catch(()=>{
            res.send({
                code: 100,
                msg: '服务器异常！'
            });
            res.end();
        })
    });
    // 注册接口
    noCheckHandler(app, '/api/loginup.json', (req, res) => {
        if(req.body.recommendnum !== '3215') {
            res.send({
                code: 100,
                msg: '推荐码有误'
            });
            return res.send();
        }
        let userInfo = {};
        userInfo.name = req.body.name;
        userInfo.password = sha1(req.body.password);
        return User.query({name:req.body.name}).then((result)=>{
            if(!result) {
                return User.create(userInfo).then((result)=>{
                    res.send({
                        code: 0,
                        msg: '注册成功！'
                    });
                    res.end();
                }).catch(()=>{
                    res.send({
                        code: 100,
                        msg: '服务器异常！'
                    });
                    res.end();
                });
            } else {
                res.send({
                    code: 100,
                    msg: '改用户名已使用！'
                });
                res.end();
            }
        })
    });
    // 查询文章接口
    getHandler(app, '/api/article_list.json',(req, res) => {
        return Article.query(req.query)
    });
    // 增加或编辑文章接口
    postHandler(app, '/api/add_article.json', (req, res) => {
        return Article.create(req.body).then(()=>{
            res.send({
                code: 0,
                msg: '新增成功！'
            });
            res.end();
        }).catch(()=>{
            res.send({
                code: 100,
                msg: '服务器异常！'
            });
            res.end();
        });
    });
    // 删除文章接口
    postHandler(app, '/api/delete_article.json', (req, res) => {
        return Article.delete(req.body).then(()=>{
            res.send({
                code: 0,
                msg: '删除成功！'
            });
            res.end();
        }).catch(()=>{
            res.send({
                code: 100,
                msg: '服务器异常！'
            });
            res.end();
        });
    });
};

module.exports = apiRouters;