const EPSActiveList = require('./mongo').EPSActiveList

module.exports = {
    create: function(data) {
        return EPSActiveList.insertOne(data).exec()
    },
    delete: function(data) {
        return EPSActiveList.remove({_id: data._id}).exec()
    },
    update: function(data) {
        return EPSActiveList.update({_id: data._id}, {$set: data}).exec()
    },
    query: function(params) {
        return EPSActiveList.find(params).exec();
    }
}