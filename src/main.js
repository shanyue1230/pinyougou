import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
// 引入elementUI的样式
import 'element-ui/lib/theme-chalk/index.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import axios from 'axios'
import ElTreeGrid from 'element-tree-grid'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

// 定义全局的过滤器
Vue.filter('dateFilter', function (value) {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})

// 全局注册组件
// console.log(ElTreeGrid.name)
Vue.component('el-table-tree-column', ElTreeGrid)

// 因为axiox本质上和vue没有关系，但是强行添加关系
Vue.prototype.axios = axios
// 设置axios全局默认的BASE-URL， 只要设置了全局的默认base_url，以后的请求会自动拼接上base_url
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 配置axios的请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log('请求到了哟', config.headers.Authorization)
  // 统一的给config设置 token
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log(response)
  return response.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
// 使用elementUI插件
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
