<template>
  <div class="loading_img" v-show="url">
    <img :src="url" alt="">
  </div>
</template>

<script>
  export default {
    props: ['src'],
    data() {
      return {
        url: require('./../images/loading.gif')
      }
    },
    watch:{
      'src':function (data) {
        this.loadingImg()
      }
    },
    methods:{
      loadingImg() {
        let that = this;
        var newImg = new Image();
        newImg.src = that.src;
        /*newImg.onerror = () => { // 图片加载错误时的替换图片
          newImg.src = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1489486509807&di=22213343ba71ad6436b561b5df999ff7&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F77%2F31%2F20300542906611142174319458811.jpg'
        }*/
        newImg.onload = () => { // 图片加载成功后把地址给原来的img
          that.url = "";
          that.$nextTick(()=>{
            that.url = newImg.src
          })
        }
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>
.loading_img{
  height: 100%;
  width: 100%;
}
  .loading_img img{
    height: 100%;
    width: 100%;
  }
</style>
