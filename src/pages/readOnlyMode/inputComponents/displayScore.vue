<template>
  <div :class="['score_container',item.controlType]">
    <span v-show="item.displayIsVisible">{{item.controlDisplayName}}： </span>
    <div :class="item.controlType+'_box'">
<!--      style="color:rgb(35, 149, 247);width:20px;display:inline-block;margin-right:10px;"-->
      <span :class="[{'addColor':report.value}]">
        {{report.value || '0.00'}}
          <!--<input type="text" v-model="report.value" style="width: 48px;height: 22px;border: 1px solid rgba(102, 102, 102,0.5);padding-left: 5px;border-radius: 2px">-->
      </span>
        <mt-button v-if="report.value != '0.00' && report.value != ''" class="score_button" type="primary" plain @click.native="jumpScorePage">查看</mt-button>
    </div>
    <mt-popup
      class="score_mask"
      v-model="item.baseProperty.scoreInfo.scoreStatus"
      closeOnClickModal
      position="right"
    >
      <div class="header-fixed" v-show="item.baseProperty.scoreInfo.scoreStatus">
        <span class="break mintui mintui-back" @click="closepage"></span>
      </div>
      <!--<div v-if="item.baseProperty.scoreInfo.scoreName == 'PASI'&&item.baseProperty.scoreInfo.scoreStatus" class="PASI_Score-container" >
        &lt;!&ndash; <div class="score_title">头/颈</div> &ndash;&gt;
        <div class="score_content" >
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
        &lt;!&ndash; <div class="score_title">躯干</div> &ndash;&gt;
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
        &lt;!&ndash; <div class="score_title">上肢</div> &ndash;&gt;
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
        &lt;!&ndash; <div class="score_title">下肢</div> &ndash;&gt;
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
        &lt;!&ndash; <div class="score_title">各部位PASI得分计算</div>
        <div class="score_content">
            <div class="content-item">
                <div class="item_single-input">
                    <mt-field label="PASI（头部）=" placeholder="自动计算" v-model="headPASI" readonly></mt-field>
                    <mt-field label="PASI（上肢）=" placeholder="自动计算" v-model="upperLimbPASI" readonly></mt-field>
                    <mt-field label="PASI（躯干）=" placeholder="自动计算" v-model="torsoPASI" readonly></mt-field>
                    <mt-field label="PASI（下肢）=" placeholder="自动计算" v-model="lowerLimbPASI" readonly></mt-field>
                    <mt-field label="PASI（总分）=" placeholder="自动计算" v-model="total" readonly></mt-field>
                </div>
            </div>
        </div> &ndash;&gt;
      </div>-->
      <score-pasi ref="pasi"
                  v-if="item.baseProperty.scoreInfo.scoreName == 'PASI'&&item.baseProperty.scoreInfo.scoreStatus"
                  :item="item" :report="report" @callback-data="callbackData"></score-pasi>
      <score-pga ref="pasi"
                 v-if="item.baseProperty.scoreInfo.scoreName == 'PGA'&&item.baseProperty.scoreInfo.scoreStatus"
                 :item="item" :report="report" @callback-data="callbackData"></score-pga>
      <div class="footer-fixed" v-show="item.baseProperty.scoreInfo.scoreStatus">
        <div class="total">
          {{item.baseProperty.scoreInfo.scoreName}}(总分)：
          <span style="color:rgb(35, 149, 247);font-size:18px;" v-if="item.baseProperty.scoreInfo.scoreName == 'PASI'">
              {{total}}
              <!--<input type="text" v-model="total" style="width: 100px;">-->
            </span>
          <span style="color:rgb(35, 149, 247);font-size:18px;" v-else>{{total}}</span>
        </div>
        <div class="fixed-btn" @click="closeBreak">确定</div>
      </div>
    </mt-popup>
    <!-- {{item.baseProperty.scoreInfo.scoreStatus}} -->


  </div>
</template>

<script>
  import {Radio} from "mint-ui";
  import scorePasi from './scoreComponents/scorePasi';
  import scorePga from './scoreComponents/scorePga';

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
    components: {
      scorePasi,
      scorePga
    },
    data() {
      return {
        PhoneHeight: 0,
        areaOptions: [
          {
            label: "无皮疹",
            value: "0"
          },
          {
            label: "1-9%",
            value: "1"
          },
          {
            label: "10-29%",
            value: "2"
          },
          {
            label: "30-49%",
            value: "3"
          },
          {
            label: "50-69%",
            value: "4"
          },
          {
            label: "70-89%",
            value: "5"
          },
          {
            label: "90-100%",
            value: "6"
          }
        ],
        desquamationOptions: [
          {
            label: "无",
            value: '0'
          },
          {
            label: "轻",
            value: "1"
          },
          {
            label: "中",
            value: "2"
          },
          {
            label: "重",
            value: "3"
          },

          {
            label: "极重",
            value: "4"
          }
        ],
        total: this.report.value || '0.00'
      };
    },
    methods: {
      jumpScorePage() {
        this.item.baseProperty.scoreInfo.scoreStatus = true;
      },
      closeBreak() {
        // this.report.value = this.total;
        this.item.baseProperty.scoreInfo.scoreStatus = false;
        // this.$refs.pasi.reportScoreSaveDatas();
      },
      closepage() {
        this.item.baseProperty.scoreInfo.scoreStatus = false;
      },
      callbackData(data) {
        this.total = data;
      },
      /*// 获取 评分 数据
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
      },*/
      // 保存评分数据
      /*async reportScoreSaveDatas () {
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
      }*/
    },
    mounted() {
      /*if(this.report.value2) {
        this.savePatientInfo(this.report.value2)
      }*/

    }
  };
</script>

<style lang="scss" scoped>

  .score_container {
    .score_button {
      height: auto;
      margin-left: 10px;
      /*margin-left: 5px;*/
      /deep/ .mint-button-text {
        font-size: 14px;
      }
    }

    .score_mask {
      width: 100%;
      height: 100%;
      overflow: auto;
      // margin-top: 44px;
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

            .item_name {
              width: 8%;
              font-size: 14px;
              white-space: nowrap;
              margin-top: 8px;
            }

            .c_blue {
              color: #26A2FF;
              margin-top: 8px;
            }

            .item_radio_box {
              /deep/ .mint-radiolist {
                min-width: 280px;

                .mint-radiolist-title {
                  display: none;
                }

                .mint-cell {
                  display: inline-block;
                  min-height: auto;

                  .mint-cell-wrapper {
                    padding-top: 4px;
                    padding-bottom: 4px;

                    .mint-cell-title {
                      display: inline-block;
                      width: 100%;

                      .mint-radiolist-label {
                        .mint-radio-core {
                          transform: scale(0.8)
                        }
                      }
                    }
                  }
                }
              }
            }

            .item_single-input {
              width: 100%;

              /deep/ .mint-cell {
                .mint-cell-wrapper {
                  .mint-cell-title {
                    display: inline-block;

                  }

                  .mint-cell-value {
                    .mint-field-core {
                      display: inline-block;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .footer-fixed {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      background-color: #fff;
      z-index: 3000;
      border-top: 1px solid #ebebeb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0 0 15px;

      .total {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .fixed-btn {
        background-color: #26A2FF;
        color: #fff;
        width: 30%;
        height: 100%;
        line-height: 50px;
        text-align: center;
      }
    }

    .header-fixed {
      // position: absolute;;
      // top: 0;
      // left: 0;
      width: 100%;
      height: 45px;
      background-color: #26A2FF;
      z-index: 9999;
      -webkit-overflow-scrolling: touch;

      .break {
        line-height: 45px;
        margin-left: 14px;
        font-size: 16px;
        padding: 5px;
        color: #fff;
      }

      /deep/ .mint-header {
        display: none;
      }
    }
  }

</style>
