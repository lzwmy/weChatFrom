<template>
  <div :class="typeSwitch(item.controlType)" v-if="item.controlType != 'TABLE'">
    <!-- <div class="cell-title" v-if="item.controlType != 'GATHER'">
      <span>{{item.controlDisplayName+':'}}</span>
    </div>-->
    <!-- input + 下拉列表 -->
    <!-- <inputNumberUnit
      v-if="item.controlType=='NUMBER_INPUT' && !item.termUnit.unitName"
      :type="typeSwitch(item.controlType)"
      :item="handleGather(item)"
      :report="report"
    ></inputNumberUnit> -->
    <!-- 输入框  v-else-if="item.controlType != 'SINGLE_INPUT' && item.controlType !== 'SCORE' " item.controlType == 'DATE_TIME'|| ||  item.controlType == 'DATE'-->
    <onlyInput
      v-if="item.controlType == 'SINGLE_INPUT' "
      :type="typeSwitch(item.controlType)"
      :item="item"
      :report="report"
    ></onlyInput>

    <!-- 下拉列表 -->
    <inputSelect
      v-if="item.controlType=='SINGLE_COMBOX' || item.controlType=='MULTI_COMBOX'"
      :type="typeSwitch(item.controlType)"
      :item="handleGather(item)"
      :report="report"
    ></inputSelect>

    <!-- NUMBER_INPUT + 单位 -->
    <div class="number_input-container" v-if="item.controlType=='NUMBER_INPUT'" style='width:100%;'>
      <!-- <p
        class="termUnit"
        v-if="item.controlType=='NUMBER_INPUT' && item.termUnit.unitName"
      >{{item.termUnit.unitName}}</p> -->
      <display-number-input :item="handleGather(item)" :report="report"></display-number-input>
    </div>

    <inputTextarea v-if="item.controlType=='MULTI_INPUT'" :item="item" :report="report"></inputTextarea>
    <!-- 集合 -->
    <div v-if="item.controlType == 'GATHER'">
      <inputGather
        :type="typeSwitch(item.controlType)"
        v-if="item.controlType=='GATHER'"
        :item="item"
        :report="report"
      ></inputGather>
    </div>

    <!-- 单选按钮集合 -->
    <inputRadionList
      v-if="item.controlType=='RADIO_BUTTON'"
      :item="handleGather(item)"
      :report="report"
    ></inputRadionList>

    <!-- 多选 -->
    <inputChecklist v-if="item.controlType=='CHECKBOX'" :item="handleGather(item)" :report="report"></inputChecklist>
    <!-- 评分控件 -->
    <div v-if="item.controlType == 'SCORE'">
      <display-score :item="item" :report="report"></display-score>
    </div>
    <!--级联控件-->
    <div style="width: 100%;" v-if="item.controlType == 'CASCADE'">
      <display-cascade :item="item" :report="report"></display-cascade>
    </div>
    <!--日期时间-->
    <display-date-time v-if="item.controlType == 'DATE_TIME'"
                       :item="item"
                       :report="report">
    </display-date-time>
    <!--日期控件-->
    <display-Date v-if="item.controlType == 'DATE'"
                  :item="item"
                  :report="report"></display-Date>
    <!--滑块控件-->
    <display-slider v-if="item.controlType == 'SLIDER'" :item="item" :report="report"></display-slider>
  </div>
</template>

<script>
import onlyInput from "./inputComponents/onlyInput";
import inputNumberUnit from "./inputComponents/inputNumberUnit";
import inputSelect from "./inputComponents/inputSelect";
import inputGather from "./inputComponents/inputGather";
import inputChecklist from "./inputComponents/inputChecklist";
import inputRadionList from "./inputComponents/inputRadionList";
import inputTextarea from "./inputComponents/inputTextarea";
import displayScore from "./inputComponents/displayScore";
import displayNumberInput from './inputComponents/displayNumberInput';
import displayCascade from './inputComponents/displayCascade';
import displayDateTime from './inputComponents/displayDateTime';
import displaySlider from './inputComponents/displaySlider';
import displayDate from  './inputComponents/displayDate';
export default {
  name: "formItemInput",
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
  components: {
    onlyInput,
    inputNumberUnit,
    inputSelect,
    inputGather,
    inputChecklist,
    inputRadionList,
    inputTextarea,
    displayScore,
    displayNumberInput,
    displayCascade,
    displayDateTime,
    displaySlider,
    displayDate
  },
  created() {},
  methods: {
    //统一处理集合的rangeText
    handleGather(item) {
      if (item.termSet && item.termSet.rangeText) {
        item.termSet.termItemList = item.termSet.rangeText
          .split("\n")
          .filter(el => {
            return el !== "";
          });
        // console.log(item.termSet.termItemList,this.report)
      }
      return item;
    },
    //按钮集合
    handleRadioArr(arr) {
      return arr.map(item => {
        return item.termItemName;
      });
    },
    //类型转换
    typeSwitch(str) {
      let type;
      switch (str) {
        case "DATE_TIME":
          type = "date";
          break;
        case "DATE":
          type = "date";
          break;
        case "SINGLE_INPUT":
          type = "text";
          break;
        case "MULTI_INPUT":
          type = "textarea field-noInput";
          break;
        case "SINGLE_COMBOX":
          type = "field-select";
          break;
        case "TABLE":
          type = "field-hide";
          break;
        case "GATHER":
          type = "gather";
          break;
        case "RADIO_BUTTON":
          type = "field-radion field-noInput";
          break;
        case "NUMBER_INPUT":
          type = "number";
          break;
        case "CHECKBOX":
          type = "field-checkbox field-noInput";
          break;
        case "SCORE":
          type = "score";
          break;
        default:
            // type = "text";
          break;
      }
      return type;
    }
  }
};
</script>
