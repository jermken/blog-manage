
const { getHandler, postHandler } = require('./util');
const { User } = require('../models/index');
const apiRouters = (app) => {
    getHandler(app, '/api/article_list.json',(req, res) => {
        return User.query({
            name: 'jermken'
        })
    });
    postHandler(app, '/api/update_article.json', (req, res) => {
        return {
            code:0,
            data: req.body
        }
    });
};

module.exports = apiRouters;