import LXRequest from './request'
import { BASE_URL, TIME_OUT } from './request/config'

export default new LXRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: (config) => {
      console.log('单个实例的请求拦截')
      const token = '123'
      if (token && config.headers) {
        config.headers.Authorization = token
      }
      return config
    },
    requestInterceptorCatch: (err) => {
      console.log('单个实例请求失败的拦截')
      return err
    },
    responseInterceptor: (res) => {
      console.log('单个实例响应成功的拦截')
      return res
    },
    responseInterceptorCatch: (err) => {
      console.log('单个实例响应失败的拦截')
      return err
    }
  }
})
