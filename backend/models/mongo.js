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
// 依柏诗店员列表
const EPSStaffSchema = new Schema('EPSStaff', {
    name: {type: 'string'},
    create_time: {type: 'number'},
    update_time: {type: 'number'},
    address: {type: 'string'},
    contact: {type: 'string'},
    birthday: {type: 'string'},
    fileList: {type: 'string',default: '[]'},
    status: {type: 'number'}
})
// 依柏诗客户列表
const EPSUserSchema = new Schema('EPSUser', {
    name: {type: 'string'},
    create_time: {type: 'number'},
    update_time: {type: 'number'},
    isVip: {type: 'number'},
    vipCode: {type: 'string'},
    sexual: {type: 'string'},
    booker: {type: 'string'},
    contact: {type: 'string'},
    birthday: {type: 'string'},
    balance: {type: 'number'},
    activeList: {type: 'string'}
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

// 依柏诗项目列表
const EPSProjectSchema = new Schema('EPSProject', {
    name: {type: 'string'},
    creat_time: {type: 'number'},
    creator: {type: 'string'},
    desc: {type: 'string'}
})
// 依柏诗产品列表
const EPSGoodsSchema = new Schema('EPSGoods', {
    title: {type: 'string'},
    create_time: {type: 'number'},
    price: {type: 'string'},
    warnNum: {type: 'string'},
    code: {type: 'string'},
    update_time: {type: 'number'},
    joinStock: {type: 'string'},
    stock: {type: 'number'},
    desc: {type: 'string'},
    fileList: {type: 'string'}
})

// 依柏诗产品入库记录
const EPSStockLogSchema = new Schema('EPSStockLog', {
    title: {type: 'string'},
    joinStock: {type: 'string'}
})

// 依柏诗活动列表
const EPSActiveSchema = new Schema('EPSActiveList', {
    title: {type: 'string'},
    create_time: {type: 'number'},
    update_time: {type: 'number'},
    creator: {type: 'string'},
    begin_time: {type: 'string'},
    end_time: {type: 'string'},
    list: {type: 'string'},
    desc: {type: 'string'}
})
//----- Schema -----//

//+++++ Model +++++//
exports.User = mongolass.model('User',UserSchema)
exports.Article = mongolass.model('Article', ArticleSchema)
exports.EPSUser = mongolass.model('EPSUser', EPSUserSchema)
exports.EPSConsume = mongolass.model('EPSConsume', EPSConsumeSchema)
exports.EPSRecharge = mongolass.model('EPSRecharge', EPSRechargeSchema)
exports.EPSProject = mongolass.model('EPSProject', EPSProjectSchema)
exports.EPSGoods = mongolass.model('EPSGoods', EPSGoodsSchema)
exports.EPSStaff = mongolass.model('EPSStaff', EPSStaffSchema)
exports.EPSStockLog = mongolass.model('EPSStockLog', EPSStockLogSchema)
exports.EPSActive = mongolass.model('EPSActiveList', EPSActiveSchema)
//----- Model -----//

