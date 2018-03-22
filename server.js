const express = require('express');
const app = express();
const path = require('path');
const apiHandler = require('./api/index');
const bodyParser = require('body-parser');

const Mongolass = require('mongolass');
const Schema = Mongolass.Schema;
const mongolass = new Mongolass();
mongolass.connect('mongodb://127.0.0.1:27017/dbDatabase');

const UserSchema = new Schema('UserShema', {
    name: {type: 'string'},
    age: { type: 'number'}
});


const User = mongolass.model('User', UserSchema);
User.insertOne({
    name: 'jermken',
    age: 26
}).exec().then();
//设定静态文件目录，比如本地文件


app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

//接口
apiHandler(app);
app.use('/api/index', (request, response) => {
    User.find({name: 'jermken'}).exec().then((res)=>{
        console.log(res);
        response.send({
            code: 0,
            str: res
        });
    });  
});
// 解决浏览器刷新问题
app.use('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(3337, () => {
    console.log('running at port 3337');
});