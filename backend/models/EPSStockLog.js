const EPSStockLog = require('./mongo').EPSStockLog

module.exports = {
    create: function(data) {
        return EPSStockLog.insertOne(data).exec()
    },
    delete: function(data) {
        return EPSStockLog.remove({_id: data._id}).exec()
    },
    update: function(data) {
        return EPSStockLog.update({title: data.title}, {$set: data}).exec()
    },
    query: function(data) {
        let params = data.title ? {title: data.title} : {};
        return EPSStockLog.find(params).exec();
    }
}