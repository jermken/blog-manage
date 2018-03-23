exports.mongodbConfig = {
    mongoUrl: 'mongodb://localhost:27017/dbDatabase',
}

exports.sessionConfig = {
    name: 'fedBlog',
    key: 'fedBlog',
    maxAge: 60*60*1
}