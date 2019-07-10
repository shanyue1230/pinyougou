import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'

// 只要模块化的环境，vue想要使用插件， 就必须调用vue.use方法
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: Index, name: 'index' },
    { path: '/login', component: Login, name: 'login' }
  ]
})

// from: 从哪儿来
// to: 到哪儿去
// next() 如果直接next() 放行   next('/login') 去登录
router.beforeEach((to, from, next) => {
  // console.log('to', to)
  // console.log('from', from)
  // 判断to, to去哪儿
  // to只要不是去login,都应该判断是否有token
  // to如果是去/login, 不管有没有token可以直接 next()
  // to不是去/login， 判断是否有token直接放行， 否则去login

  const token = localStorage.getItem('token')
  // if (to.path === '/login') {
  //   return next()
  // }
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
