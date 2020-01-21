<template>
    <div class="patient">
        <div class="page-top flex-between-center">
            <span @click="$router.push('/home')"><i class="icon iconfont iconfanhui right_6"></i></span>
            <p class="text-center page-title">专病科研平台</p>
            <span></span>
        </div>
        <div class="top"></div>
        <div class="userInfo flex-start-center">
            <i class="icon iconfont" :class="patiendInfo.sex=='男'?'icontouxiang-nan':'icontouxiang-nv'" style="font-size:50px; color: #b8becc;"></i>
            <div>
                <p>姓名：{{patiendInfo.patientName}}</p>
                <p>年龄：{{patiendInfo.age}} 岁</p>
            </div>
            <div>
                <p>性别：
                    <svg class="icon" aria-hidden="true">
                        <use :xlink:href="patiendInfo.sex=='男'?'#iconnan':'#iconnv'"></use>
                    </svg>
                <p>手机号：{{patiendInfo.phoneNumber}}</p>
            </div>
        </div>
        <div class="content">
            <ul class="line">
                <li v-for="(item, index) in recordData" :key="index" class="flex-center-center">
                    <i class="icon iconfont iconbianzu1"></i>
                    </li>
            </ul>
            <ul class="list">
                <li v-for="(item, index) in recordData" :key="index">
                    <div class="box" @click="linkForm(item)">
                        <p class="time">{{item.createTime}}</p>
                        <div class="flex-start-between">
                            <!-- <img src="https://via.placeholder.com/50/09f/fff.png" alt=""> -->
                            <div class="cout">
                                <p class="pasi">报告名称: {{item.reportName}}</p>
                                <p>诊断医生: {{item.author}}</p>
                            </div>
                        </div>
                        <!-- <p>{{item.diagnoseType==1?'复诊':'初诊'}}</p> -->
                    </div>
                </li>
            </ul>
        </div>
        <div class="bottom flex-center-center" @click="popupVisible = true">
            <span><i class="icon iconfont iconxinzeng right_6"></i> 添加报告</span>
        </div>


        <mt-popup v-model="popupVisible" position="bottom">
            <div class="action flex-center-center">
                <p @click="popupVisible = false">取 消</p>
                <p @click="appReport">确 定</p>
            </div>
            <mt-picker @change="changeReport" :slots="slots" value-key="name"></mt-picker>
        </mt-popup>
    </div>  
</template>

<script>
import { Popup, Picker, Toast, Indicator } from 'mint-ui';
export default {
    name: 'patient',
    data () {
        return {
            recordData: [],
            patiendInfo: {},
            popupVisible: false,
            slots: [
                {
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }
            ],
            //选择的报告
            selectReport: {}
        }
    },
    created() {
        this.patiendInfo = this.$route.query;
        this.getReportList();
        this.getAppReportList();
    },
    beforeDestroy() {
        Indicator.close();
    },
    methods:{
        //改变选择报告
        changeReport(picker,values) {
            this.selectReport = values[0];
        },
        //获取报告列表
        async getReportList() {
            Indicator.open('加载中...');
            let params = {
                "offset": 1,
                "limit": 999,
                "args": {
                    "diseaseId": this.$store.state.patientInfo.diseaseId,
                    // "patientName": this.patiendInfo.patientName,
                    "patientId": this.$store.state.patientInfo.patientId
                }
            }
            try {
                let res = await this.$http.patientInfo.reportList(params);
                if(res.code == 0) { 
                    this.recordData = res.data.args;
                }else{
                    Toast({message: '获取报告失败!',duration: 1500});
                }
                Indicator.close();
            } catch (err) {
                console.log(err)
            }
        },
        //获取添加报告选择列表
        async getAppReportList() {
            let params = {
                "crfType": 1,
                "diseaseId": this.$store.state.patientInfo.diseaseId
            }
            try {
                let res = await this.$http.patientInfo.getAppReportList(params);
                if(res.code == 0) {
                    this.slots[0].values = res.data;
                }
            } catch (err) {
                console.log(err)
            }
        },
        //添加报告
        async appReport() {
            if(!this.selectReport) {
                this.popupVisible = false;
                Toast({message: '暂无报告!',duration: 1500});
                return;
            }
            Indicator.open('保存中...');
            let visitDate = new Date()
            let params = {
                "crfId": this.selectReport.id,
                "reportName": this.selectReport.name,
                "patientId": this.patiendInfo.patientId,
                "diseaseId": this.$store.state.patientInfo.diseaseId,
                "diseaseName": this.$store.state.patientInfo.diseaseName,
                "userName": this.patiendInfo.userName,
                "userId": this.$store.state.userInfo.userId,
                'visitDate': visitDate.getFullYear()+'-'+(visitDate.getMonth()+1)+'-'+visitDate.getDate()
            }
            try {
                let res = await this.$http.patientInfo.appReport(params);
                Indicator.close();
                if(res.code == 0) {
                    this.$router.push({
                        path:'/portionsDetail',
                        query: {
                            formCrfId: res.data.crfId,
                            reportId: res.data.reportId
                        }
                    })
                    this.popupVisible = false;
                    // this.getReportList();
                }else if(res.code == 40){
                  Toast({message: res.msg || '添加失败!',duration: 1500});
                }else {
                  Toast({message: '添加失败!',duration: 1500});
                }
            } catch (err) {
                console.log(err)
                Indicator.close();
            }
        },
        //跳转到表单页面
        linkForm(item) {
            this.$router.push({
                path:'/portionsDetail',
                query: {
                    formCrfId: item.crfId,
                    reportId: item.id
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .patient {
        background: #F8F8F8;
        position: relative;
        height: 100%;
        .top {
            // height: 15px;
            background-color: #2395f7;
            position: relative;
            
        }
        .userInfo {
            height: 100px;
            color: #666;
            padding: 25px 0 25px 16px;
            background-color: #fff;
            & > div {
                margin-left: 25px;
            }
            p {
                line-height: 30px;
            }
        }
        .content {
            padding: 20px 0;
            position: absolute;
            top: 150px;
            left: 0;
            right: 0;
            overflow: auto;
            bottom: 49px;
            color: #666;
            .line {
                position: absolute;
                top: 20px;
                left: 14px;
                width: 20px;
                li {
                    position: relative;
                    height: 105px;
                    &::before {
                        content: '';
                        position: absolute;
                        left: 7px;
                        top: 7px;
                        transform: translateX(-50%);
                        bottom: 7px;
                        width: 1px;
                        z-index: 1;
                        background-color: rgba(55, 217, 175, 0.5);
                    }
                    &:last-child::before {
                        display: none;
                    }
                    .icon {
                        position: absolute;
                        left: 0px;
                        top: -7px;
                        z-index: 10;
                        font-size: 14px;
                        transform-origin: center center;
                        color: #37d9af;
                    }
                }
            }
            .list {
                position: absolute;
                top: 14px;
                left: 38px;
                right: 16px;
                li {
                    height: 105px;
                    border-radius: 2px;
                    // background: #Fff;
                    .box {
                        box-shadow: 0 0 5px #dcdcdc;
                        .time {
                            line-height: 18px;
                            padding-bottom: 8px;
                            color: #999;
                            background: #Fff;
                        }
                        background: #Fff;
                        padding: 8px;
                        border-radius: 4px;
                        .cout {
                            .pasi {
                                margin-bottom: 6px;
                                color: #333;
                                font-size: 15px;
                            }
                            p {
                                font-size: 12px;
                            }

                        }
                    }
                }
            }
        }
        .bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 49px;
            background-color: #fff;
            color: #2395F7;
            box-shadow:0px -1px 4px 0px rgba(217,217,217,0.5);
            .icon {
                font-size: 14px;
            }
            span {
                font-size: 16px;
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
    }
</style>
