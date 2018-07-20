const EPSStaff = require('./mongo').EPSStaff

module.exports = {
    create: function(data) {
        return EPSStaff.insertOne(data).exec()
    },
    delete: function(data) {
        return EPSStaff.remove({_id: data._id}).exec()
    },
    update: function(data) {
        return EPSStaff.update({_id: data._id}, {$set: data}).exec()
    },
    query: function(data) {
        let params = data.name ? {name: data.name} : {};
        return EPSStaff.find(params).exec();
    }
}