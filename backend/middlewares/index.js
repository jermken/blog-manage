module.exports = {
    checkLogin: (req, res, next) => {
        console.log(req.session.user);
        if(!req.session.user) {
            res.send({
                code: 200,
                msg: '您暂未登录！'
            });
            res.end();
        }
        next()
    }
}