<template>
  <nav class="tabs">
    <li class="tab" v-for="(items, index) in tabData" :key="index">
      <router-link :to="items.path">
        <!-- <span class="icon iconfont" :class="$route.path == items.path?items.iconPathActive:items.iconPath"></span> -->

        <svg class="icon" aria-hidden="true">
          <use :xlink:href="$route.path == items.path?items.iconPathActive:items.iconPath"></use>
        </svg>
        <span>{{items.title}}</span>
      </router-link>
    </li>
  </nav>
</template>

<script>
import { Tabbar, TabItem } from 'mint-ui';
export default {
  name: 'tabbar-com',
  data () {
    return {
      tabData: [
        {
          title:"患者",
          path:"/home",
          iconPath:"#iconhuanzhe-weixuanzhong",
          iconPathActive:"#iconhuanzhe-xuanzhong"
        },
        {
          title:"随访",
          path:"/followUp",
          iconPath:"#iconsuifang-weixuanzhong",
          iconPathActive:"#iconsuifang-xuanzhong"
        },
        {
          title:"消息",
          path:"/news",
          iconPath:"#iconxiaoxi-weixuanzhong",
          iconPathActive:"#iconxiaoxi-xuanzhong"
        },
        {
          title:"统计",
          path:"/statistics",
          iconPath:"#icontongji-weixuanzhong",
          iconPathActive:"#icontongji-xuanzhong"
        },
        {
          title:"我的",
          path:"/mine",
          iconPath:"#iconwode-weixuanzhong",
          iconPathActive:"#iconwode-xuanzhong"
        },
      ]
    }
  },
  watch:{
    $router: function(to) {
      console.log(to)
    }
  }
}
</script>

<style lang="scss">
.tabs{
    height: 49px;
    position: absolute;
    z-index: 999;
    bottom:0;
    left:0;
    right:0;
    display: flex;
    background: #fff;
    justify-content: center;
    align-items: center; 
    box-shadow:0px -1px 0px 0px rgba(238,238,238,1);
}
.tabs li{
    height: 100%;
    flex: 1;
    position: relative;
}
.tabs li a {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color:#999;
    svg.icon {
        width: 22px;
        height: 22px;
    }
    span {
        font-size: 12px;
    }
}
.tabs li a.router-link-active{
    color: #2395f7;
}
</style>
