import { AxiosRequestConfig, AxiosResponse } from 'axios'
export interface LXRequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (err: any) => any
  responseInterceptor?: (res: T) => T
  responseInterceptorCatch?: (err: any) => any
}
export interface LXRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: LXRequestInterceptors<T>
  showLoading?: boolean
}
