<template>
  <div class="display_Date">
    <span v-show="item.displayIsVisible" :class="type+'-title'">{{item.controlDisplayName}}：</span>
    <div class="DATE_box">
      <div :class="['DATE_BTN',{'addColor':report.value}]" >{{selectedValue1 || '(空)'}}</div>
      <!--<date-time ref="dateTime"
                 type="date"
                 @confirm="select">
      </date-time>-->
    </div>
  </div>
</template>

<script>
  import dateTime from 'vue-date-time-m';
  export default {
    components:{
      dateTime
    },
    props: {
      type: {
        type: String,
        default: ""
      },
      item: {
        type: Object,
        default: () => ({})
      },
      report: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return{
        selectedValue1:this.report.value || "",
      }
    },
    methods:{
      toogleDate() {
        this.$refs.dateTime.show()
      },
      select(val) {
        let dateFormat = val.split("/").join('-');
        this.selectedValue1 = dateFormat;
        this.report.value = dateFormat;
      },
    },
    mounted() {
    }
  }
</script>

<style lang="scss" scoped>
.display_Date {
  display: flex;
  width: 100%;
  .DATE_box{
    display: flex;
    flex: 1;
    .DATE_BTN {
      width: 100%;
      /*color: #666666;*/
      font-size: 14px;
    }
  }
}
</style>
