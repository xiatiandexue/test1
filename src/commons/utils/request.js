import axios from 'axios'
import { Message, MessageBox } from 'element-ui'

import store from '@/commons/store'
import router from '@/router/'
// create an axios instance
axios.defaults.withCredentials = true
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000, // request timeout
  withCredentials: true
})
export const fetch = (url, data) => {
  const params = { ...data.params,
    t: new Date().getTime()
  }
  data.params && data.params.push(params)
  return axios(url, data)
}
export const configProxy = (config) => {
  if (process.env.NODE_ENV === 'production') {

  }
  // console.log('withCredentials:', config.withCredentials)
  if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    config.data = {
      ...config.data,
      _t: Date.parse(new Date()) / 1000
    }
  } else if (config.method === 'get') {
    config.params = {
      _t: Date.parse(new Date()) / 1000,
      ...config.params
    }
  }
  return config
}
// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      // config.headers['X-Token'] = getToken()
    }

    // console.log('env', process.env.NODE_ENV)
    configProxy(config)
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  response => {
    // console.log('cookies', Cookies.get('SHAREJSESSIONID'))
    if (response.data.code === -1) {
      store.dispatch('FedLogOut').then(() => {
        // Message.error(response.data.msg || 'Verification failed, please login again')
        setTimeout(() => {
          router.push({ path: '/' })
        }, 2000)
      })
    }
    return response.data
  },

  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export const get = (url, params) => {
  return service({
    url: url,
    method: 'get',
    params: params
  })
}
export const post = (url, data) => {
  return service({
    url: url,
    method: 'get',
    data
  })
}

export const http = (url, data, method, responseType) => {
  if (method === 'get') {
    return service({
      url,
      method,
      params: data,
      responseType
    })
  } else {
    return service({
      url,
      method,
      data,
      responseType
    })
  }
}

export const http2 = (url, data, method) => {
  return service({
    url,
    method,
    data: data,
    responseType: 'blob'
  })
}
export const download = (_this, url, fileName) => {
  // const loading = _this.$loading({
  // lock: true,
  // text: '正在导出...',
  // spinner: 'el-icon-loading',
  // background: 'rgba(0, 0, 0, 0.7)'
  // })
  service({
    url,
    method: 'get'
  }).then(res => {
    console.log(res)
    // if ('msSaveOrOpenBlob' in navigator) {
    // window.navigator.msSaveOrOpenBlob(
    // new Blob([res]),
    // fileName
    // )
    // } else {
    // let url = window.URL.createObjectURL(new Blob([res]))
    // let link = document.createElement('a')
    // link.style.display = 'none'
    // link.href = url
    // link.setAttribute('download', fileName)
    // document.body.appendChild(link)
    // link.click()
    // }
    // loading.close()
  })
}  
export default service

// const service = axios.create({
//     baseURL: process.env.BASE_API, //api的base_url
//     withCredentials: true, //允许携带cookie
//     timeout: 5000 //请求超时时间
// })

// // http request 请求拦截器，有token值则配置上token值
// service.interceptors.request.use(
//     config => {
//         if (token) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
//             config.headers.Authorization = token;
//         }
//         return config;
//     },
//     err => {
//         return Promise.reject(err);
//     });

// // http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
// service.interceptors.response.use(
//     response => {
//         return response;
//     },
//     error => {
//         if (error.response) {
//             switch (error.response.status) {
//                 case 401:
//                     // 这里写清除token的代码
//                     router.replace({
//                         path: 'login',
//                         query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
//                     })
//             }
//         }
//         return Promise.reject(error.response.data) 
//     });

