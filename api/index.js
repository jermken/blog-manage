
const { getHandler, postHandler } = require('./util');

const apiHandler = (app) => {
    getHandler(app, '/api/home/datalist',(req, res) => {
        return {
            code:0,
            message: 'lalala'
        }
    });
    postHandler(app, '/api/home/search', (req, res) => {
        return {
            code:0,
            data: req.body
        }
    });
};

module.exports = apiHandler;