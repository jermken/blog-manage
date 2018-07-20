const EPSGoods = require('./mongo').EPSGoods

module.exports = {
    create: function(data) {
        return EPSGoods.insertOne(data).exec()
    },
    delete: function(data) {
        return EPSGoods.remove({_id: data._id}).exec()
    },
    update: function(data) {
        return EPSGoods.update({_id: data._id}, {$set: data}).exec()
    },
    query: function(params) {
        return EPSGoods.find(params).exec();
    }
}