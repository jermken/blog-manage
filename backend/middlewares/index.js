
module.exports = {
    checkLogin: (req, res, next) => {
        if(!req.session.user && req.query.isMobile != 'jermken') {
            res.send({
                code: 200,
                msg: '您暂未登录！'
            });
            return res.end();
        }
        next()
    }
}