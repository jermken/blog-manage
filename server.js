const express = require('express');
const app = express();
const path = require('path');
const apiHandler = require('./api/index');
const bodyParser = require('body-parser');

//设定静态文件目录，比如本地文件
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

//接口
apiHandler(app);

// 解决浏览器刷新问题
app.use('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(3337, () => {
    console.log('running at port 3337');
});