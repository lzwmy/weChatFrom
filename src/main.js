// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import api from "./http/api";
import store from './store'
import flexible from 'lib-flexible'
import MintUI from 'mint-ui'
import VConsole from 'vconsole/dist/vconsole.min.js' 

import axios from 'axios'
import request from './http/request'
import 'mint-ui/lib/style.css'

// new VConsole();

Vue.use(MintUI)
Vue.prototype.$http = api;

Vue.use(flexible)
Vue.config.productionTip = false
let HighCharts = require('highcharts');
Vue.prototype.$HighCharts = HighCharts;


let initApp = async () => {
  let url;
  if(process.env.NODE_ENV == 'development') {
    url = '../static/serverconfig.json'
  }else {
    url = './serverconfig.json'
  }
  axios.get(url+'?v='+new Date().getTime()).then((res)=>{
    request.defaults.baseURL = res.data.baseURL
    sessionStorage.setItem('serverConfig',JSON.stringify(res.data));
    new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>'
    })
  })
}
initApp();


