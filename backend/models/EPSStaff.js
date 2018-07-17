const EPSStaff = require('./mongo').EPSStaff

module.exports = {
    create: function(data) {
        return EPSStaff.insertOne(data).exec()
    },
    delete: function(id) {
        return EPSStaff.remove({_id: id}).exec()
    },
    update: function(data) {
        return EPSStaff.update({_id: data._id}, {$set: {data}}).exec()
    },
    query: function(data) {
        return EPSStaff.findOne({name: data.name}).exec();
    }
}