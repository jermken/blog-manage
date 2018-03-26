
const { getHandler, postHandler } = require('./util');
const { User } = require('../models/index');
const apiRouters = (app) => {
    getHandler(app, '/api/articlelist.json',(req, res) => {
        return User.query({
            name: 'jermken'
        })
    });
    postHandler(app, '/api/home/search', (req, res) => {
        return {
            code:0,
            data: req.body
        }
    });
};

module.exports = apiRouters;