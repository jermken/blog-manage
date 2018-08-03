const { noCheckHandler, getHandler, postHandler } = require("./util");
const {
  User,
  Article,
  EPSUser,
  EPSStaff,
  EPSGoods,
  EPSStockLog,
  EPSActive
} = require("../models/index");
const formidable = require("formidable");
const util = require("util");
const path = require("path");
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
      if (req.query.isEdit == 1) {
        return result;
      }
      let resArray = [];
      let pageArray = [];
      let {
        page,
        pageSize,
        label,
        title,
        author,
        begin_date,
        end_date
      } = req.query;
      let beginIndex = (page - 1) * pageSize;
      let endIndex = (page - 1) * pageSize + pageSize - 1;
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
      for (let j = beginIndex, length = resArray.length; j < length; j++) {
        if (j > endIndex) {
          break;
        } else {
          pageArray.push(resArray[j]);
        }
      }
      let resData = [pageArray, page, total];
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

  // 依柏诗管理接口-------------------------------------
  // 查询客户接口
  getHandler(app, "/api/ybs_user.json", (req, res) => {
    return EPSUser.query({}).then(result => {
      if (Object.prototype.toString.call(result) !== "[object Array]") {
        return [[], "1", 0];
      }
      let {
        name,
        startT,
        endT,
        vipCode,
        booker,
        sexual,
        isVip,
        page,
        pageSize
      } = req.query;
      let beginIndex = (page - 1) * pageSize;
      let endIndex = (page - 1) * pageSize + pageSize - 1;
      let resArray = [];
      let pageArray = [];
      for (let i = 0, len = result.length; i < len; i++) {
        if (
          result[i].name.indexOf(name) > -1 &&
          result[i].vipCode.indexOf(vipCode) > -1 &&
          result[i].booker.indexOf(booker) > -1 &&
          result[i].sexual.indexOf(sexual) > -1
        ) {
          if (isVip == "0" || result[i].isVip == isVip) {
            resArray.push(result[i]);
          }
        }
      }
      let total = resArray.length;
      for (let j = beginIndex, length = resArray.length; j < length; j++) {
        if (j > endIndex) {
          break;
        } else {
          resArray[j].activeList = JSON.parse(resArray[j].activeList);
          pageArray.push(resArray[j]);
        }
      }
      let resData = [pageArray, page, total];
      return resData;
    });
  });
  // 增加客户接口
  postHandler(app, "/api/ybs_add__user.json", (req, res) => {
    req.body.activeList = JSON.stringify(req.body.activeList);
    return EPSUser.query({ name: req.body.name }).then(result => {
      if (
        Object.prototype.toString.call(result) === "[object Array]" &&
        result.length
      ) {
        res.send({
          code: 100,
          msg: "客户已存在！"
        });
        res.end();
      } else {
        return EPSUser.create(req.body)
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
      }
    });
  });
  // 编辑客户接口
  postHandler(app, "/api/ybs_update__user.json", (req, res) => {
    req.body.activeList = JSON.stringify(req.body.activeList);
    return EPSUser.query({}).then(result => {
      if (
        Object.prototype.toString.call(result) === "[object Array]" &&
        result.length &&
        result[0]._id != req.body._id
      ) {
        res.send({
          code: 100,
          msg: "客户已存在！"
        });
        res.end();
      } else {
        return EPSUser.update(req.body)
          .then(() => {
            res.send({
              code: 0,
              msg: "编辑成功！"
            });
            res.end();
          })
          .catch(e => {
            res.send({
              code: 100,
              msg: "服务器异常！"
            });
            res.end();
          });
      }
    });
  });
  // 删除客户接口
  postHandler(app, "/api/ybs_delete__user.json", (req, res) => {
    return EPSUser.delete(req.body)
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
  // 图片上传接口
  postHandler(app, "/api/ybs_upload.json", (req, res) => {
    const form = new formidable.IncomingForm();
    let files = [],
      fields = [];
    form.encoding = "utf-8";
    form.uploadDir = path.join(__dirname, "../../tmp");
    form.keepExtensions = true;
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req, function(err, fields, files) {
      res.send({
        code: 0,
        data: files.uploadPhotos.path
      });
      res.end();
    });
  });
  // 查询员工接口
  getHandler(app, "/api/ybs_staff.json", (req, res) => {
    return EPSStaff.query(req.query).then(result => {
      let resData = [[], 1, 0];
      if (result) {
        let { status, page, pageSize } = req.query;
        let beginIndex = (page - 1) * pageSize;
        let endIndex = (page - 1) * pageSize + pageSize - 1;
        let resArray = [];
        let pageArray = [];
        if (status == 0) {
          resArray = [...result];
        } else {
          for (let i = 0, len = result.length; i < len; i++) {
            if (result[i].status == status) {
              resArray.push(result[i]);
            }
          }
        }
        let total = resArray.length;
        for (let j = beginIndex, length = resArray.length; j < length; j++) {
          if (j > endIndex) {
            break;
          } else {
            pageArray.push(resArray[j]);
          }
        }
        pageArray.reverse();
        resData = [pageArray, page, total];
      }
      return resData;
    });
  });
  // 增加员工接口
  postHandler(app, "/api/ybs_add_staff.json", (req, res) => {
    return EPSStaff.query({ name: req.body.name }).then(result => {
      if (
        Object.prototype.toString.call(result) === "[object Array]" &&
        !result.length
      ) {
        return EPSStaff.create(req.body)
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
      } else {
        res.send({
          code: 100,
          msg: "该员工已存在！"
        });
        res.end();
      }
    });
  });
  // 删除员工接口
  postHandler(app, "/api/ybs_delete_staff.json", (req, res) => {
    return EPSStaff.delete(req.body)
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
  // 编辑员工接口
  postHandler(app, "/api/ybs_update_staff.json", (req, res) => {
    return EPSStaff.update(req.body)
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

  // 查询产品接口
  getHandler(app, "/api/ybs_goods.json", (req, res) => {
    return EPSGoods.query({}).then(result => {
      let resData = [[], 1, 0];
      if (result) {
        let { title, code, page, pageSize } = req.query;
        let beginIndex = (page - 1) * pageSize;
        let endIndex = (page - 1) * pageSize + pageSize - 1;
        let resArray = [];
        let pageArray = [];
        for (let i = 0, len = result.length; i < len; i++) {
          if (
            result[i].title.indexOf(title) > -1 &&
            result[i].code.indexOf(code) > -1
          ) {
            resArray.push(result[i]);
          }
        }
        let total = resArray.length;
        for (let j = beginIndex, length = resArray.length; j < length; j++) {
          if (j > endIndex) {
            break;
          } else {
            pageArray.push(resArray[j]);
          }
        }
        resData = [pageArray, page, total];
      }
      return resData;
    });
  });
  // 增加产品接口
  postHandler(app, "/api/ybs_add_goods.json", (req, res) => {
    req.body.joinStock = "";
    return EPSGoods.query({ title: req.body.title }).then(result => {
      if (
        Object.prototype.toString.call(result) === "[object Array]" &&
        result.length
      ) {
        res.send({
          code: 100,
          msg: "该产品已存在！"
        });
        res.end();
      } else {
        return EPSGoods.create(req.body)
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
      }
    });
  });
  // 删除产品接口
  postHandler(app, "/api/ybs_delete_goods.json", (req, res) => {
    return EPSGoods.delete(req.body)
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
  // 编辑产品接口
  postHandler(app, "/api/ybs_update_goods.json", (req, res) => {
    return EPSGoods.query({ title: req.body.title }).then(result => {
      if (result.length && result.length[0]._id !== req.body._id) {
        res.send({
          code: 100,
          msg: "该产品已存在！"
        });
        res.end();
      } else {
        req.body.joinStock = "";
        return EPSGoods.update(req.body)
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
      }
    });
  });
  // 增加入库记录接口
  postHandler(app, "/api/ybs_add_stocklog.json", (req, res) => {
    return EPSStockLog.query({ title: req.body.title }).then(result => {
      if (
        Object.prototype.toString.call(result) === "[object Array]" &&
        result.length
      ) {
        let obj = result[0];
        let arr = JSON.parse(obj.joinStock);
        arr.push(req.body.joinStock);
        obj.joinStock = JSON.stringify(arr);
        return EPSStockLog.update(obj)
          .then(() => {
            res.send({
              code: 0,
              msg: "成功！"
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
        let obj = {};
        obj.title = req.body.title;
        obj.joinStock = JSON.stringify([req.body.joinStock]);
        return EPSStockLog.create(obj)
          .then(() => {
            res.send({
              code: 0,
              msg: "成功！"
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
      }
    });
  });
  // 查询活动接口
  getHandler(app, "/api/ybs_active.json", (req, res) => {
    return EPSActive.query({}).then(result => {
      let resData = [[], 1, 0];
      if (result) {
        let {
          title,
          begin_time,
          end_time,
          validate,
          page,
          pageSize
        } = req.query;
        let beginIndex = (page - 1) * pageSize,
          endIndex = (page - 1) * pageSize + pageSize - 1,
          resArray = [],
          pageArray = [];
        for (let i = 0, len = result.length; i < len; i++) {
          if (result[i].title.indexOf(title) > -1) {
            result[i].list = JSON.parse(result[i].list);
            if (validate === "0") {
              if (
                begin_time &&
                end_time &&
                begin_time <= +new Date(result[i].end_time) &&
                end_time >= +new Date(result[i].begin_time)
              ) {
                resArray.push(result[i]);
              } else if (!begin_time && !end_time) {
                resArray.push(result[i]);
              }
            } else if (
              validate === "1" &&
              +new Date(result[i].end_time) > +new Date()
            ) {
              if (
                begin_time &&
                end_time &&
                begin_time <= +new Date(result[i].end_time) &&
                end_time >= +new Date(result[i].begin_time)
              ) {
                resArray.push(result[i]);
              } else if (!begin_time && !end_time) {
                resArray.push(result[i]);
              }
            } else if (
              validate === "2" &&
              +new Date(result[i].end_time) < +new Date()
            ) {
              if (
                begin_time &&
                end_time &&
                begin_time <= +new Date(result[i].end_time) &&
                end_time >= +new Date(result[i].begin_time)
              ) {
                resArray.push(result[i]);
              } else if (!begin_time && !end_time) {
                resArray.push(result[i]);
              }
            }
          }
        }
        let total = resArray.length;
        for (let j = beginIndex, length = resArray.length; j < length; j++) {
          if (j > endIndex) {
            break;
          } else {
            pageArray.push(resArray[j]);
          }
        }
        resData = [pageArray, page, total];
      }
      return resData;
    });
  });
  // 增加活动接口
  postHandler(app, "/api/ybs_add_active.json", (req, res) => {
    return EPSActive.query({ title: req.body.title }).then(result => {
      if (
        Object.prototype.toString.call(result) === "[object Array]" &&
        result.length
      ) {
        res.send({
          code: 100,
          msg: "该活动已存在！"
        });
        res.end();
      } else {
        req.body.list = JSON.stringify(req.body.list);
        return EPSActive.create(req.body)
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
      }
    });
  });
  // 编辑活动接口
  postHandler(app, "/api/ybs_update_active.json", (req, res) => {
    return EPSActive.query({ title: req.body.title }).then(result => {
      if (result.length && result[0]._id !== req.body._id) {
        res.send({
          code: 100,
          msg: "该活动已存在！"
        });
        res.end();
      } else {
        req.body.list = JSON.stringify(req.body.list);
        return EPSActive.update(req.body)
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
      }
    });
  });
  // 删除活动接口
  postHandler(app, "/api/ybs_delete_active.json", (req, res) => {
    return EPSActive.delete(req.body)
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
};

module.exports = apiRouters;
