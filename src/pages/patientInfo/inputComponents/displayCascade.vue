<template>
  <div class="cascade_container">
    <span v-show="item.baseProperty.isRequired"
          :class="{isRequired:item.baseProperty.isRequired}"
          :data-value="report.value"
          style="color: red">*&nbsp;</span>
    <div class="cascade-title">{{item.controlDisplayName}}：</div>
    <div class="cascade_box" >
      <span @click="popupVisible = true">{{callbackShow()}}<!--{{singleValue}}{{doubleValue}}{{threeValue}}--></span>
      <mt-popup v-model="popupVisible" position="bottom" style="width: 100%;">
        <div class="action flex-center-center">
          <p @click="popupVisible = false">取 消</p>
          <p @click="clearEmpty">清空</p>
          <p @click="handleChange">确 定</p>
        </div>
        <mt-picker :class="{singleLayer:singleList.length!==0,doubleLayer:doubleList.length!==0,threeLayer:threeList.length!==0}"
                   @change="singleChange"
                   :slots="singleSlots"
                   value-key="value"></mt-picker>
        <mt-picker :class="{singleLayer:singleList.length!==0,doubleLayer:doubleList.length!==0,threeLayer:threeList.length!==0}"
                   v-if="doubleList.length!==0"
                   @change="doubleChange"
                   :slots="doubleSlots"
                   value-key="value"></mt-picker>
        <mt-picker :class="{singleLayer:singleList.length!==0,doubleLayer:doubleList.length!==0,threeLayer:threeList.length!==0}"
                   v-if="threeList.length!==0"
                   @change="threeChange"
                   :slots="threeSlots"
                   value-key="value"></mt-picker>
      </mt-popup>
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
      return {
        popupVisible: false,
        singleValue:"",
        doubleValue:"",
        threeValue:"",
        level:0,
        singleList: [],
        doubleList: [],
        threeList: [],
        singleSlots: [
          {
            flex: 1,
            values: JSON.parse(this.item.termSet.rangeText || '[]') || [],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        doubleSlots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        threeSlots:[
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
        ]
      }
    },
    methods: {
      singleChange(picker, values) {
        console.log(picker, values);
        if(values[0]!=='undefined'&& values[0] !==undefined){
          this.singleValue = values[0].value;
          let data = values[0];
          if(data.hasOwnProperty('children')) {
            console.log(data.children);
            if(data.children.length == 0) {
              data.children.push({
                "id":"1",
                "value":" ",
                "children":[]
              });
            }
            this.doubleList = data.children;
            this.doubleSlots[0].values = data.children;
            //清空其它的值
            this.threeSlots[0].values = [];
            this.threeList = [];
            // this.doubleValue = "";
            this.threeValue = "";
          }else{
            // data.children = [];
            this.doubleList = [];
            //清空其它的值
            this.threeSlots[0].values = [];
            this.threeList = [];
          }
        }

      },
      doubleChange(picker, values) {
        // console.log(picker, values);
        this.doubleValue = values[0].value;
        // console.log('触发');
        if(values[0] !== undefined && values[0] !== 'undefined') {
          if(values[0].children.length == 0 && this.level > 2) {
            values[0].children.push({
              "id":"1",
              "value":" ",
              "children":[]
            });
          }
          this.threeSlots[0].values = values[0].children;
          this.threeList = values[0].children;
          this.threeValue = "";
        }else {
          // data[0].children = [];
          this.threeList = [];
        }
      },
      threeChange(picker, values) {
        // console.log(picker, values);
        this.threeValue = values[0].value
      },
      handleChange() {
        this.popupVisible = false;
        let array =[this.singleValue,this.doubleValue,this.threeValue];
         let result = array.filter(item => {
            return item !== "" && item !== " ";
          }).join("|");
        // this.report.value = JSON.stringify(result);
        this.report.value = result;
      },
      clearEmpty() {
        this.popupVisible = false;
        this.report.value = "";
      },
      callbackShow() {
        let result = "";
        if(this.report.value == "") {
          result = ""
        }else if(this.report.value !== "") {
          if(this.report.value.indexOf('|') != '-1') {
            result = this.report.value.split('|').join(" ");
          }else if(this.report.value.indexOf("[") != '-1') {
            result = JSON.parse(this.report.value).join("");
          }else {
            result = this.report.value;
          }

        }
        return result || '请选择';
      },
      //判断层级
      JudgmentLevel (data,level) {
        if(data.length == 0) {
          return ;
        }
        this.level = Math.max(this.level,level);
        for(let i=0;i<data.length;i++) {
          if(data[i].children.length !== 0) {
            this.JudgmentLevel(data[i].children,level+1)
          }
        }
      }
    },
    mounted() {
      // console.log(JSON.parse(this.item.termSet.rangeText));
      let data = JSON.parse(this.item.termSet.rangeText || '[]');
      if(data!=="") {
        this.singleList = data;
        this.JudgmentLevel(data,1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cascade_container{
    display: flex;
    align-items: center;
    min-height: 40px;
    .cascade-title{
      font-size: 14px;
      min-width: 22%;
    }
    .cascade_box{
      flex: 1;
      >span{
        font-size: 14px;
        color: #666666;
        width: 100%;
        min-height: 40px;
        display: inline-block;
        line-height: 40px;
      }
    }
  }
  .mint-popup {
    width: 100%;
    .action {
      border-bottom: 1px solid #eaeaea;
      p {
        width: 50%;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        color: #26a2ff;
      }
    }
  }
  .singleLayer{
    width: 100%;
    float: left;
  }
  .doubleLayer{
    width: 50%;
    float: left;
  }
  .threeLayer{
    width: 33.33%;
    float: left;
  }
</style>
