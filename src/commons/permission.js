import router from '../router/'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/commons/utils/auth' // getToken from cookie
NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/authredirect', '/401', '/404']// no redirect whitelist,免登录白名单
// permission judge function
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    /* has token */
    // console.log('带token进入')
    // debugger
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    }else{
      // debugger
      next()
    }
  } else {
    // /* has no token */
    // console.log('直接进入')
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
      // next({path:'/login'}) // 否则全部重定向到登录页
      // NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
