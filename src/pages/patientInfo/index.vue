<template>
  <div class="view-patientInfo">
    <mt-header title="基本信息">
      <mt-button slot="left" icon="back" @click="back"></mt-button>
      <i slot="left" class="icon iconfont icon-sousuo"></i>
      <mt-button v-if="$route.query.saveType == 'followUp' &&  [3,4].indexOf($store.state.curRecord.status) == -1"
                 slot="right" @click="savefollowUpPatientInfo">提 交
      </mt-button>
      <mt-button v-if="$route.query.saveType != 'followUp' && (status == 0 || status == 1)" slot="right" @click="reportDataSaveList">保存</mt-button>
    </mt-header>
<!--    {{reportData}}-->
    <patientInfo v-if="perviewData.length != 0 && reportData.length != 0 && (status == 0 || status == 1)" :perview="perviewData" :report="reportData"></patientInfo>
    <read-only-mode class="read_only_mode" v-if="perviewData.length != 0 && reportData.length != 0 && status > 1" :perview="perviewData" :report="reportData"></read-only-mode>
  </div>
</template>

<script>
  import {Header, Field, Radio, Checklist, Popu, Button, Indicator, Toast} from 'mint-ui';
  import patientInfo from './patientInfo';
  import readOnlyMode from './../readOnlyMode/patientInfo';
  import {verficationForm} from './js/verificationForm';

  export default {
    name: 'portionsDetail',
    data() {
      return {
        perviewData: [],
        reportData: {},
        status: "",// 0 未填写 默认
      }
    },
    components: {
      patientInfo,
      readOnlyMode
    },
    created() {
      // this.perviewData = [perviewData2.data];
      // let reportData = {
      //     pages: [reportData2.data]
      // }
      // this.reportData = reportData;

      Indicator.open('加载中...');
      this.findReport()
        .then(() => {
          this.getPreview()
            .then(() => {
              Indicator.close();
            })
        });
      if (this.$route.query.remind) {
        window.addEventListener("popstate", this.closeWindow, false);
      }
      if (this.$route.query.saveType == 'followUp' && [3, 4].indexOf(this.$store.state.curRecord.status) != -1) {
        Toast({message: '当前记录只能查看,无法提交!', duration: 2500});
      }
    },
    beforeDestroy() {
      Indicator.close();
      window.removeEventListener('popstate', this.closeWindow);
    },
    methods: {
      closeWindow() {
        WeixinJSBridge.call('closeWindow');
      },
      //编辑详情回显
      async getPreview() {
        let formData = {
          formCrfId: this.$route.query.formCrfId
          // formCrfId: 826
        }
        try {
          let res = await this.$http.patientInfo.getPreview(formData, this.$store.state.userInfo.openId);
          if (res.code == 0) {
            // this.perviewData = res.data.formPages;
            this.perviewData = [res.data];
          } else {
            Toast({message: res.msg});
          }
        } catch (err) {
          console.log(err)
        }
      },
      //报告
      async findReport() {
        let formData = {
          reportId: this.$route.query.reportId
          // reportId:"2c9a80826df1d0a7016df2295126010c"
        }
        try {
          let res = await this.$http.patientInfo.findReport(formData, this.$store.state.userInfo.openId);
          if (res.code == '0') {
            // this.reportData = res.data;
            let reportData = {
              pages: [res.data]
            }
            this.reportData = reportData;
            this.status = res.data.status || 0 ;
          } else {
            Toast({message: err.msg});
          }
        } catch (err) {
          console.log(err)
        }
      },

      back() {
        if (this.$route.query.from) {
          this.$router.push(this.$route.query.from)
          return;
        }
        this.$router.back(-1);
      },
      //随访进来表单保存
      async savefollowUpPatientInfo() {
        let flag = verficationForm();
        if (flag.state) {
          Toast({
            message: '请完成 ：' + flag.name + ' 下带*号的填写',
            position: 'top',
          });
          return;
        }
        Indicator.open('正在保存中...');
        let that = this;
        let curRecord = that.$store.state.curRecord;
        let formData = Object.assign(that.$store.state.patienDetailInfo.reportData.pages[0], {
          "id": curRecord.id,
          "groupId": curRecord.groupId,
          "reportName": curRecord.reportName,
          "crfId": curRecord.crfId,
          "patientId": curRecord.patientId,
          "diseaseId": curRecord.diseaseId,
          "diseaseName": curRecord.diseaseName,
          "subjectId": curRecord.subjectId,
          "subjectName": curRecord.subjectName,
          "groupName": curRecord.groupName,
          "patientName": curRecord.patientName,
          "genderName": curRecord.genderName,
          "age": curRecord.age,
          "phoneNumber": curRecord.phoneNumber,
          "sourceType": that.$store.state.loginInfo.type == 'wx' ? 'mp' : that.$store.state.loginInfo.type,
          "creatorName": that.$store.state.patientInfo.patientname,
          "creatorId": that.$store.state.patientInfo.patientid
        })
        if (that.$store.state.loginInfo.type == 'sms' || that.$store.state.loginInfo.type == 'mp') {
          formData.crfId = that.$store.state.loginInfo.formCrfId
          formData.id = that.$store.state.loginInfo.reportId
        }
        console.log(formData);
        try {
          let data = await that.$http.followUp.savefollowUpPatientInfo(formData);
          if (data.code === 0) {
            Toast({
              message: '保存成功',
            });
            if (this.$route.query.from == '/index' || this.$route.query.from == '/followUp') {
              window.history.go(-1);
            }
          } else {
            Toast({
              message: data.msg,
            });
          }

          Indicator.close();
        } catch (error) {
          console.log(error);
        }
      },
      // 患者报告保存 信息
      async reportDataSaveList() {
        let flag = verficationForm();
        if (flag.state) {
          Toast({
            message: '请完成 ：' + flag.name + ' 下带*号的填写',
            position: 'top',
          });
          return;
        }
        Indicator.open('正在保存中...');
        let that = this;
        let formData = {
          userId: that.$store.state.userInfo.userId,
          userName: that.$store.state.userInfo.userName,
          reportDto: that.$store.state.patienDetailInfo.reportData.pages[0]
        };
        try {
          let data = await that.$http.patientInfo.reportDataSaveList(formData);
          if (data.code === 0) {
            Toast({
              message: '保存成功',
            });
            window.history.go(-1);
            Indicator.close();
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
  }
</script>


<style lang="scss">
  $inputColor: #666666;
  $labelColor: #666666;
  $placeholderColor: #999999;
  $fontSize: 15px;
  .view-patientInfo {
    // font-size: 14px;
    // padding: 8px 8px 20px;
    // background: #EFEFEF;
    background-color: #F8F8FA;
    height: 100%;
    overflow-y: auto;

    p, span {
      font-size: 14px;
      color: #333;
      // white-space: nowrap;
    }

    .mint-field-other .text span {
      max-width: 70%;
      min-width: 22%;
    }

    textarea {
      color: #666;
      font-size: 13px;
    }

    .mint-field-other {
      width: 100%;
      /* & > div {
           display: flex;
           justify-content: flex-start;
           align-items: center;
           .cell-title {
               min-width: 80px;
               // max-width: 180px;
               font-size: 14px;
               margin-right: 1px;
               color: $labelColor;
           }
       }*/
    }

    input::-webkit-input-placeholder,
    textarea::-webkit-input-placeholder {
      color: $placeholderColor;
      font-size: 14px;
    }

    .table-view {
      .table-view-cell {
        position: relative;
        margin-bottom: 8px;
        line-height: 50px;
        height: auto;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        background: #fff;

        &.open {
          .navigate-right {
            // box-shadow: 1px 1px 2px #cacaca;
            border-bottom: 1px solid #f0f0f0;

            i {
              transform: rotateZ(0deg);
            }
          }

          & > .collapse-content {
            display: block;
          }
        }

        .navigate-right {
          width: 100%;
          font-size: 15px;
          color: $labelColor;
          padding: 0 10px;
          background: #fff;
          border-radius: 2px;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .icon {
            margin-right: 6px;
          }

          i {
            transition: all 300ms;
            color: $labelColor;
            display: block;
            line-height: 16px;
            transform: rotateZ(180deg);
          }
        }

        .mint-field-core {
          display: none;
        }
      }
    }

    .collapse-content {
      flex: 1;
      position: relative;
      padding: 0 10px;
      display: none;

      & .formItems:first-child .mint-cell.mint-field:first-child:before {
        display: none;
      }

      .formItems {
        & .mint-cell.mint-field {
          min-height: 54px;

          &::before {
            content: '';
            display: block;
            width: 100%;
            height: 1px;
            position: absolute;
            top: 0;
            left: 0;
            background: #ccc;
            z-index: 2;
            transform: scale(1, 0.5);
          }
        }

        .mint-cell-wrapper {
          width: 100%;
          padding: 5px 2px;
          overflow: visible;
          background-position: 50% 50%;
          /*display: flex;*/
          display: inherit;
          /* .mint-field-other {
               display: flex;
               flex: 1;
               justify-content: flex-start;
               align-items: center;
               & > div {
                   width: 100%;
               }
               input {
                   // padding: 6px 0;
                   flex: 1;
                   vertical-align: middle;
                   border: none;
                   outline: none;
                   font-size: $fontSize;
                   width: 100%;
                   color: $inputColor;
                   // color: #333;
                   background: #fff;
                   padding-left: 2px;
                   min-height: 40px;
                   // text-align: right;
                   // direction: rtl;
               }
               select {
                   font-size: 14px;
                   width: 100%;
                   flex: 1;
                   border: none;
                   background: #fff;
                   color: $inputColor;
                   outline: none;
                   // appearance:none;
                   min-height: 40px;
                   // direction:rtl;
                   font-size: $fontSize;
               }
               .radioBtn {
                   position: relative;
                   display: inline-block;
                   width: 70px;
                   &.active {
                       i {
                           color: red;
                       }
                   }
                   i {
                       position: absolute;
                       left: 0px;
                       top: 0;
                       font-size: 18px;
                   }
                   input {
                       position: absolute;
                       top:0;
                       left: 0px;
                       z-index: 2;
                       opacity: 0.5;
                   }
                   span {
                       display: block;
                       width: 100%;
                       text-indent: 20px;
                   }

               }
               .date {
                   input {
                       width: 100%;
                       min-height: 40px;
                   }
               }
           }*/
        }
      }

      .field-checkbox {
        & > .cell-title {
          align-self: flex-start;
          padding: 6px 0;
          line-height: 24px;
        }

        .mint-checklist {
          padding: 6px 0 6px 0;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;

          & > .mint-checklist-title {
            display: none;
          }

          .mint-cell {
            min-height: 24px;

            .mint-cell-title {
              display: inline-block;
              width: auto;
              min-width: 80px;
            }

            .mint-checkbox-core {
              border-radius: 1px;
              width: 15px;
              height: 15px;

              &::after {
                width: 5px;
                height: 9px;
                left: 4px;
                top: 0px;
                border-width: 1px;
              }
            }

            .mint-cell-wrapper {
              padding: 6px 0 0 0;
            }

            .mint-checklist-label {
              /*padding: 0;*/
              padding-left: 0;
              display: flex;
              align-items: center;
            }
          }
        }
      }

      /*.field-radion {
          & > .cell-title {
              align-self: flex-start;
              padding: 12px 0;
              line-height: 24px;
          }
      }*/
      /*.number {
        display: flex;
          justify-content: space-around;
          align-items: center;
          // flex: 1;
          input {
              // flex: 1;
          }
          select {
              min-width: 80px;
              width: auto !important;
          }
      }
      .date {
          .date {
              width: 100%;
          }
      }
      .field-select {
          width: 100%;
          input {
              display: none;
          }
      }
      .field-noInput {
          input,
          &>div>label {
              display: none;
          }
          .gather {
              width: 100%;
              & > div {
                  width: 100%;
                  display: flex;
                  flex-wrap: wrap;
                  align-items: center;
              }
              & > .mint-radiolist {
                  width: auto;
                  // width: 75%;
                  margin-bottom: 5px;
              }
          }
      }
      .gather {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          // flex-wrap: wrap;
          & > input {
              display: none !important;
          }
          .mint-radiolist-title {
              display: none;
          }
          input:not(.mint-radio-input) {
              display: block;
              border: 1px solid #409EFF;
              border-radius: 2px;
              line-height: 24px;
              padding: 0 5px;
              width: 100%;
          }
          .mint-radiolist {
              padding: 6.5px 0;
              display: flex;
              justify-content: flex-start;
              flex-wrap: wrap;
          }
          .mint-cell-title {
              width: 100%;
              display: inline-block;
              // min-width: 80px;
          }
          .mint-cell {
              min-height: 24px;
              width: auto;
              .mint-cell-wrapper {
                  padding: 0 5px 0 0;
                  .mint-radiolist-label {
                      padding: 0;
                  }
              }
          }
          .mint-button {
              background: transparent;
              border:none;
              height: 24px;
              font-size: 14px;
              padding: 0;
              &::after {
                  display: none;
              }
          }
          .mint-radiolist-label {
              display: flex;
              align-items: center;
          }
          /deep/ .mint-radio-core {
              transform: scale(0.8)
          }
      }
      .termUnit {
          color:$inputColor;
      }
      textarea {
          width: 100%;
          background: #F8F8F8;
          padding: 5px;
          border: none;
          &::-webkit-input-placeholder {
              color: $inputColor;
              font-size: 13px;
          }
      }*/
    }

    /*.mint-cell:last-child,
    .mint-cell-wrapper {
        background: none !important;
    }*/
  }

  .mint-header {
    height: 45px;
    background: #2395f7;
    color: #fff;
    width: 100%;

    .mint-button-icon {
      color: #fff;
    }

    i {
      font-size: .4rem;
    }

    /deep/ h1 {
      font-size: 16px;
    }
  }
</style>
<style lang="scss" scoped>
  .mint-radio-core {
    transform: scale(0.8)
  }

  // .mint-checkbox-core {
  //     border-radius: 1px;
  //     width: 12px !important;
  //     height: 12px !important;
  //     &::after {
  //         width: 3px;
  //         height: 7px !important;
  //         left: 2px !important;
  //         top: 0px;
  //         border-width:1px;
  //         transform: rotate(45deg) scale(0.3);
  //     }
  // }
</style>
