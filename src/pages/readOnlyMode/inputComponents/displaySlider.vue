<template>
    <div :class="item.controlType">
      <div class="show-title">
        <span v-show="item.displayIsVisible">{{item.controlDisplayName}}: </span>
        <span :class="['slider_value-box',{'addColor':sliderValue}]" >{{sliderValue}}</span>
      </div>
      <mt-range v-model="sliderValue " v-if="item.baseProperty.sliderInfo.step > 0"
                :min="0"
                disabled
                :max="item.baseProperty.sliderInfo.max"
                :step="item.baseProperty.sliderInfo.step">
        <div slot="start" class="start">{{startText}}</div>
        <div slot="end" class="end">{{endText}}</div>
      </mt-range>
      <mt-range v-model="sliderValue " v-else-if="item.baseProperty.sliderInfo.step == 0"
                :min="0"
                disabled
                :max="item.baseProperty.sliderInfo.max">
      </mt-range>
    </div>
</template>

<script>
    export default {
      name: "displaySlider",
      props: {
        item: {
          type: Object,
          default: () =>({})
        },
        report: {
          type: Object,
          default: () => ({})
        }
      },
      data() {
        return {
          startText:"",
          endText:"",
          sliderValue:parseInt(this.report.value)|| 0
        }
      },
      watch:{
        'sliderValue':function (data) {
          this.report.value = data ;
        }
      },
      methods:{},
      mounted() {
        let optionContent = JSON.parse(this.item.termSet.rangeText || '[]') ;
        if(JSON.stringify(optionContent) != '[]' && JSON.stringify(optionContent) != null && JSON.stringify(optionContent) != 'null') {
          this.startText = optionContent[0].text;
          this.endText = optionContent[optionContent.length-1].text;
        }
      }
    }
</script>

<style lang="scss" scoped>
.SLIDER {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 5px;
  .show-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
      font-size: 14px;
      color: #333;
    }
    .slider_value-box {
      /*color: #666666;*/
      padding-left: 8px;
    }
  }
  /deep/ .mt-range{
    display: flex;
    /*flex: 1;*/
    padding: 0 8px;
    .start{
      font-size: 14px;
      color: #666666;
    }
    .end{
      font-size: 14px;
      color: #666666;
    }
  }
}
</style>
