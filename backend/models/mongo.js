const Mongolass = require('mongolass')
const mongodbConfig = require('../config/config.js').mongodbConfig
const Schema = Mongolass.Schema
const mongolass = new Mongolass()

mongolass.connect(mongodbConfig.mongoUrl)

//+++++ Schema +++++//
const UserSchema = new Schema('User', {
    name: {type: 'string'},
    password: { type: 'string'}
})

const ArticleSchema = new Schema('Aritcle', {
    author: {type: 'string'},
    label: {type: 'string'},
    title: {type: 'string'},
    date: {type: 'string'},
    content: {type: 'string'},
    time: {type: 'number'}
})
// 依柏诗客户列表
const EPSUserSchema = new Schema('EPSUser', {
    name: {type: 'string'},
    creat_time: {type: 'number'},
    update_time: {type: 'number'},
    isVip: {type: 'boolean'},
    vipCode: {type: 'string'},
    sexual: {type: 'number'},
    booker: {type: 'string'},
    contact: {type: 'string'},
    birthday: {type: 'string'},
    active: {type: 'array'},
    balance: {type: 'number'},
    avatar: {type: 'string'}
})
// 依柏诗消费记录表
const EPSConsumeSchema = new Schema('EPSConsume', {
    name: {type: 'string'},
    time: {type: 'number'},
    projectList: {type: 'array'},
    balance: {type: 'number'},
    paymentWay: {type: 'array'},
    serverName: {type: 'string'},
    desc: {type: 'string'}
})
// 依柏诗充值记录表
const EPSRechargeSchema = new Schema('EPSRecharge', {
    name: {type: 'string'},
    time: {type: 'number'},
    paymentWay: {type: 'array'},
    serverName: {type: 'string'},
    desc: {type: 'string'}
})
// 依柏诗活动列表
const EPSActiveSchema = new Schema('EPSActive', {
    name: {type: 'string'},
    creat_time: {type: 'number'},
    update_time: {type: 'number'},
    start_time: {type: 'string'},
    end_time: {type: 'string'},
    creator: {type: 'string'},
    projectList: {type: 'array'},
    clientList: {type: 'array'},
    desc: {type: 'string'}
})
// 依柏诗项目列表
const EPSProjectSchema = new Schema('EPSProject', {
    name: {type: 'string'},
    creat_time: {type: 'number'},
    creator: {type: 'string'},
    desc: {type: 'string'}
})
// 依柏诗产品列表
const EPSGoodsSchema = new Schema('EPSGoods', {
    name: {type: 'string'},
    creat_time: {type: 'number'},
    code: {type: 'string'},
    update_time: {type: 'number'},
    creator: {type: 'string'},
    desc: {type: 'string'}
})
//----- Schema -----//

//+++++ Model +++++//
exports.User = mongolass.model('User',UserSchema)
exports.Article = mongolass.model('Article', ArticleSchema)
exports.EPSUser = mongolass.model('EPSUser', EPSUserSchema)
exports.EPSConsume = mongolass.model('EPSConsume', EPSConsumeSchema)
exports.EPSRecharge = mongolass.model('EPSRecharge', EPSRechargeSchema)
exports.EPSActive = mongolass.model('EPSActive', EPSActiveSchema)
exports.EPSProject = mongolass.model('EPSProject', EPSProjectSchema)
exports.EPSGoods = mongolass.model('EPSGoods', EPSGoodsSchema)
//----- Model -----//

