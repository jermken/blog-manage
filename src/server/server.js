import 'whatwg-fetch';

const publicPath = 'http://127.0.0.1:3030/api/'; // https://nile.dev.xone.xin/api/


/* 判断响应的状态 */
const checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error
    }
}

/* JSON转换返回值 */
const parseJSON = (response) => {
    return response.json();
}

/* 将get请求参数拼接成字符串 */
const objectToStr = (obj) => {
    let str = '';
    let arr = [];
    if(Object.prototype.toString.call(obj) === '[object Object]') {
        for(let i in obj) {
            let key_val = i + '=' + obj[i];
            arr.push(key_val);
        }
        str += arr.join('&');
        return str;
    }else if (Object.prototype.toString.call(obj) === '[object Array]') {

    }else{
        return str;
    }
}

/* 请求模块 */
const xmlHttpReq = {
    reqPOST: (url, data, cb) => {
        let time = new Date();
        time = time.getTime();
        url = publicPath + url + '?_time_=' + time;
        fetch(url,{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            credentials: 'include'
        })
        .then(checkStatus)
        .then(parseJSON)
        .then((data)=>{
            typeof cb === 'function' ? cb(data) : void 0
        })
        .catch((error) => {
            console.log('request failed', error);
        })
    },
    reqGET: (url, data, cb) => {
        let time = new Date();
        time = time.getTime();
        let URL = publicPath + url + '?_time_=' + time + '&' + objectToStr(data);
        fetch(URL,{
            credentials: 'include'
        })
        .then(checkStatus)
        .then(parseJSON)
        .then((data)=> {
            typeof cb === 'function' ? cb(data) : void 0
        })
        .catch((error) => {
            console.log('request failed', error);
        });
    }
};

export default xmlHttpReq;