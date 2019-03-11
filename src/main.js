// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import 'font-awesome/css/font-awesome.css'
import store from './vuex/store'
import './src/assets/styles/sidebar.scss'

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
