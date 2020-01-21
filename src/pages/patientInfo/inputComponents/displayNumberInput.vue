<template>
  <div :class="['number_input','flex-between-center',item.controlType]">
    <i v-show="item.baseProperty.isRequired"
       :class="{isRequired:item.baseProperty.isRequired}"
       :data-value="report.value || report.value2"
       style="color: red">*&nbsp;</i>
    <div class="number-title"  v-show="item.displayIsVisible">{{item.controlDisplayName}}：</div>
    <div class="flex-right">
      <!-- style="width:28%;" -->
      <div class="number_input text-right">
      <input type="text" v-model="report.value" placeholder="请填写"/>
    </div>
    <div class="number_unit" v-if="item.termUnit.numberIsSwitch=='1'">{{item.termUnit.unitName}}</div>
    <div class="number_checkbox" v-if="item.termUnit.numberIsSwitch=='0'">
      <select
        :multiple="item.controlType=='MULTI_COMBOX'"
        v-model="report.value2"
        placeholder="请选择"
      >
        <option
          :name="termItemList"
          v-for="(termItemList, termSetIndex) in item.termSet.termItemList"
          :key="termSetIndex"
        >{{termItemList}}</option>
      </select>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
    return {};
  },
  created() {
    // this.report.value = this.report.value;
  },
  mounted() {
  }
};
</script>

<style lang="scss" scoped>
    .number_input{
      .number_unit{
        font-size: 15px;
        white-space: nowrap;
        margin-left: 10px;
        // transform: translateY(1px);
        position: relative;
        top:2px;
        align-items:center;
      }
      .number-title{
        font-size: 14px;
        color: #333;
        position: relative;
        /*top: 3px;*/
        top: 0;
        height: 100%;
      }
    }
    .flex-right{
      display: flex;
      // width: 100%;
      /*height: 100%;*/
      // justify-content: flex-end;
      /*align-items:center;*/
      /*flex: 1;*/
      // padding-left: 12px;
      .text-right{
        input{
          text-align: right;
        }
      }
    }

  .NUMBER_INPUT{
    justify-content: flex-start;
    .number_input{
      input{
        width: 65px;
        vertical-align: middle;
      }
    }
  }
</style>
