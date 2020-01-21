<template>
  <div class="display_date-time-box">
    <span v-show="item.displayIsVisible" :class="type+'-title'">{{item.controlDisplayName}}：</span>
    <div class="date-time-item">
      <div class="date-time-input" @click="show">{{report.value || '请选择'}}</div>
      <date-time ref="dateTime"
                 type="dateTime"
                 @confirm="select"
                 format="yyyy-MM-dd hh:mm">
        <div slot="prevMonth"> <i>-</i> </div>
        <div slot="nextMonth"> <i>+</i> </div>
      </date-time>
    </div>
  </div>
</template>

<script>
  import dateTime from 'vue-date-time-m';
  export default {
    name: "displayDateTime",
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
      return {
        dataTime:""
      }
    },
    methods:{
      show () {
        this.$refs.dateTime.show()
      },
      select(val) {
        let dateTimes = val+":00";
        this.report.value = dateTimes;
      }
    },
    mounted() {
      console.log(this.report.value);
      if(this.report.value) {
         this.dateTime = this.report.value;
      }
    }
  }
</script>

<style lang="scss" scoped>
.display_date-time-box{
  display: flex;
  width: 100%;
  .date-time-item{
    display: flex;
    flex: 1;
    .date-time-input{
      width: 100%;
      color: #666666;
      font-size: 14px;
    }
  }
}
</style>
