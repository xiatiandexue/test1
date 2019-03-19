import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/view/layout/'

Vue.use(Router)
const paperRouter = [
  {path: '/examinationPaper/autoGeneration', component: () => import('@/view/examinationPaper/autoGeneration'), name: 'AutoGeneration', meta: { title: '自动组卷'}},
  {path: '/examinationPaper/', component: () => import('@/view/examinationPaper/'), name: 'Paper', meta: { title: '试卷管理'}},
  {path: '/examinationPaper/updatePaper', component: () =>('@/view/examinationPaper/updatePaper'), name: 'UpdatePaper', meta: { title: '更新试卷' }}
]
export const constantRouterMap = [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/view/login/Login'),
      hidden: true
    },
    {
      path: '/authredirect',
      component: () => import('@/view/login/authredirect'),
      hidden: true
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      name: 'index',
      meta: { title: '首页' },
      children: [
        {
          path: '/dashboard',
          component: () => import('@/view/Main'),
          name: 'Layout',
          meta: { title: '首页', noCache: true }
        }
      ]
      },
      {
        path: '/updatepsw',
        component: Layout,
        redirect: '/updatepsw',
        name: 'updataIndex',
        meta: { title: '密码管理' },
        children: [
          {
            path: '/updatepsw',
            component: () => import('@/view/updatePSW/'),
            name: 'updatepsw',
            meta: { title: '修改密码'}
          }
        ]
      },
      {
        path: '/score',
        component: Layout,
        redirect: '/score/',
        name: 'scoreIndex',
        meta: { title: '成绩管理', icon: 'component' },
        children: [
          {
            path: '/score',
            component: () => import('@/view/score/'),
            name: 'score',
            meta: { title: '查看成绩'}
          }
        ]
      },
      {
        path: '/examinationPaper',
        component: Layout,
        redirect: '/examinationPaper/autoGeneration',
        name: 'paperIndex',
        meta: { title: '试卷管理', icon: 'component' },
        children: paperRouter
      },
    // {
    //   path: '',
    //   name: '',
    //   meta: {
    //       requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    //   },
    //   component: 
    // }
  ]

// router.beforeEach((to, from, next) => {
//   if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
//       if (store.state.token) {  // 通过vuex state获取当前的token是否存在
//           next();
//       }
//       else {
//           next({
//               path: '/Login',
//               query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
//           })
//       }
//   }
//   else {
//       next();
//   }
// })
export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap, // _router
  base: process.env.NODE_ENV === 'production' ? '/examination/' : '/' // ui-web生产环境是tomcat时文件夹的名字
})

