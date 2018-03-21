
const util = {
    /**
     * 
     * @param {object} app 
     * @param {string} url 
     * @param {?function} wokerFn 
     */
    getHandler: (app, url, wokerFn) => {
        app.get(url, (req, res) => {
            res.header("Access-Control-Allow-Origin", "http://localhost:3000");
            res.header("Access-Control-Allow-Credentials", true);
            let resData = wokerFn(req, res);
            res.send(resData);
            res.end();
        });
    },
    /**
     * @param {object} app
     * @param {string} url
     * @param {?function} wokerFn 
     *
     */
    postHandler: (app, url, wokerFn) => {
        app.use(url, (req, res) => {
            res.header("Access-Control-Allow-Origin", "http://localhost:3000");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
            res.header("Access-Control-Allow-Credentials", true);
            let resData = wokerFn(req, res);
            res.send(resData);
            res.end();
        });
    }
};

module.exports = util;
