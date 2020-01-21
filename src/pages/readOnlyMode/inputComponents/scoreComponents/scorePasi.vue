<template>
  <div class="PASI_Score-container">
    <!-- <div class="score_title">头/颈</div> -->
    <div class="score_content">
      <div class="content-item">
        <div class="item_name c_blue">头颈</div>
        <div class="item_radio_box">
          <mt-radio v-model="head.area" :options="areaOptions"></mt-radio>
        </div>
      </div>
      <div class="content-item">
        <div class="item_name">脱屑</div>
        <div class="item_radio_box">
          <mt-radio v-model="head.desquamation" :options="desquamationOptions"></mt-radio>
        </div>
      </div>
      <div class="content-item">
        <div class="item_name">红斑</div>
        <div class="item_radio_box">
          <mt-radio v-model="head.erythema" :options="desquamationOptions"></mt-radio>
        </div>
      </div>
      <div class="content-item">
        <div class="item_name">浸润</div>
        <div class="item_radio_box">
          <mt-radio v-model="head.infiltration" :options="desquamationOptions"></mt-radio>
        </div>
      </div>
    </div>
    <!-- <div class="score_title">躯干</div> -->
    <div class="score_content">
      <div class="content-item">
        <div class="item_name c_blue">躯干</div>
        <div class="item_radio_box">
          <mt-radio v-model="torso.area" :options="areaOptions"></mt-radio>
        </div>
      </div>
      <div class="content-item">
        <div class="item_name">脱屑</div>
        <div class="item_radio_box">
          <mt-radio v-model="torso.desquamation" :options="desquamationOptions"></mt-radio>
        </div>
      </div>
      <div class="content-item">
        <div class="item_name">红斑</div>
        <div class="item_radio_box">
          <mt-radio v-model="torso.erythema" :options="desquamationOptions"></mt-radio>
        </div>
      </div>
      <div class="content-item">
        <div class="item_name">浸润</div>
        <div class="item_radio_box">
          <mt-radio v-model="torso.infiltration" :options="desquamationOptions"></mt-radio>
        </div>
      </div>
    </div>
    <!-- <div class="score_title">上肢</div> -->
    <div class="score_content">
      <div class="content-item">
        <div class="item_name c_blue">上肢</div>
        <div class="item_radio_box">
          <mt-radio v-model="upperLimb.area" :options="areaOptions"></mt-radio>
        </div>
      </div>
      <div class="content-item">
        <div class="item_name">脱屑</div>
        <div class="item_radio_box">
          <mt-radio v-model="upperLimb.desquamation" :options="desquamationOptions"></mt-radio>
        </div>
      </div>
      <div class="content-item">
        <div class="item_name">红斑</div>
        <div class="item_radio_box">
          <mt-radio v-model="upperLimb.erythema" :options="desquamationOptions"></mt-radio>
        </div>
      </div>
      <div class="content-item">
        <div class="item_name">浸润</div>
        <div class="item_radio_box">
          <mt-radio v-model="upperLimb.infiltration" :options="desquamationOptions"></mt-radio>
        </div>
      </div>
    </div>
    <!-- <div class="score_title">下肢</div> -->
    <div class="score_content">
      <div class="content-item">
        <div class="item_name c_blue">下肢</div>
        <div class="item_radio_box">
          <mt-radio v-model="lowerLimb.area" :options="areaOptions"></mt-radio>
        </div>
      </div>
      <div class="content-item">
        <div class="item_name">脱屑</div>
        <div class="item_radio_box">
          <mt-radio v-model="lowerLimb.desquamation" :options="desquamationOptions"></mt-radio>
        </div>
      </div>
      <div class="content-item">
        <div class="item_name">红斑</div>
        <div class="item_radio_box">
          <mt-radio v-model="lowerLimb.erythema" :options="desquamationOptions"></mt-radio>
        </div>
      </div>
      <div class="content-item">
        <div class="item_name">浸润</div>
        <div class="item_radio_box">
          <mt-radio v-model="lowerLimb.infiltration" :options="desquamationOptions"></mt-radio>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Radio} from "mint-ui";

  export default {
    name: "scorePasi",
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
    computed: {
      headPASI:{
        get:function () {
          let total = (parseInt(this.head.erythema)+parseInt(this.head.infiltration)+parseInt(this.head.desquamation))*100;
          let sum = ((0.1* total) * this.head.area)/100;
          return sum
        },
        set:function(newValue) {
          return newValue;
        }
      },
      upperLimbPASI:{
        get:function () {
          let total = (parseInt(this.upperLimb.erythema)+parseInt(this.upperLimb.infiltration)+parseInt(this.upperLimb.desquamation))*100;
          let sum = ((0.2* total) * this.upperLimb.area)/100;
          return sum
        },
        set:function(newValue){
          return newValue;
        }
      },
      torsoPASI:{
        get:function () {
          let total = (parseInt(this.torso.erythema)+parseInt(this.torso.infiltration)+parseInt(this.torso.desquamation))*100;
          let sum = ((0.3* total) * this.torso.area)/100;
          return sum
        },
        set:function(newValue) {
          return newValue
        }
      },
      lowerLimbPASI:{
        get:function() {
          let total = (parseInt(this.lowerLimb.erythema)+parseInt(this.lowerLimb.infiltration)+parseInt(this.lowerLimb.desquamation))*100;
          let sum = ((0.4* total) * this.lowerLimb.area)/100;
          return sum
        },
        set:function (newValue) {
          return newValue;
        }
      },
      total:{
        get:function () {
          let sum = (this.headPASI+this.upperLimbPASI+this.torsoPASI+this.lowerLimbPASI);
          let PASI = sum.toFixed(2);
          return PASI
        },
        set:function (newValue) {
          return newValue
        }
      }
    },
    watch:{
      'total':function (val) {
        this.$emit('callback-data',val)
      }
    },
    data() {
      return {
        head:{
          area:'0',// 受损面积
          desquamation:'0',//脱屑
          erythema:'0',//红斑
          infiltration:'0',//浸润
        },
        torso:{
          area:'0',// 受损面积
          desquamation:'0',//脱屑
          erythema:'0',//红斑
          infiltration:'0',//浸润
        },
        upperLimb:{
          area:'0',// 受损面积
          desquamation:'0',//脱屑
          erythema:'0',//红斑
          infiltration:'0',//浸润
        },
        lowerLimb:{
          area:'0',// 受损面积
          desquamation:'0',//脱屑
          erythema:'0',//红斑
          infiltration:'0',//浸润
        },
        areaOptions: [
          {
            label: "无皮疹",
            value: "0",
            disabled: true
          },
          {
            label: "1-9%",
            value: "1",
            disabled: true
          },
          {
            label: "10-29%",
            value: "2",
            disabled: true
          },
          {
            label: "30-49%",
            value: "3",
            disabled: true
          },
          {
            label: "50-69%",
            value: "4",
            disabled: true
          },
          {
            label: "70-89%",
            value: "5",
            disabled: true
          },
          {
            label: "90-100%",
            value: "6",
            disabled: true
          }
        ],
        desquamationOptions:[
          {
            label:"无",
            value:'0',
            disabled: true
          },
          {
            label:"轻",
            value:"1",
            disabled: true
          },
          {
            label:"中",
            value:"2",
            disabled: true
          },
          {
            label:"重",
            value:"3",
            disabled: true
          },

          {
            label:"极重",
            value:"4",
            disabled: true
          }
        ]
      }
    },
    methods:{
      // 获取 评分 数据
      async savePatientInfo(value) {
        let that = this;
        let formData = {
          scoreId:value
        };
        try {
          let data = await that.$http.patientInfo.getScoreData(formData);
          if(data.code === 0) {
            console.log(JSON.parse(data.data.jsonData))
            let jsonData = JSON.parse(data.data.jsonData);
            that.head.area = String(jsonData.head.area);
            that.head.desquamation = String(jsonData.head.desquamation);
            that.head.erythema = String(jsonData.head.erythema);
            that.head.infiltration = String(jsonData.head.infiltration);

            that.torso.area = String(jsonData.torso.area);
            that.torso.desquamation = String(jsonData.torso.desquamation);
            that.torso.erythema = String(jsonData.torso.erythema);
            that.torso.infiltration = String(jsonData.torso.infiltration);

            that.upperLimb.area = String(jsonData.upperLimb.area);
            that.upperLimb.desquamation = String(jsonData.upperLimb.desquamation);
            that.upperLimb.erythema = String(jsonData.upperLimb.erythema);
            that.upperLimb.infiltration = String(jsonData.upperLimb.infiltration);

            that.lowerLimb.area = String(jsonData.lowerLimb.area);
            that.lowerLimb.desquamation = String(jsonData.lowerLimb.desquamation);
            that.lowerLimb.erythema = String(jsonData.lowerLimb.erythema);
            that.lowerLimb.infiltration = String(jsonData.lowerLimb.infiltration);
          }
        } catch (error) {
          console.log(error);
        }
      },
      // 保存评分数据
      async reportScoreSaveDatas () {
        let that = this;
        let jsonData = {
          head:that.head,
          torso:that.torso,
          upperLimb:that.upperLimb,
          lowerLimb:that.lowerLimb
        };
        console.log(that.$route.query.reportId);
        let formData = {
          reportId:that.$route.query.reportId,
          jsonData:JSON.stringify(jsonData),
          scoreName:that.item.baseProperty.scoreInfo.scoreName,
          score:that.total,
          userId:that.$store.state.userInfo.userId
        };
        try{
          let data = await that.$http.patientInfo.reportScoreSaveData(formData);
          if(data.code === 0) {
            that.report.value2 = data.data;
          }
        }catch (error) {
          console.log(error);
        }
      }
    },
    mounted() {
      if(this.report.value2) {
        this.savePatientInfo(this.report.value2).then(()=>{
          this.$emit('callback-data',this.report.value);
        })
      }
      let height = document.body.clientHeight -95;
      let contentHeight = document.getElementsByClassName('PASI_Score-container')[0];
      contentHeight.style.height = height+'px';
    }
  }
</script>

<style lang="scss" scoped>
  .PASI_Score-container {
    padding: 15px 0 0 15px;
    overflow: auto;
    // margin-bottom: 50px;
    .score_title {
      font-size: 16px;
      font-weight: bold;
    }
    .score_content {
      display: flex;
      flex-direction: column;
      .content-item {
        display: flex;
        flex-direction: row;
        //   align-items: center;
        border-bottom: 1px solid #EBEBEB;
        margin-bottom: 5px;
        padding-bottom: 5px;
        .item_name{
          width: 8%;
          font-size: 14px;
          white-space: nowrap;
          margin-top: 8px;
        }
        .c_blue{
          color: #26A2FF;
          margin-top: 8px;
        }
        .item_radio_box{
          /deep/ .mint-radiolist{
            min-width:280px;
            .mint-radiolist-title{
              display: none;
            }
            .mint-cell{
              display: inline-block;
              min-height:auto;
              .mint-cell-wrapper{
                padding-top: 4px;
                padding-bottom: 4px;
                .mint-cell-title{
                  display: inline-block;
                  width: 100%;
                  .mint-radiolist-label{
                    .mint-radio-core {
                      transform: scale(0.8)
                    }
                  }
                }
              }
            }
          }
        }
        .item_single-input{
          width: 100%;
          /deep/ .mint-cell{
            .mint-cell-wrapper{
              .mint-cell-title{
                display: inline-block;

              }
              .mint-cell-value{
                .mint-field-core{
                  display: inline-block;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
