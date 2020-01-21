<template>
  <div class="gather gather-box" :class="item.controlType">
    <!-- {{item}} -->
    <!-- 1、渲染 gather title
    (item.gatherFoldFlag == 1 || item.gatherKnowType > 0 )&&
    2、 根据 getherKowntype ==1  触发 是否显示 有无 -->
    <!-- {{item.gatherFoldFlah}} -->
    <div :class="item.controlType+'_title'" v-if=" item.controlType !='TABLE'">
      <!-- style="width: 100%;" -->
      <div :class="['cell-title','gather_'+item.controlType]" v-show="item.displayIsVisible">
        <span v-if="item.gatherKnowType == 0" style="color: #000000;font-weight: bold;">{{item.controlDisplayName}}</span>
        <span v-else>{{item.controlDisplayName}}：</span>
      </div>
      <!-- v-if="item.gatherFoldFlah==1&&item.gatherKnowType>0" ['有', '无']-->

      <!--<mt-radio
        v-if="item.gatherKnowType==1"
        v-model="report.value"
        @change="changeKnowType(report.value)"
        :options="option">
      </mt-radio>
      <mt-radio
        v-if="item.gatherKnowType==2"
        v-model="report.value"
        @change="changeKnowType(report.value)"
        :options="option">
      </mt-radio>
      <mt-radio
        v-if="item.gatherKnowType==3"
        v-model="report.value"
        @change="changeKnowType(report.value)"
        :options="option">
      </mt-radio>-->
      <span v-if="item.gatherKnowType==1" :class="[{'addColor':report.value}]">{{report.value || "(空)"}}</span>
      <span v-if="item.gatherKnowType==2" :class="[{'addColor':report.value}]">{{report.value || "(空)"}}</span>
      <span v-if="item.gatherKnowType==3" :class="[{'addColor':report.value}]">{{report.value || "(空)"}}</span>
      <!-- v-if="item.gatherFoldFlah==1&&item.gatherKnowType>0" -->
      <!-- <mt-button size="small" plain v-if="item.gatherKnowType>0" @click="clearGather">清空</mt-button> -->
      <!-- <div v-if="report.value=='有'&& item.gatherFoldFlah==1 " >
          <inputGather
              v-for="(items, index) in item.children" :key="index"
              :item="items"
              :report="filter(items)">
          </inputGather>
      </div> -->
    </div>
    <!-- -else style="border-top: 1px solid #D8D8D8" report.value=='有' ||item.gatherKnowType == 0-->
    <div v-show="item.controlType != 'TABLE' && ( isFold )" class="gather-item scaleTop-1px"
         :class="typeSwitch(item.controlType)" >

      <!-- 输入框 -->
      <!-- <div class="cell-title" v-if="item.controlType == 'SINGLE_INPUT' ">
          <span>{{item.controlDisplayName+':'}}</span>
      </div> -->
      <!-- <onlyInput
          v-if="item.controlType == 'SINGLE_INPUT' || item.controlType == 'NUMBER_INPUT'"
          :type="typeSwitch(item.controlType)"
          :item="item"
          :report="filter(item)">
      </onlyInput> -->

      <!-- 输入框  v-else-if="item.controlType != 'SINGLE_INPUT' && item.controlType !== 'SCORE' "-->
      <onlyInput
        v-if="item.controlType == 'SINGLE_INPUT' "
        :type="typeSwitch(item.controlType)"
        :item="item"
        :report="filter(item)"
      ></onlyInput>

      <!--日期时间-->
      <display-date-time v-if="item.controlType == 'DATE_TIME'"
                         :item="item"
                         :report="filter(item)">
      </display-date-time>
      <!--日期-->
      <display-Date v-if="item.controlType == 'DATE'"
                    :item="item"
                    :report="filter(item)">
      </display-Date>
      <!-- NUMBER_INPUT + 单位 -->
      <!-- <p class="termUnit"
          v-if="item.controlType=='NUMBER_INPUT' && item.termUnit.unitName">
          {{item.termUnit.unitName}}
      </p> -->

      <!-- input + 下拉列表 -->
      <!-- <inputNumberUnit
          v-if="item.controlType=='NUMBER_INPUT' && item.termSet.termItemList && JSON.stringify(item.termSet.termItemList) != '[]'"
          :type="typeSwitch(item.controlType)"
          :item="item"
          :report="filter(item)">
      </inputNumberUnit> -->

      <!-- NUMBER_INPUT + 单位 -->
      <div class="number_input-container" v-if="item.controlType=='NUMBER_INPUT'" style="width:100%">
        <!-- <p
            class="termUnit"
            v-if="item.controlType=='NUMBER_INPUT' && item.termUnit.unitName"
        >{{item.termUnit.unitName}}</p> -->
        <display-number-input :item="handleGather(item)" :report="filter(item)"></display-number-input>
      </div>
      <!--级联控件-->
      <div style="width: 100%;" v-if="item.controlType == 'CASCADE'">
        <display-cascade :item="item" :report="item"></display-cascade>
      </div>
      <inputTextarea
        v-if="item.controlType=='MULTI_INPUT'"
        :item="item"
        :report="filter(item)">
      </inputTextarea>

      <!-- 单选按钮集合 -->
      <inputRadionList
        v-if="item.controlType=='RADIO_BUTTON'"
        :item="handleGather(item)"
        :report="filter(item)">
      </inputRadionList>

      <!-- 多选 -->
      <inputChecklist
        v-if="item.controlType=='CHECKBOX'"
        :item="handleGather(item)"
        :report="filter(item)">
      </inputChecklist>
      <!-- 多选下拉 -->
      <input-select v-if="item.controlType=='MULTI_COMBOX'|| item.controlType=='SINGLE_COMBOX'"
                    :report="filter(item)"
                    :item='handleGather(item)'>
      </input-select>
      <!--滑块控件-->
      <display-slider v-if="item.controlType == 'SLIDER'" :item="handleGather(item)" :report="filter(item)"></display-slider>
      <div
        v-for="(items, index) in item.children"
        :key="index"
        class="gather-flex scale-1px"
        :class="typeSwitch(items.controlType)"
        v-if="items.controlType != 'TABLE'">
        <!--{{items.controlType}}-->
        <!-- <div class="cell-title" v-if="items.controlType != 'GATHER'">
            <span>{{items.controlDisplayName+':'}}</span>
        </div> -->
        <!-- 输入框  v-else-if="item.controlType != 'SINGLE_INPUT' && item.controlType !== 'SCORE' "-->
        <onlyInput
          v-if="items.controlType == 'SINGLE_INPUT' "
          :type="typeSwitch(items.controlType)"
          :item="items"
          :report="filter(items)"
        ></onlyInput>

        <!--日期时间-->
        <display-date-time v-if="items.controlType == 'DATE_TIME'"
                           :item="items"
                           :report="filter(items)">
        </display-date-time>
        <!--日期-->
        <display-Date v-if="items.controlType == 'DATE'"
                      :item="items"
                      :report="filter(items)">
        </display-Date>

        <div class="number_input-container" v-if="items.controlType=='NUMBER_INPUT'" style="width:100%">
          <display-number-input :item="handleGather(items)" :report="filter(items)"></display-number-input>
        </div>
        <!--级联控件-->
        <div style="width: 100%;" v-if="items.controlType == 'CASCADE'">
          <display-cascade :item="items" :report="items"></display-cascade>
        </div>

        <inputTextarea
          v-if="items.controlType=='MULTI_INPUT'"
          :item="items"
          :report="filter(items)">
        </inputTextarea>


        <!-- 单选按钮集合 -->
        <inputRadionList
          v-if="items.controlType=='RADIO_BUTTON'"
          :item="handleGather(items)"
          :report="filter(items)">
        </inputRadionList>

        <!-- 多选 -->
        <inputChecklist
          v-if="items.controlType=='CHECKBOX' "
          :item="handleGather(items)"
          :report="filter(items)">
        </inputChecklist>
        <!-- 多选下拉 -->
        <input-select v-if="items.controlType=='MULTI_COMBOX'|| items.controlType=='SINGLE_COMBOX'"
                      :report="filter(items)"
                      :item='handleGather(items)'>
        </input-select>
        <!--滑块控件-->
        <display-slider v-if="items.controlType == 'SLIDER'" :item="handleGather(items)" :report="filter(items)"></display-slider>
        <!-- 集合 -->
        <inputGather
          v-if="items.controlType=='GATHER'"
          :item="items"
          :report="filter(items)">
        </inputGather>
      </div>
    </div>
  </div>
</template>

<script>
  import onlyInput from '../inputComponents/onlyInput'
  import inputNumberUnit from '../inputComponents/inputNumberUnit'
  import inputSelect from '../inputComponents/inputSelect'
  import inputGather from '../inputComponents/inputGather'
  import inputChecklist from '../inputComponents/inputChecklist'
  import inputRadionList from '../inputComponents/inputRadionList'
  import inputTextarea from '../inputComponents/inputTextarea';
  import displayNumberInput from './displayNumberInput';
  import displayCascade from './displayCascade';
  import displayDateTime from './displayDateTime';
  import displaySlider from './displaySlider';
  import displayDate from  './displayDate';
  export default {
    name: 'inputGather',
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
        option:[],
        isFold:false,
      }
    },
    components: {
      inputTextarea,
      onlyInput,
      inputNumberUnit,
      inputSelect,
      inputGather,
      inputChecklist,
      inputRadionList,
      displayNumberInput,
      displayCascade,
      displayDateTime,
      displaySlider,
      displayDate
    },
    created() {
      // console.log(this.item.controlName)
      if(this.item.gatherKnowType == 1) {
        this.option = ['有','无']
      }
      if(this.item.gatherKnowType == 2) {
        this.option= ['是','否','不详']
      }
      if(this.item.gatherKnowType == 3 && this.item.termSet.rangeText != "") {
        let options = this.item.termSet.rangeText.split('\n').map(item => {
          if(item.indexOf('^') != '-1') {
            return item.split('^')[0]
          }
        });
        this.option = options;
      }
      //初始化默认集合是否展开
      if((this.report.value&&(this.report.value=="有"||this.report.value=="是")) || this.item.gatherKnowType == 0){
        this.isFold = true;
      }else if(this.item.gatherKnowType == 3 && this.item.termSet.rangeText != "") {
        let options = this.item.termSet.rangeText.split('\n').map(item => {
          if(item.indexOf('^') != '-1') {
            return {label:item.split('^')[0],value:item.split('^')[1]}
          }
        });
        options.forEach(item => {
          if(item.label == this.report.value && item.value == 0) {
            this.isFold = false;

          }else if(item.label == this.report.value && item.value > 0) {
            this.isFold = true;
            return ;
          }
        })
      }
      //初始化报告数据
      this.item.children.forEach(element => {
        let arr = this.report.children.filter(
          o => o.name == element.controlDisplayName
        );
        if (arr.length == 0) {
          let newObj = {
            name: element.controlDisplayName,
            value: "",
            children: []
          };
          this.report.children.push(newObj);
        }
      });
    },
    methods: {
      clearGather() {
        this.report.value = '';
      },
      changeKnowType(data) {
        if(this.item.gatherKnowType == 1 && data == '有') {
          this.isFold = true;
        }else if(this.item.gatherKnowType == 2 && data == '是'){
          this.isFold = true;
        }else if(this.item.gatherKnowType == 3 ) {
          let options = this.item.termSet.rangeText.split('\n').map(item => {
            if(item.indexOf('^') != '-1') {
              return {label:item.split('^')[0],value:item.split('^')[1]}
            }
          });
          options.forEach(item => {
            if(item.label == data && item.value == 0) {
              this.isFold = false;
            }else if(item.label == data && item.value > 0) {
              this.isFold = true;
              return ;
            }
          })
        }else {
          this.isFold = false;
        }
      },
      filter(data) {
        let obj = this.report.children.filter(item => {
          return item.name === data.controlDisplayName;
        })
        return obj[0];
      },
      //类型转换
      typeSwitch(str) {
        let type;
        switch (str) {
          case 'DATE_TIME':
            type = 'date';
            break;
          case 'DATE':
            type = 'date';
            break;
          case 'SINGLE_INPUT':
            type = 'text';
            break;
          case 'MULTI_INPUT':
            type = 'textarea field-noInput';
            break;
          case 'SINGLE_COMBOX':
            type = 'field-select';
            break;
          case 'TABLE':
            type = 'field-hide';
            break;
          case 'GATHER':
            type = '';
            break;
          case 'RADIO_BUTTON':
            type = 'field-noInput';
            break;
          case 'NUMBER_INPUT':
            type = 'number';
            break;
          case 'CHECKBOX':
            type = 'field-checkbox field-noInput';
            break;
          default:
            type = "text";
            break;
        }
        return type;
      },
      //统一处理集合的rangeText
      handleGather(item) {
        if (item.termSet && item.termSet.rangeText) {

          item.termSet.termItemList = item.termSet.rangeText.split('\n').filter(el => {
            return el !== "";
          });
          // console.log(item.termSet.termItemList)
        }
        return item;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .gather-box {
    /*padding: 5px 0;*/
    flex-wrap: wrap;

    & > div {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
  }

  .gather {
    // flex: 1;
    .gather_GATHER {
      // min-width: 168px !important;
      > span {
        position: relative;
        top: 1px;
      }
    }
  }

  .gather-item {
    display: flex;
    flex: 1;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .gather-flex {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    min-height: 50px;

    &.textarea .cell-title {
      align-self: flex-start;
      line-height: 24px;
    }

    &:last-child::after,
    &.number::after {
      display: none;
    }

    &:not(.number):nth-child(n+2) {
     /* padding-top: 10px;*/
    }

    .number {
      width: 100%;
    }
  }

  /deep/ .mint-checkbox .mint-checkbox-input {
    display: none;
  }

  /deep/ .text {
    // flex: 1;
    input {
      outline: none !important;
      display: block !important;
      border: none !important;
    }
  }

  .textarea .textarea.field-noInput {
    display: none;
  }

  .cell-title + .field-noInput {
    display: none;
  }

  /deep/ .mint-radio-label {
    position: relative;
    top: 1.5px;
  }
</style>
