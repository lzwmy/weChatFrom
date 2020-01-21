<template>
  <div class="PGA_score_container">
    <div class="score_content">
      <div class="title">{{item.baseProperty.scoreInfo.scoreName}}评分</div>
      <div class="content-item" v-for="(item,index) in Option" :key="index">
        <label class="content_label">
              <span class="content_radio">
                <input type="radio" v-model="PGAValue" class="mint-radio-input" :value="item.value" disabled>
                <span class="mint-radio-core" style="transform: scale(0.8);"></span>
              </span>
          <span class="content_name">{{item.label}}</span>
          <br/>
          <span class="content_description">{{item.description}}</span>
        </label>
        <div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "scorePga",
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
        Option:[
          {
            label: '皮损消失（0分）',
            description:'没有皮损，或皮损极其轻微无需治疗',
            value: '0'
          },
          {
            label: '明显改善（1分）',
            description:'有非常肯定的疗效（约为75%),仍有皮损的',
            value: '1'
          },
          {
            label: '中等程度改善（2分）',
            description:'有肯定的疗效（约为50%)',
            value: '2'
          },
          {
            label: '轻度改善（3分）',
            description:'有肯定的疗效（约为25%），但是皮损的重要',
            value: '3'
          },
          {
            label: '无变化（4分）',
            description:'皮损没有变化',
            value: '4'
          },
          {
            label: '加重（5分）',
            description:'与基线相比，皮损的严重程度和范围都加重',
            value: '5'
          }
        ],
        PGAValue:'',
      }
    },
    watch:{
      'PGAValue':function (val) {
        this.$emit('callback-data',parseInt(val).toFixed(2))
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
          if(data.code === 0 && data.data) {
            console.log(JSON.parse(data.data.jsonData))
            let jsonData = JSON.parse(data.data.jsonData);
            that.PGAValue = jsonData;
          }
        } catch (error) {
          console.log(error);
        }
      },
      // 保存评分数据
      async reportScoreSaveDatas () {
        let that = this;
        let formData = {
          reportId:that.$route.query.reportId,
          jsonData:JSON.stringify(that.PGAValue),
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
        this.savePatientInfo(this.report.value2)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .PGA_score_container {
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
        margin-bottom: 15px;
        padding-bottom: 15px;
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
        .content_name{
          color: #000;
          font-size: 16px;
          padding-left: 10px;
          padding-bottom: 5px;
          display: inline-block;
        }
        .content_description{
          padding-left: 34px;
          color: #666666;
        }
      }
      .title{
        margin-bottom: 20px;
      }
    }
  }
</style>
