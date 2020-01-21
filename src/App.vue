<template>
  <div id="app">
    <Head v-show="showHead"></Head>

    <div class="container" :class="(showHead?'container-showHead':'') + (showTabber?' container-showTabber':'')">
      <transition :name="transitionName">
        <keep-alive :include="includeRouter">
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>

    <tabbar v-show="showTabber"></tabbar>

  </div>
</template>

<script>
import Head from '@/components/common/header.vue'
import Tabbar from '@/components/common/tabbar.vue'
import '../static/css/reset.css'
import '../static/css/common.css'
import '../static/fonticon/iconfont.css'
import '../static/fonticon/iconfont.js'
export default {
  name: 'App',
  data(){
    return {
      showHead:false, //head是否显示
      showTabber: false, //底部tab是否显示
      headArr:['/news','/statistics'],   //显示head的组件
      tabber:['/home','/followUp','/news','/mine','/statistics'], //显示tabber的组件
      transitionName:"",  //动画名称
      code: "",
      //缓存的页面
      includeRouter: ['home']
    }
  },
  components: {
    Tabbar,
    Head
  },
  watch:{
    $route(to,from){
      //tabbar显隐
      if(this.tabber.indexOf(this.$route.path) != -1){
        this.showTabber = true;
      }else{
        this.showTabber = false;
      }
      //head显隐
      if(this.headArr.indexOf(this.$route.path) != -1){
        this.showHead = true;
      }else{
        this.showHead = false;
      }
    
      if(to.meta.index > from.meta.index){
        this.transitionName = "slide-right";
      }else if(to.meta.index < from.meta.index) {
        this.transitionName = "slide-left";
      }else {
        this.transitionName = "fade";
      }
    }
  },
  created() {
        console.log('url='+window.location.href)
  },
  mounted() {
    // 解决键盘弹出后挡表单的问题
    window.addEventListener('resize', function() {
      if(document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA'){
        window.setTimeout(function() {
          if('scrollIntoView' in document.activeElement) {
            document.activeElement.scrollIntoView(false);
            } else {
              document.activeElement.scrollIntoViewIfNeeded(false);
            }
          }, 0);
        }
    })
  },
  methods: {
      
  }
}
</script>

<style lang="scss" type="text/css">
html {
  font-size: 37.5px;
}
html, body {
  height: 100%;
}
#app{
  height: 100%;
  width: 100%;
  background: #fff;
  position: relative;
  .container{
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    width:100%;
    overflow-y: auto;
    &.container-showHead {
      top: 40px;
    }
    &.container-showTabber {
      bottom: 44px;
    }
  }
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 200ms;
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);

}

</style>
