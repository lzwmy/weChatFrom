<template>
    <div  class="image_view-container" :data-status="state">
      <viewer :images="photo" :options="Options"  class="viewer" ref="viewer">
        <img
          v-for="(src,index) in photo"
          :src="src"
          :key="index"
        >
      </viewer>
    </div>
</template>

<script>
  import Vue from 'vue';
  import Viewer from 'v-viewer'
  import 'viewerjs/dist/viewer.css'
  Vue.use(Viewer)
  import $ from 'jquery';
    export default {
      props:{
        url:{
          type:Array,
          default:null
        },
        state:{
          type:Boolean,
          default:null
        }
      },
      data() {
        return {
          photo:this.url,
          Options: {
            'inline': false,
            'button': false,
            'navbar': false,
            'title': false,
            'toolbar': false,
            'tooltip': false,
            'movable': true,
            'zoomable': true,
            'rotatable': true,
            'scalable': false,
            'transition': true,
            'fullscreen': true,
            'keyboard': false,
            'url': 'data-source'
          }
        }
      },
      methods:{
        show() {
          const viewer = this.$refs.viewer.$viewer;
          viewer.show();
          // console.log(viewer);
          this.imgTransformProcess()
        },
        onCloseImg() {
          this.$emit('on-close',false);
        },
        imgTransformProcess() {
          let that = this;
          let time = setInterval(()=>{
            if(document.querySelectorAll('.viewer-loading').length!==0){
              document.querySelectorAll('.viewer-canvas>img')[0].style.display = 'none';
              clearInterval(time);
            }else{
              that.imgTransformProcess();
              clearInterval(time)
            }
          })
        }
      },
      mounted() {
        //监听图片查看器 关闭
        this.$nextTick(()=>{
          if(this.state) {
            let that = this;
            window.addEventListener('click',function (e) {
              setTimeout(()=>{
                var el = $('.viewer-container')[0];
                if($(el).hasClass('viewer-in')) {
                  // console.log('打开')
                  return ;
                }
                if($(el).hasClass('viewer-hide')) {
                  that.onCloseImg();
                }
              },700)
            })
          }
        })
      },
      /*destroyed() {
        let that = this;
        window.removeEventListener('click',function () {
          that.onCloseImg();
        },true);
      }*/
    }
</script>

<style scoped>
.viewer img{
  display: none;
}
</style>
