exports.mongodbConfig = {
    mongoUrl: 'mongodb://localhost:27017/dbDatabase',
}

exports.sessionConfig = {
    name: 'ybs',
    key: 'ybs',
    maxAge: 10*60*60*1000
}