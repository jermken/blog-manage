const EPSConsume = require('./mongo').EPSConsume

module.exports = {
    create: function(data) {
        return EPSConsume.insertOne(data).exec()
    },
    delete: function(data) {
        return EPSConsume.remove({_id: data._id}).exec()
    },
    update: function(data) {
        return EPSConsume.update({_id: data._id}, {$set: data}).exec()
    },
    query: function(data) {
        let params = data.name ? {name: data.name} : {};
        return EPSConsume.find(params).exec();
    }
}