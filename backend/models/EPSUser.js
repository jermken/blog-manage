const EPSUser = require('./mongo').EPSUser

module.exports = {
    create: function(data) {
        return EPSUser.insertOne(data).exec()
    },
    delete: function(id) {
        return EPSUser.remove({_id: id}).exec()
    },
    update: function(data) {
        return EPSUser.update({_id: data._id}, {$set: {data}}).exec()
    },
    query: function(data) {
        return EPSUser.findOne({name: data.name}).exec();
    }
}