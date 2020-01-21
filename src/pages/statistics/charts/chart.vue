<template>
  <div class="chartContent" ></div>
</template>
<script>
export default {
  props: {
    option: {
      type: Object,
      default: () => ({})
    }
  },
  watch:{
    "option": {
      deep: true,
      handler: function (value) {
        this.data = value;
      }
    }
  },
  data() {
    return {
        chart:null,
        data:this.option
    };
  },
  methods: {
      initHeighCharts() {
          this.chart = this.$HighCharts.chart(this.$el,this.data)
      }
  },
  mounted() {
      this.$nextTick(()=>{
            this.initHeighCharts()
            this.chart.reflow();
      })
  }
};
</script>
