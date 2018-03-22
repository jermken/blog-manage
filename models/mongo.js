const Mongolass = require( 'mongolass')
const Schema = Mongolass.Schema
const mongolass = new Mongolass()

mongolass.connect('mongodb://127.0.0.1:27017/dbDatabase')

//----- Schema -----//
const UserSchema = new Schema('User', {
    name: {type: 'string'},
    password: { type: 'number'}
})

const ArticleSchema = new Schema('Aritcle', {
    author: {type: 'string'},
    label: {type: 'string'},
    title: {type: 'string'},
    date: {type: 'string'}
})
//----- Schema -----//

//----- Model -----//
exports.User = mongolass.model('User',UserSchema)
exports.Article = mongolass.model('Article', ArticleSchema)
//----- Model -----//

