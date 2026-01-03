import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios

// 请求拦截器 - 添加worker token
axios.interceptors.request.use(
  config => {
    const workerToken = localStorage.getItem('worker_token')
    if (workerToken) {
      config.headers.token = workerToken
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理token过期
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('worker_token')
      localStorage.removeItem('worker_info')
      router.push('/login')
      ElementUI.Message.error('登录已过期，请重新登录')
    }
    return Promise.reject(error)
  }
)

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
