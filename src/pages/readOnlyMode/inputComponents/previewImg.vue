<template>
  <transition name="fade">
    <div class="zhezhao">
      <div style="width:100%;height:100%;position:relative;" @touchstart="startChange" @touchend="changeImg">
        <img :src="imgs[0]" alt="" style="max-width: 100%;
          max-height: 100%;
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          margin: auto;">
      </div>
      <!-- <div style="width:20px;height:20px;position:absolute;top:15px;right:15px;color:#FFF;border-radius:100%;background-color:rgba(255,255,255,.2);text-align:center;line-height:18px;cursor:pointer">
        x
      </div> -->
    </div>
  </transition>
</template>
<script>
  export default {
    props: {
      imgs: {
        default: [],
        type: Array
      },
      currentImg: {
        default: '',
        type: Number
      }
    },
    data () {
      return {
        current: this.currentImg,
        currentX: '',
        currentIndex: ''
      }
    },
    watch: {
      currentImg (val,old) {
        this.getIndex(val)
      }
    },
    mounted () {
      this.getIndex(this.currentImg)
    },
    methods: {
      startChange (e) {
        this.currentX = e.changedTouches[0].clientX
      },
      changeImg (e) {
        let distance = e.changedTouches[0].clientX - this.currentX
        if (-10< distance && distance <10) {
          this.$emit('close')
        } else if (distance < -50) {
          this.swipeLeft()
        } else {
          this.swipeRight()
        }
      },
      getIndex (url) {
        for (let i = 0,len = this.imgs.length;i < len;i ++) {
          if (this.imgs[i] == url) {
            this.currentIndex = i
            break
          }
        }
      },
      swipeLeft () {
        if (this.currentIndex != (this.imgs.length - 1)) {
          this.currentIndex++
        } else {
          this.currentIndex = 0
        }
        this.current = this.imgs[this.currentIndex]
      },
      swipeRight () {
        if (this.currentIndex == 0) {
          this.currentIndex = this.imgs.length - 1
        } else {
          this.currentIndex--
        }
        this.current = this.imgs[this.currentIndex]
      },
    }
  }
</script>
<style scoped>
  .zhezhao {
    position: fixed;
    top:0;
    bottom: 0;
    left:0;
    right: 0;
    background-color: #000;
    z-index: 3;
  }
</style>
