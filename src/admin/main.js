// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from '../router'
import 'font-awesome/css/font-awesome.css'
import '@/commons/styles/index.scss' // global css
import '@/assets/styles/common.scss' // 覆盖index.scss中的样式
import store from '@/commons/store'
// import store from '../vuex/store'
import '@/commons/permission' // permission control
import 'es6-promise'
import 'svg.js'
import '@/assets/images/icons/index.js'


Vue.config.productionTip = false
import axios from 'axios';
let axiosIns = axios.create({
  // 发布
  baseURL:'/',
  // 开发
  baseURL: '/api/',
});
Vue.prototype.$http = axiosIns;

Vue.prototype.$axios = axios;

Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
