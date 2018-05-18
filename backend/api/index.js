const { noCheckHandler, getHandler, postHandler } = require("./util");
const { User, Article } = require("../models/index");
const sha1 = require("sha1");
const apiRouters = app => {
  // 登录接口
  noCheckHandler(app, "/api/login.json", (req, res) => {
    return User.query(req.body)
      .then(result => {
        if (
          result &&
          result.name == req.body.name &&
          result.password == sha1(req.body.password)
        ) {
          req.session.user = result;
          res.send({
            code: 0,
            msg: "登录成功！"
          });
        } else {
          res.send({
            code: 100,
            msg: "用户名或密码不匹配！"
          });
        }
        res.end();
      })
      .catch(() => {
        res.send({
          code: 100,
          msg: "服务器异常！"
        });
        res.end();
      });
  });
  // 注册接口
  noCheckHandler(app, "/api/loginup.json", (req, res) => {
    if (req.body.recommendnum !== "3215") {
      res.send({
        code: 100,
        msg: "推荐码有误"
      });
      return res.send();
    }
    let userInfo = {};
    userInfo.name = req.body.name;
    userInfo.password = sha1(req.body.password);
    return User.query({ name: req.body.name }).then(result => {
      if (!result) {
        return User.create(userInfo)
          .then(result => {
            res.send({
              code: 0,
              msg: "注册成功！"
            });
            res.end();
          })
          .catch(() => {
            res.send({
              code: 100,
              msg: "服务器异常！"
            });
            res.end();
          });
      } else {
        res.send({
          code: 100,
          msg: "改用户名已使用！"
        });
        res.end();
      }
    });
  });
  // 查询文章接口
  getHandler(app, "/api/article_list.json", (req, res) => {
    return Article.query(req.query).then(result => {
      if(req.query.isEdit == 1) {
          return result;
      }
      let resArray = [];
      let pageArray = [];
      let {page, pageSize, label, title, author, begin_date, end_date} = req.query;
      let beginIndex = (page - 1) * pageSize;
      let endIndex = (page-1)*pageSize+pageSize-1;
      for (let i = 0, length = result.length; i < length; i++) {
        if (
          result[i].label.indexOf(label) > -1 &&
          result[i].title.indexOf(title) > -1 &&
          result[i].author.indexOf(author) > -1 && 
          (begin_date <= result[i].time && end_date >= result[i].time)
        ) {
            resArray.push(result[i]);
        }
      }
      let total = resArray.length;
      for(let j = beginIndex, length = resArray.length; j < length; j++) {
          if(j > endIndex) {
              break;
          } else {
            pageArray.push(resArray[j]);
          }
      }
      let resData = [pageArray,page,total];
      return resData;
    });
  });
  // 增加文章接口
  postHandler(app, "/api/add_article.json", (req, res) => {
    return Article.create(req.body)
      .then(() => {
        res.send({
          code: 0,
          msg: "新增成功！"
        });
        res.end();
      })
      .catch(() => {
        res.send({
          code: 100,
          msg: "服务器异常！"
        });
        res.end();
      });
  });
  // 编辑文章接口
  postHandler(app, "/api/update_article.json", (req, res) => {
    return Article.update(req.body)
      .then(() => {
        res.send({
          code: 0,
          msg: "编辑成功！"
        });
        res.end();
      })
      .catch(() => {
        res.send({
          code: 100,
          msg: "服务器异常！"
        });
        res.end();
      });
  });
  // 删除文章接口
  postHandler(app, "/api/delete_article.json", (req, res) => {
    return Article.delete(req.body)
      .then(() => {
        res.send({
          code: 0,
          msg: "删除成功！"
        });
        res.end();
      })
      .catch(() => {
        res.send({
          code: 100,
          msg: "服务器异常！"
        });
        res.end();
      });
  });
  // 退出登录接口
  postHandler(app, "/api/loginout.json", (req, res) => {
    return User.query({ name: req.body.name }).then(result => {
      if (result) {
        req.session.user = null;
        res.send({
          code: 0,
          msg: "退出登录成功！"
        });
        res.end();
      }
    });
  });
};

module.exports = apiRouters;
