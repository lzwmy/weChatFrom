<template>
    <div class="followUp">
        <div class="page-top flex-center-center">
            <span @click="showPopup" class="page-top-left"><i class="icon iconfont iconshaixuan"></i> 筛选</span>
            <p class="text-center page-title">随访记录</p>
        </div>
        <div class="search-filter flex-between-center">
            <p @click="selectType(item.value)" :class="defaultSearchActive==item.value?'active':''" v-for="(item,index) in searchList" :key="index">{{item.label}}</p>
        </div>
        <div id='wrapper'>
            <div class="content">
                <div class="top-tip flex-center-center">
                    <span class="refresh-hook">{{topTip}}</span>
                </div>
                <ul class="list">
                    <li v-for="(item, index) in recordList" :key="index" @click="linkForm(item)" class="flex-between-center">
                        <span class="surname">{{item.patientName.substring(0,1)}}</span>
                        <div class="cont scale-1px flex-between-center">
                            <div>
                                <div class="top flex-start-center">
                                    <span class="name">{{item.patientName}}</span>
                                    <div>
                                        <span style="margin-right: 14px;"><i class="icon iconfont right_6" :class="item.genderName=='男'?'iconnan':'iconnv'"></i>{{item.genderName}}</span>
                                        <span><i class="icon iconfont iconnianling right_6"></i>{{item.age}}</span>
                                    </div>
                                </div>
                                <div class="bottom flex-start-center" style="width: 100%;">
                                    <p>{{item.planVisitDate}}</p>
                                    <span>{{item.diseaseName}}</span>
                                </div>
                            </div>
                            <p class="cont_right" v-if="item.status == 0">
                                <span v-if="item.mpVisit==0 && item.smsVisit==0">
                                    <i @click.stop="sendSms(item)" class="icon iconfont iconduanxin" style="color:#00be90; margin-right: 15px;"></i>
                                    <i @click.stop="sendWeChat(item)" class="icon iconfont iconweixin1" style="color:#00c80d;"></i>
                                </span>
                                <span v-else-if="item.smsVisit!=0">短信已发送</span>
                                <span v-else-if="item.mpVisit!=0">微信已推送</span>
                            </p>
                            <p class="cont_right" v-else v-html="handleStatus(item)"></p>
                        </div>
                    </li>
                </ul>
                <div class="bottom-tip flex-center-center" v-show="recordList.length != 0">
                    <span class="refresh-hook">{{bottomTip}}</span>
                </div>
            </div>
        </div>
        <div v-show="empty" class="empty flex-center-center">
            <div>
                <img src="../images/blank_page.png" alt="" height="150px">
                <p style="width:100%; text-align:center;color: #666;" >暂无相关信息</p>
            </div>
        </div>
        <!-- 病种筛选 -->
        <mt-popup position="left" class="diseaseSelect" v-model="selectDiseaseVisible">
            <div class="wrap">
                <p class="label">起始时间</p>
                <div class="input-time flex-between-center" @click="$refs.startTiemPicker.open()">
                    <p v-show="form.startTime" class="val">{{form.startTime}}</p>
                    <p v-show="!form.startTime" class="placeholder">请选择起始时间</p>
                    <i class="icon iconfont iconrili"></i>
                </div>
                <p class="label">结束时间</p>
                <div class="input-time flex-between-center" @click="$refs.endTiemPicker.open()">
                    <p v-show="form.endTime" class="val">{{form.endTime}}</p>
                    <p v-show="!form.endTime" class="placeholder">请选择结束时间</p>
                    <i class="icon iconfont iconrili"></i>
                </div>
                <p class="label">病种选择</p>
                <div class="input-time flex-between-center" @click="popupVisible = true">
                    <p class="val">{{form.diseaseName}}</p>
                    <i class="icon iconfont iconxiala-copy"></i>
                </div>
                <div @click="reset" class="reset flex-center-center">重 置</div>
            </div>
        </mt-popup>

        <!-- 开始时间 -->
        <mt-datetime-picker
            ref="startTiemPicker"
            type="date"
            v-model="defaultDate"
            :startDate="startDate"
            :endDate="endDate"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            @confirm="handleStartConfirmDate">
        </mt-datetime-picker>

        <!-- 结束时间 -->
        <mt-datetime-picker
            ref="endTiemPicker"
            type="date"
            v-model="defaultDate"
            :startDate="startDate"
            :endDate="endDate"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            @confirm="handleEndConfirmDate">
        </mt-datetime-picker>

        <!-- 病程选择 -->
        <mt-popup v-model="popupVisible" class="disease" position="bottom">
            <div class="action flex-center-center">
                <p @click="popupVisible = false">取 消</p>
                <p @click="selectDisease">确 定</p>
            </div>
            <mt-picker ref="refSelectDisease" @change="onDiseaseChange" :slots="slots" value-key="name"></mt-picker>
        </mt-popup>

    </div>  
</template>

<script>
import { Toast,Popup,Indicator  } from 'mint-ui';
import Bscroll from 'better-scroll'
export default {
    name: 'followUp',
    data () {
        let currentDate = new Date();
        return {
            searchList: [
                {label: '全 部', value: undefined},
                {label: '已随访', value: 1},
                {label: '未随访', value: 0}
            ],
            defaultSearchActive: undefined,
            form: {
                startTime: '',
                endTime: '',
                diseaseId: '',
                diseaseName: '全部',
            },
            startDate: new Date(currentDate.getFullYear()-5+'-01-01'),
            endDate: new Date(currentDate.getFullYear()+5+'-12-30'),
            defaultDate: this.formatDate(currentDate),
            popupVisible: false,
            slots: [
                {
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }
            ],
            temDiseaseSelect: {},

            selectDiseaseVisible: false,
            limit: 15,
            recordList: [],
            empty: false,
            scroll: null,
            offset: 1,
            bottomTip: '上拉加载更多',
            topTip: '下拉刷新',
            dataNull: false
        }
    },
    created() {
        this.findDiseaseSpecies();
        this.getDataList();
    },
    mounted() {
        this.$nextTick(()=>{
            let height = document.querySelector('#wrapper').clientHeight + 20;
            document.querySelector('#wrapper .content').style.minHeight = height+ 'px';
            document.querySelector('#wrapper .list').style.minHeight = height+ 'px';
            if (!this.scroll) {
                let wrapper = document.querySelector('#wrapper');
                this.scroll = new Bscroll(wrapper, {
                    probeType: 2,
                    click: true,
                    startY: 0
                })
                this.scroll.on('scroll', (pos) => {
                    // 下拉动作
                    console.log(pos.y)
                    if (pos.y > 50) {
                        this.topTip = '释放立即刷新'
                    }else {
                        this.topTip = '下拉刷新'
                    }
                })
                this.handleTouchEnd();
            } else {
                this.scroll.refresh()
            }
        })
    },
    beforeDestroy() {
        Indicator.close();
    },
    watch: {
        selectDiseaseVisible: function(newVal) {
            if(!newVal) {
                this.getDataList();
                document.querySelector('.tabs').style.display='flex';
            }else {
                document.querySelector('.tabs').style.display='none';
                document.querySelector('.diseaseSelect').style.height = document.querySelector('#app').offsetHeight + 'px'
                document.querySelector('.container').style.height = document.querySelector('#app').offsetHeight + 'px'
            }
        }
    },
    methods:{
        //选择随访类型
        selectType(val) {
            this.defaultSearchActive = val;
            this.offset = 1;
            this.getDataList();
        },
        formatDate(date) {
            let year  = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            return year + '-' + (month>=10?month:'0'+month) + '-' + (day>=10?day:'0'+day);
        },
        reset() {
            this.form =  {
                startTime: '',
                endTime: '',
                diseaseId: '',
                diseaseName: '全部',
            }
        },
        //开始时间
        handleStartConfirmDate(val) {
            this.form.startTime = this.formatDate(val);
        },
        //结束时间
        handleEndConfirmDate(val) {
            this.form.endTime = this.formatDate(val);
        },
        //选择病种
        onDiseaseChange(picker,values) {
            if(values[0]) {
                this.temDiseaseSelect = values[0];
            }
        },
        selectDisease() {
            this.form.diseaseName = this.temDiseaseSelect.name;
            this.form.diseaseId = this.temDiseaseSelect.id;
            this.popupVisible = false
        },
        //发送微信
        async sendWeChat(row) {
            try {
                let res = await this.$http.followUp.sendweChatmessage({
                    "remindId": row.id,
                    "userId": this.$store.state.userInfo.userId,
                    "userName": this.$store.state.userInfo.userName
                });
                if (res.code == '0') {
                    Toast({message: '发送微信消息成功!',duration: 1500});
                    this.getDataList();
                }else {
                    Toast({message: '发送微信消息失败!',duration: 1500});
                }
            } catch (err) {
                console.log(err)
                Toast({message: '发送微信消息失败!',duration: 1500});
            }
        },
        //发送短信
        async sendSms(row) {
            try {
                let res = await this.$http.followUp.sendSMSmessage({
                    "remindId": row.id,
                    "userId": this.$store.state.userInfo.userId,
                    "userName": this.$store.state.userInfo.userName
                });
                if (res.code == '0') {
                    Toast({message: '发送短信成功!',duration: 1500});
                    this.getDataList();
                }else {
                    Toast({message: '发送短信失败!',duration: 1500});
                }
            } catch (err) {
                console.log(err)
                Toast({message: '发送短信失败!',duration: 1500});
            }
        },
        //松开事件
        handleTouchEnd() {
            this.scroll.on('touchEnd',(pos) =>{  //下拉刷新
                if(pos.y > 50){
                    Indicator.open('加载中...');
                    setTimeout(()=>{
                        this.offset = 1;
                        this.dataNull = false;
                        this.getDataList()
                        .then(()=>{
                            this.topTip = '下拉刷新';
                            this.bottomTip = '上拉加载更多',
                            this.scroll.refresh();
                        })
                    },800)
                } 
                else if(pos.y<(this.scroll.maxScrollY - 50)){   //下拉加载
                    Indicator.open('加载中...');
                    setTimeout(()=>{
                        this.offset++;
                        this.getDataList()
                        .then(()=>{
                            this.scroll.refresh();
                        })
                    },300)
                }
            })   
        },
        //操作记录状态
        handleStatus(item) {
            switch (item.status) {
                case 1: return '<span style="color:rgba(0, 190, 144, 1);">已填写</span>';
                case 2: return '<span style="color:rgba(247, 158, 0, 1);">已失访</span>';
                case 3: return '<span style="color:rgba(219, 84, 82, 1);">已终止</span>';
                case 4: return '<span style="color:rgba(100, 100, 100, 1);">已失效</span>';
                default: return 'null';
            }
        },
        //点击筛选
        showPopup() {
            this.selectDiseaseVisible = true;
        },
        //获取病种列表
        async findDiseaseSpecies() {
            try {
                let res = await this.$http.patient.findDiseaseSpecies({openId:this.$store.state.userInfo.openId});
                if (res.code == '0' && res.data.length != 0) {
                    this.slots[0].values = res.data;
                    this.slots[0].values.unshift({
                        id:'',
                        name: '全部'
                    })
                }else {
                    console.log('病种列表获取失败!');
                }
            } catch (err) {
                console.log(err)
            }
        },
        //获取随访列表
        async getDataList() {
            Indicator.open('加载中...');
            let params = {
                "offset": this.offset,
                "limit": this.limit,
                "args": {
                    "diseaseId": this.form.diseaseId,
                    "startTime": this.form.startTime.split('-').join(''),
                    "endTime": this.form.endTime.split('-').join(''),
                    "status": this.defaultSearchActive,
                    "userId": this.$store.state.userInfo.userId
                }
            }
            try {
                let res = await this.$http.followUp.getFollowUpList(params);
                if(res.code == 0) {
                    if(JSON.stringify(res.data.args) == '[]') {
                        this.dataNull = true;
                        this.bottomTip = '-- 已加载全部数据 --';
                    }
                    if(this.offset == 1) {
                        this.recordList = res.data.args;
                    }else {
                        this.recordList = this.recordList.concat(res.data.args)
                    }
                    if(this.recordList.length == 0) {
                        this.empty = true;
                    }else {
                        this.empty = false;
                    }
                }else{
                    Toast({message: '获取患者记录列表失败!',duration: 1500});
                }
                Indicator.close();
            } catch (err) {
                console.log(err)
            }
        },
        //跳转到表单页面
        linkForm(row) {
            this.$router.push({
                path:'/portionsDetail',
                query: {
                    formCrfId: row.crfId,
                    reportId: row.reportId,
                    saveType: 'followUp',
                    from: '/followUp'
                }
            })
            this.$store.commit("setCurRecord", row);
        }
    }
}
</script>

<style lang="scss" scoped>
    .followUp {
        position: relative;
        height: 100%;
        background-color: #f3f3f3;
        .page-top {
            position: relative;
            .page-top-left {
                position: absolute;
                top: 0;
                left: 16px;
                line-height: 45px;
            }
        }
        .search-filter {
            line-height: 40px;
            padding: 0 45px;
            background-color: #fff;
            p {
                font-size: 16px;
                color: rgba(153, 153, 153, 1);
                position: relative;
                &.active {
                    color: rgba(35, 149, 247, 1); 
                }
                &.active::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: 2px;
                    background: rgba(35, 149, 247, 1);
                }
            }
        }
        #wrapper {
            position: absolute;
            top: 95px;
            left: 0;
            right: 0;
            overflow: auto;
            bottom: 0;
            background-color: #f3f3f3;
            .top-tip {
                position: absolute;
                height: 60px;
                left: 0;
                right: 0;
                color: #999;
            }
            .top-tip {
                top: -50px;
            }
            .bottom-tip {
                bottom: -50px;
                line-height: 50px;
                color: #999;
            }
            .datanullTip {
                color: #999;
                padding: 20px 0 30px;
            }
            .list {
                background-color: #fff;
                padding: 0 16px;
                li {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    height: 65px;
                    .surname {
                        display: inline-block;
                        width: 44px;
                        height: 44px;
                        margin-right: 10px;
                        background: #2395f7;
                        text-align: center;
                        line-height: 44px;
                        font-size: 24px;
                        color: #fff;
                        border-radius: 5px;
                    }
                    .icon {
                        font-size: 11px;
                    }
                    .cont {
                        flex: 1;
                        padding: 12px 0;
                        height: 100%;
                        font-size: 12px;
                        color: #666;
                        .top {
                            width: 100%;
                            margin-bottom: 4px;
                            .name {
                                font-size: 15px;
                                color: #333;
                                display: inline-block;
                                width: 80px;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                                margin-right: 10px;
                            }
                            i {
                                color: #2395f7;
                                &.iconnv {
                                    color: #f69ae9;
                                }
                            }
                            .time {
                                font-size: 12px;
                            }
                            &> div {
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                            }
                        }
                        .bottom {
                            color: #999;
                            p {
                                display: inline-block;
                                font-size: 12px;
                                width: 80px;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                                margin-right: 10px;
                            }
                            span {
                            }
                            i {
                                color: #84CB5A;
                            }
                        }
                        .cont_right {
                            width: 70px;
                            font-size: 12px;
                            color: rgba(153, 153, 153, 1);
                            .icon {
                                font-size: 18px;
                            }
                        }
                    }
                }
            }
        }
        .empty {
            position: absolute;
            top: 100px;
            left: 0;
            right: 0;
            bottom: 0;
        }
        .mint-popup.diseaseSelect {
            height: 100%;
            .wrap {
                width: 244px;
                height: 100%;
                padding: 10px 16px;
                position: relative;
                .label {
                    font-size: 14px;
                    margin: 15px 0 8px;
                    color: rgba(102, 102, 102, 1);
                }
                .input-time {
                    border: 1px solid rgba(204, 204, 204, 1);
                    height: 28px;
                    width: 150px;
                    padding: 0 10px;
                    .icon {
                        color: #999;
                        font-size: 14px;
                    }
                }
                .placeholder {
                    color: #999;
                    font-size: 13px;
                }
                .reset {
                    margin-top: 30px;
                    background: #2395f7;
                    color: #fff;
                    font-size: 16px;
                    height: 44px;
                    width: 100%;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                }
            }
        }
        .mint-popup.disease {
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
