import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { LXRequestConfig, LXRequestInterceptors } from './type'

import type { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'
import { ElLoading } from 'element-plus'
// https://github.com/element-plus/element-plus/issues/4855
import 'element-plus/theme-chalk/el-loading.css'

const DEAFULT_LOADING = true

export default class LXRequest {
  instance: AxiosInstance
  interceptors?: LXRequestInterceptors
  showLoading: boolean
  loading?: LoadingInstance
  constructor(config: LXRequestConfig) {
    // 创建axios实例
    this.instance = axios.create(config)
    this.interceptors = config.interceptors
    this.showLoading = config.showLoading ?? DEAFULT_LOADING
    // 1.从config中取出实例对应的拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )
    // 2. 全局拦截器
    this.instance.interceptors.request.use(
      (config) => {
        if (this.showLoading) {
          this.loading = ElLoading.service({
            lock: true,
            text: '数据请求中...',
            background: 'rgba(0, 0, 0, .5)'
          })
        }
        console.log('所有实例的拦截器：请求拦截成功')
        return config
      },
      (err) => {
        console.log('所有实例的拦截器：请求拦截失败')
        console.log(err)
      }
    )

    this.instance.interceptors.response.use(
      (res) => {
        console.log('所有的实例都有的拦截器: 响应成功拦截')
        // 将loading移除
        this.loading?.close()
        const data = res.data
        if (data.returnCode === '-1001') {
          console.log('请求失败~, 错误信息')
        } else {
          return data
        }
      },
      (err) => {
        console.log('所有的实例都有的拦截器: 响应失败拦截')
        // 将loading移除
        this.loading?.close()
        // 例子: 判断不同的HttpErrorCode显示不同的错误信息
        if (err.response.status === 404) {
          console.log('404的错误~')
        }
        return err
      }
    )
  }
  request<T>(config: LXRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 单个请求对config处理
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }
      if (config.showLoading === false) {
        this.showLoading = config.showLoading
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单个请求对数据处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }
          // showLoading恢复默认值，防止影响下一个请求
          this.showLoading = DEAFULT_LOADING
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  get<T>(config: LXRequestConfig<T>) {
    return this.request<T>({ ...config, method: 'GET' })
  }
  post<T>(config: LXRequestConfig<T>) {
    return this.request<T>({ ...config, method: 'POST' })
  }
  delete<T>(config: LXRequestConfig<T>) {
    return this.request<T>({ ...config, method: 'DELETE' })
  }
  patch<T>(config: LXRequestConfig<T>) {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}
