import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI, { MessageBox } from 'element-ui';
// import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-CN'; // lang i18n

import '@/styles/index.scss'; // global css
import '@/styles/common.scss'; // global css
import { message } from '@/utils/messageUtil';

import App from './App';
import router from './router';
import store from './store';

import '@/icons'; // icon
import '@/permission'; // permission control
import VueDND from 'awe-dnd';
Vue.use(VueDND);
import axios from 'axios';

import conFun from './utils/comFun.js';
Vue.use(conFun);

Vue.prototype.$axios = axios;

Vue.use(ElementUI, { locale });

Vue.prototype.$message = message;

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
// 初始化定时器
let timer = null;
// 清除定时器
if (timer) {
  clearTimeout(timer)
}
const $axios = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000000, // 请求超时时间
  headers: {
    Authorization: `Bearer ${localStorage.token}`
  }
})
$axios.interceptors.request.use(function (config) {
  // 在发送请求设置cancel token
  config.cancelToken = new axios.CancelToken(cancel => {
    store.commit('pushToken', {cancelToken: cancel})
  })
    return config;
  }, function (error) {
    // 对请求错误的处理
    return Promise.reject(error);
  });
  $axios.interceptors.response.use(response => {
    return Promise.resolve(response);
  }, error => {
  // 请求取消时，也会进入error，根据axios.isCancel()：true--请求取消  false--请求失败
  // 仅在请求失败时做后续处理
  if (axios.isCancel(error)) {
    return new Promise(() => {})
  } else {
    let msg = '服务器繁忙，请联系管理员或稍后再试'
    if (error.response.data.errMessage) {
      msg = error.response.data.errMessage
    } else if (error.response.statusText) {
      msg = error.response.statusText
    } else if (error.response.data.error) {
      msg = error.response.data.error
    }
    msg = msg.slice(0, 100)
    message({ message: msg, type: 'error' });
    return Promise.reject(error);
  }
});

/**
 * @description axios请求封装
 * @param {String} method 请求方法（get、post等）
 * @param {String} url 用于请求的服务器URL
 * @param {Object} params 用于请求的参数
 * @param {Object} config request header参数配置
 * @returns {Promise} promise异步请求
 */
Vue.prototype.$request = function (method, url, params = {}, config = {}) {
  params = method.toLowerCase() === 'get' ? { params } : params
  return $axios[method](url, params, config)
}
