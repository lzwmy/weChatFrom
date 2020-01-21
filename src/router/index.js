import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/**
 * backKey: header是否需要返回按钮
 * index: 页面层级
 */

const staticRouter = new Router({
  routes: [
    {
      path: '/home',
      name:"home",
      meta: {
        title: "患者记录",
        index:1
      },
      component: resolve => require(['@/pages/home/index.vue'], resolve)
    },
    {
      path: '/addPatient',
      name:"addPatient",
      meta: {
        title: "添加患者",
        index:20
      },
      component: resolve => require(['@/pages/home/addPatient.vue'], resolve)
    },
    {
      path: '/patient',
      name:"patient",
      meta: {
        title: "患者信息",
        backKey: true,
        index: 3
      },
      component: resolve => require(['@/pages/patient/patient.vue'], resolve)
    },
    {
      path: '/portionsDetail',
      name:"portionsDetail",
      meta: {
        title: "基本信息",
        backKey: true,
        index: 3
      },
      component: resolve => require(['@/pages/patientInfo/index.vue'], resolve)
    },
    {
      path: '/login',
      name:"login",
      meta: {
        title: "科研专病平台",
        backKey: false,
        index: 1
      },
      component: resolve => require(['@/pages/login/index.vue'], resolve)
    },
    {
      path: '/mine',
      name:"mine",
      meta: {
        title: "我的",
        backKey: false,
        index: 1
      },
      component: resolve => require(['@/pages/mine/mine.vue'], resolve)
    },
    {
      path: '/news',
      name:"news",
      meta: {
        title: "消息",
        backKey: false,
        index: 1
      },
      component: resolve => require(['@/pages/news/news.vue'], resolve)
    },
    {
      path: '/statistics',
      name:"statistics",
      meta: {
        title: "统计",
        backKey: false,
        index: 1
      },
      component: resolve => require(['@/pages/statistics/statistics.vue'], resolve)
    },
    {
      path: '/followUp',
      name:"followUp",
      meta: {
        title: "随访",
        backKey: false,
        index: 1
      },
      component: resolve => require(['@/pages/followUp/followUp.vue'], resolve)
    },
    {
      path: '*',
      redirect:"/home"
    }
  ]
})

//跳转路由前进行登录校验
// staticRouter.beforeEach((to, from, next) => {
//   if(to.path == '/login') {
//     console.log("进入登录页")
//     next()
//   }else {
//     if(!window.localStorage.getItem('vuex_'+window.location.host)) {
//         console.log("定向到登录页")
//         next('/login');
//     }else {
//       console.log("正常router跳转")
//         next();
//     }
//   }
// });

export default staticRouter;