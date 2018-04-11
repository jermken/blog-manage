const User = require('./mongo').User

module.exports = {
    create: function(data) {
        return User.insertOne(data).exec()
    },
    delete: function(id) {
        return User.remove({_id: id}).exec()
    },
    update: function(data) {
        return User.update({_id: data._id}, {$set: {data}}).exec()
    },
    query: function(data) {
        return User.findOne({name: data.name}).exec();
    }
}