const Article = require('./mongo').Article

module.exports = {
    create: function(data) {
        return Article.insertOne(data).exec()
    },
    delete: function(id) {
        return Article.remove({_id: id}).exec()
    },
    update: function(data) {
        return Article.update({_id: data._id}, {$set: data}).exec()
    },
    query: function(data) {
        let params = data._id ? {_id: data._id} : {};
        return Article.find(params).exec();
    }
}