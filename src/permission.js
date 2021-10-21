import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式

const whiteList = ['/login'] // 不重定向白名单,'/website'
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (localStorage.token) {
    if (to.path === '/login') {
      next({ path: '/' })   
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      store.dispatch("FedLogOut").then(() => {
        next('/login')
        NProgress.done()
      });
      // next('/login')
      // NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})