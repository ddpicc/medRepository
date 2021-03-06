// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Qs from 'qs'
import store from './store'
import VueResource from 'vue-resource'
import axios from 'axios'
//引入element组件化框架
import ElementUI from "element-ui"
//引入样式文件
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'



Vue.config.productionTip = false


Vue.use(ElementUI);
Vue.use(VueResource);
Vue.prototype.axios = axios;
Vue.prototype.qs = Qs;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
