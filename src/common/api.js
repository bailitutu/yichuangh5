import axios from 'axios';

let http = axios.create({
    // baseURL: 'http://mock.eolinker.com/7LLxP4be2df0fac56f24034039684974bc6e07b4f34d54e?uri=',
    baseURL: 'http://www.yichuangpt.com/api',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    transformRequest: [function (data) {
        let newData = '';
        for (let k in data) {
            if (data.hasOwnProperty(k) === true) {
                newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
            }
        }
        return newData;
    }]
});

function apiAxios(method, url, params, response, error) {
    http({
        method: method,
        url: url,
        data: method === 'POST' || method === 'PUT' ? params : null,
        params: method === 'GET' || method === 'DELETE' ? params : null,
    }).then(function (res) {
        if (res.data.code == '0') {
            response(res.data);
        } else {
            if(!res.data){
                res.data = {
                    msg: '系统异常！'
                }
            }
            error ? error(res.data) : function () {};
        }
    }).catch(function (err) {
        if(!err.msg){
            err.msg = '系统异常!'
        }
        error ? error(err) : function () {
            alert('系统异常')
        };
    })
}

export default {
    get: function (url, params, response,error) {
        return apiAxios('GET', url, params, response,error)
    },
    post: function (url, params, response,error) {
        return apiAxios('POST', url, params, response,error)
    },
    put: function (url, params, response,error) {
        return apiAxios('PUT', url, params, response,error)
    },
    delete: function (url, params, response,error) {
        return apiAxios('DELETE', url, params, response,error)
    }
}
