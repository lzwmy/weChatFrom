import axios from "axios"

// 创建axios实例
const service = axios.create({
    // baseURL: 'http://120.77.199.11:8801/',
    headers: {
        'Cache-Control': 'no-cache'
    }
});

// request拦截器
service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// respone拦截器
service.interceptors.response.use(
    response => {
        return Promise.resolve(response.data);
    },
    error => {
        return Promise.reject(error)
    }
)

//封装get接口
export function get(url, params = {}) {
    params.t = new Date().getTime(); //get方法加一个时间参数,解决ie下可能缓存问题.
    return service({
        url: url,
        method: 'get',
        params
    })
}

//封装post请求
export function post(url, data = {}) {
    //默认配置
    let sendObject = {
        url: url,
        method: "post",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    };
    sendObject.data = JSON.stringify(data);
    return service(sendObject)
}


export default service;
