
const { getHandler, postHandler } = require('./util');
const { User, Article } = require('../models/index');
const apiRouters = (app) => {
    getHandler(app, '/api/article_list.json',(req, res) => {
        return Article.query(req.query)
    });
    postHandler(app, '/api/update_article.json', (req, res) => {
        return Article.create(req.body);
    });
};

module.exports = apiRouters;