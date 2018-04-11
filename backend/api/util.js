const checkLogin = require('../middlewares/index.js').checkLogin;
const util = {
    /**
     * 
     * @param {object} app 
     * @param {string} url 
     * @param {?function} wokerFn 
     */
    getHandler: (app, url, wokerFn) => {
        app.get(url, checkLogin, (req, res) => {
            res.header("Access-Control-Allow-Origin", "http://localhost:3000");
            res.header("Access-Control-Allow-Credentials", true);
            wokerFn(req, res).then((resData) => {
                resData = Object.prototype.toString.call(resData) === '[object Array]'? resData : [resData];
                res.send({
                    code: 0,
                    data: resData
                });
                res.end();
            });
        });
    },
    /**
     * @param {object} app
     * @param {string} url
     * @param {?function} wokerFn 
     *
     */
    postHandler: (app, url, wokerFn) => {
        app.use(url, checkLogin, (req, res) => {
            res.header("Access-Control-Allow-Origin", "http://localhost:3000");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
            res.header("Access-Control-Allow-Credentials", true);
            wokerFn(req, res);
        });
    }
};

module.exports = util;
