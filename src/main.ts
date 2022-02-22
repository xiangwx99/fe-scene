import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lxRequest from './service'

createApp(App).use(router).use(store).mount('#app')
console.log(process.env.VUE_APP_BASE_URL)

interface DataType {
  data: any
  returnCode: string
  success: boolean
}

lxRequest
  .request<DataType>({
    url: '/home/multidata',
    method: 'GET',
    headers: {},
    interceptors: {
      requestInterceptor: (config) => {
        console.log('单个请求拦截成功')
        return config
      }
    }
  })
  .then((res) => {
    console.log(res)
  })

lxRequest
  .get<DataType>({
    url: '/home/multidata'
  })
  .then((res) => {
    console.log(res.returnCode)
  })
