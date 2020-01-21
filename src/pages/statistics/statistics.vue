<template>
  <div class="statistics">
    <div class="header-statistics">
      <div class="medical-institutions">医疗机构</div>
      <div class="modical-inputCheckBox" @click="modicalChange">
        <div class="title">{{orgName || "暂无机构"}}</div>
        <i class="sign"></i>
      </div>
    </div>
    <div class="statistics-content">
      <div class="chartStatic unity">
        <div class="title">病种录入情况</div>
        <chart v-if="staticShow" :option="optionGroup1" style="height:185px;"></chart>
      </div>
      <div class="dynamicCharts unity" v-for="(item,index) in chartList" :key="index">
        <div class="title">{{item.chartName}}</div>
        <chart v-if="staticShowS" :option="item.dataList" style="height:185px;"></chart>
      </div>
      <!--<div class="dynamicCharts unity">
        <div class="title">痤疮增长趋势</div>
        <chart :option="lineOptions" style="height:185px;"></chart>
      </div>-->
    </div>
    <!-- <div class="blank-page">
            <img src="../images/blank_page.png" alt="" height="150px">
            <p style="width:100%; text-align:center;color: #666;" >暂无相关信息</p>
    </div>-->
    <mt-popup class="hospital-model" v-model="modicalVisble" position="bottom">
      <div class="action flex-center-center">
        <p @click="modicalVisble = false">取 消</p>
        <p @click="modifyHospital">确 定</p>
      </div>
      <mt-picker :slots="slots" value-key="orgName" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import chart from "./charts/chart";
export default {
  name: "statistics",
  components: {
    chart
  },
  data() {
    return {
      modicalVisble: false,
      staticShow:true,
      staticShowS:true,
      orgName:"",
      slots: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      upDateHospital: "",
      // 柱状图
      optionGroup1: {
        chart: {
          type: "column",
          //   margin: [10, 40, 50, 30],
        //   spacingBottom: 0
        },
        title: {
          text: ""
        },
        tooltip: {
          borderColor: null
        },
        legend: {
          enabled: false
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          min: 0,
          title: {
            text: ""
          },
          lineWidth: 1
        },
        series: [
          {
            data: []
          }
        ],
        credits: {
          enabled: false
        }
      },
      //折线图 -- 银屑病
      lineOption: {
        chart: {
          type: "line",
          // zoomType: "x"
        },
        credits: {
          enabled: false
        },
        title: {
          text: ""
        },
        legend: {
          enabled: false
          // layout: 'vertical',
          // align: 'right',
          // verticalAlign: 'middle' '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          title: {
            text: ""
          },
          lineWidth: 1,
          minorGridLineWidth: 0,
          minorTickInterval: "auto",
          minorTickWidth: 0
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            }
            // pointStart: 2010
          },
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              }
            },
            marker: {
              radius: 2
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            threshold: null
          }
        },
        series: [
          {
            name: "银屑病",
            color: "rgba(165,152,213, 1)",
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
          }
        ]
      },
      //折线图 -- 痤疮
      lineOptions: {
        chart: {
          type: "line",
          zoomType: "x"
        },
        credits: {
          enabled: false
        },
        title: {
          text: ""
        },
        legend: {
          enabled: false
          // layout: 'vertical',
          // align: 'right',
          // verticalAlign: 'middle' '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          title: {
            text: ""
          },
          lineWidth: 1,
          minorGridLineWidth: 0,
          minorTickInterval: "auto",
          minorTickWidth: 0
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            }
            // pointStart: 2010
          },
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              }
            },
            marker: {
              radius: 2
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            threshold: null
          }
        },
        series: [
          {
            name: "银屑病",
            color: "rgba(254,197,189, 1)",
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
          }
        ]
      },
      barColor:[
        { color: "#4C8BFC", name: '面部皮炎' },
        { color: "#57C6FF", name: '白癜风' },
        { color: "#37D9AF", name: '特应性皮炎' },
        { color: "#9AD42B", name: '癌栓' },
        { color: "#4E70FD", name: '神经内科' },
        { color: "#2395F7", name: '神经外科' }
      ],
      chartList:[],
    };
  },
  methods: {
    modicalChange() {
      this.modicalVisble = true;
    },
    onValuesChange(picker, values) {
      this.upDateHospital = values[0];
    },
    modifyHospital() {
      this.modicalVisble = false;
      this.orgName = this.upDateHospital.orgName;
      // console.log(this.upDateHospital.isLocal);
      this.getDiseaseFillInfo(this.upDateHospital.id,this.upDateHospital.isLocal);
      this.everyDiseaseChartList(this.upDateHospital.id,this.upDateHospital.isLocal);
      // loading 窗口 打开
      //调用后台接口，更新视图
      // 接口完成 关闭 loading
    },
    async getDataList() {
      let that = this;
      let formData = {
        diseaseId:that.$store.state.patientInfo.diseaseId || ""
      };
      try {
        let data  = await that.$http.statistics.groupList(formData);
        if(data.code ===0 && data.data) {
          /*data.data.forEach(item=>{
              item.isLocal = false;
          });*/
          /*data.data.forEach((item,index,array)=>{
            if(item.id == that.$store.state.userInfo.orgCode) {
              array.splice(index,1);
            }
          });*/
          if(that.$store.state.userInfo.source == 'local') {
            data.data.unshift({
              id:that.$store.state.userInfo.orgCode,
              orgName:that.$store.state.userInfo.orgName,
              // isLocal:true
            });
          }/*else{
            data.data.unshift({
              id:"",
              orgName:"主平台",
              isLocal:true
            });
          }*/
          data.data.unshift({
            id:"",
            orgName:"全部",
            // isLocal:false
          });
          this.slots[0].values = data.data;
        }
      }catch (error) {
        console.log(error);
      }
    },
    //病种录入情况
    async getDiseaseFillInfo(value,isLocal=false) {
      let that = this;
      that.staticShow = false;
      let formData = {
        orgCode:value,
        diseaseId:that.$store.state.patientInfo.diseaseId,
        // source:that.$store.state.userInfo.source,
        // isLocal:isLocal
      };
      try {
        let data = await that.$http.statistics.getDiseaseFillInfo(formData);
        console.log(data);
        if(data.code === 0 && data.data) {
          this.optionGroup1.xAxis.categories = data.data.xaxis;
          this.optionGroup1.series[0].data = data.data.data;
          /*let array = [];
          for(let i=0;i<data.data.xaxis.length;i++) {
            for(let j=0;j<this.barColor.length;j++) {
              if(data.data.xaxis[i] == this.barColor[j].name) {
                console.log(data.data.xaxis[i])
              }
            }
          }*/
        }
        that.staticShow = true;
      }catch (error) {
        console.log(error);
        that.staticShow = true;
      }
    },
    //各病种增长趋势图
    async everyDiseaseChartList(value,isLocal=false) {
      let that = this;
      that.staticShowS = false;
      let formData = {
        orgCode:value,
        diseaseId:that.$store.state.patientInfo.diseaseId,
        // source:that.$store.state.userInfo.source,
        // isLocal:isLocal
      };
      try{
        let data = await that.$http.statistics.diseaseChartList(formData);
        if(data.code === 0 && data.data) {
          data.data.forEach(item => {
            item.show = false;
            item.dataList =JSON.parse(JSON.stringify(that.lineOption));
            item.dataList.xAxis.categories = item.xaxis;
            // item.series[0].name = item.chartName;
            item.dataList.series = item.series;
            console.log(item.series);
            item.show = true;
          });
          that.chartList = data.data;
          console.log(data)
        }
        that.staticShowS = true;
      }catch (error) {
        console.log(error)
        that.staticShowS = true;
      }
    }
  },
  mounted() {
    this.getDataList().then(()=> {
      this.orgName = this.slots[0].values[0].orgName;
      this.getDiseaseFillInfo(this.slots[0].values[0].id);
      this.everyDiseaseChartList(this.slots[0].values[0].id);
    })
  }
};
</script>

<style lang="scss" scoped>
.statistics {
  height: 100%;
  background-color: #f7f7fa;
  position: relative;
  .header-statistics {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 48px;
    background-color: #ffffff;
    align-items: center;
    padding: 0 16px;
    padding-top: 5px;
    .medical-institutions {
      font-size: 14px;
      color: #666666;
      padding-right: 8px;
    }
    .modical-inputCheckBox {
      flex: 1;
      font-size: 14px;
      color: #666666;
      height: 28px;
      display: flex;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid rgba(204, 204, 204, 1);
      align-items: center;
      padding: 0 16px;
      justify-content: space-between;
      .title {
        color: #666666;
        font-size: 14px;
        width: 220px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .sign {
        width: 0px; /*  宽高设置为0，很重要，否则达不到效果 */
        height: 0px;
        border: 6px solid #666666;
        border-bottom-color: transparent; /* 设置透明背景色 */
        border-left-color: transparent;
        border-right-color: transparent;
        position: relative;
        top: 4px;
      }
    }
  }
  .hospital-model {
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
  .statistics-content {
    margin-top: 10px;
    width: 100%;
    /*height: 100%;*/
    display: flex;
    flex-direction: column;
    .unity {
      //   min-height: 185px;
      background-color: #ffffff;
      margin-bottom: 10px;
      padding-bottom: 10px;
      .title {
        color: #333;
        font-size: 14px;
        padding-top: 10px;
        padding-left: 16px;
      }
    }
    .chartStatic {
      width: 100%;
    }
    .dynamicCharts {
      width: 100%;
    }
  }
}
</style>
