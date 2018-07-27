const EPSActive = require('./mongo').EPSActive

module.exports = {
    create: function(data) {
        return EPSActive.insertOne(data).exec()
    },
    delete: function(data) {
        return EPSActive.remove({_id: data._id}).exec()
    },
    update: function(data) {
        return EPSActive.update({_id: data._id}, {$set: data}).exec()
    },
    query: function(params) {
        return EPSActive.find(params).exec();
    }
}