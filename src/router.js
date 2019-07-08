import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'

// 只要模块化的环境，vue想要使用插件， 就必须调用vue.use方法
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: Login },
    { path: '/index', component: Index }
  ]
})

export default router
