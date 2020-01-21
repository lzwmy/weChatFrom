<template>
    <div class="home">
        <div class="page-top flex-between-center">
            <span @click="showPopup" class="page-top-left"><i class="icon iconfont iconbingzhongxuanze"></i> 病种</span>
            <p class="text-center page-title">{{diseaseName}}</p>
            <i @click="addPatient" class="icon iconfont iconxinzeng page-top-right"></i>
        </div>
        <div class="search flex-center-center">
            <i class="icon iconfont iconsousuo"></i>
            <input type="text" @keyup.enter="getPatientDataList" v-model="keyword" placeholder="请输入病人姓名或病人号">
            <span class="search-btn" @click="getPatientDataList">搜 索</span>
        </div>
        <div id='wrapper'>
            <div class="content">
                <div class="top-tip flex-center-center">
                    <span class="refresh-hook">{{topTip}}</span>
                </div>
                <ul class="list">
                    <li v-for="(item, index) in recordList" :key="index" @click="linkToDetail(item)" class="flex-between-center">
                        <span class="surname">{{item.patientName.substring(0,1)}}</span>
                        <div class="cont scale-1px">
                            <div class="top flex-between-center">
                                <span class="name">{{item.patientName}}</span>
                                <div>
                                    <span><i class="icon iconfont right_6" :class="item.sex=='男'?'iconnan':'iconnv'"></i>{{item.sex}}</span>
                                    <span><i class="icon iconfont iconnianling right_6"></i>{{item.age}} 岁</span>
                                </div>
                                <p class="time">报告: {{item.reviewCount}} 次</p>
                            </div>
                            <div class="bottom flex-between-center" style="width: 100%;">
                                <p style="margin-right: 20px;"><i class="icon iconfont iconchuangjianren right_6"></i> {{item.userName}}</p>
                                <span>{{item.createTime}}</span>
                            </div>
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
        <!-- 病种选择 -->
        <mt-popup position="left" v-model="selectDiseaseVisible">
            <div class="wrap">
                <h1>病种分类</h1>
                <ul>
                    <li v-for="(item,index) in diseaseList" :key="index" :class="diseaseId==item.id?'active':''" @click="selectDisease(item)">
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="handleIcon(item.remark)"></use>
                        </svg>
                        <span>{{item.name}}</span>
                    </li>
                </ul>
            </div>
        </mt-popup>
    </div>  
</template>

<script>
import { Popup,Indicator  } from 'mint-ui';
import axios from "axios"
import Bscroll from 'better-scroll'
export default {
    name: 'home',
    data () {
        return {
            keyword: '',
            selectDiseaseVisible: false,
            diseaseName: '',
            diseaseId: this.$store.state.patientInfo.diseaseId || '',
            diseaseList: [],
            limit: 15,
            recordList: [],
            patientInfo: {},
            empty: false,
            scroll: null,
            offset: 1,
            bottomTip: '上拉加载更多',
            topTip: '下拉刷新',
            dataNull: false
        }
    },
    created() {
        console.log('url='+window.location.href)
        let code = this.getQueryString("code");
        let openId = this.getQueryString("openId")
        let formCrfId = this.getQueryString("formCrfId")
        let reportId = this.getQueryString("reportId")
        let type = this.getQueryString("type")

        //清除
        this.$store.commit("setLoginType", {
            type: 'wx', 
            formCrfId: '',
            reportId: '',
        });
        if(type == 'sms' || type == 'mp') {
            this.getReportId(parseInt(reportId))
            .then((res)=>{
                this.$store.commit("setLoginType", {
                    type: type, 
                    formCrfId: parseInt(formCrfId),
                    reportId: parseInt(reportId)
                });
                this.$router.push({
                    path:'/portionsDetail',
                    query: {
                        formCrfId: formCrfId,
                        reportId: res.reportId,
                        remind: true,
                        saveType: 'followUp'
                    }
                })
            })
        }else {
            // if(this.$store.state.userInfo.openId) {
            //     this.findDiseaseSpecies(this.$store.state.userInfo.openId);
            // }else {
                this.authorize(code);
            // }
        }
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
                    if (pos.y > 50) {
                        this.topTip = '释放立即刷新'
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
        $route: function(to,from) {
            //不执行刷新操作
            if(to.path === '/home') {
                this.findDiseaseSpecies();
            }
        }
    },
    methods:{
        //松开事件
        handleTouchEnd() {
            this.scroll.on('touchEnd',(pos) =>{  //下拉刷新
                if(pos.y > 50){
                    Indicator.open('加载中...');
                    setTimeout(()=>{
                        this.offset = 1;
                        this.dataNull = false;
                        this.getPatientDataList()
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
                        this.getPatientDataList()
                        .then(()=>{
                            this.scroll.refresh();
                        })
                    },300)
                }
            })   
        },
        //匹配iconfont
        handleIcon(val) {
            switch (val) {
                case 'bladder': return '#iconbladder';
                case 'ear': return '#iconear';
                case 'face': return '#iconface';
                case 'eye': return '#iconeye';
                case 'female': return '#iconmale';
                case 'male': return '#iconmale';
                case 'gallbladder': return '#icongallbladder';
                case 'heart': return '#iconheart';
                case 'kidneys': return '#iconkidneys';
                case 'large_intestine': return '#iconlarge_intestine';
                case 'liver': return '#iconliver';
                case 'lungs': return '#iconlungs';
                case 'nose': return '#iconnose';
                case 'pancreas': return '#iconpancreas';
                case 'stomach': return '#iconstomach';
                case 'stomatology': return '#iconstomatology';
                case 'uterus': return '#iconuterus';
                case 'small_intestine': return '#iconsmall_intestine';
                case 'spleen': return '#iconspleen';
                case 'cerebrum': return '#iconcerebrum';
                case 'hearingTumor': return '#iconhearingTumor';
                case 'Psoriasis': return '#iconPsoriasis';
                case 'acne': return '#iconacne';
                case 'Psoriasis': return '#iconPsoriasis';
                case 'tdermatitis': return '#icontdermatitis';
                default: return '';
            }
        },
        //选择病种
        selectDisease(item) {
            this.$store.commit("setPatientInfo", {
                diseaseId: item.id,
                diseaseName: item.name,
                patientId: ''
            });
            this.diseaseName = item.name;
            this.diseaseId = item.id;
            this.selectDiseaseVisible = false;
            this.findDiseaseUserInfo().then(()=>{
                this.getPatientDataList();
            })
        },
        linkToDetail(item) {
            this.$store.commit("setPatientInfo", {
                diseaseId: this.diseaseId,
                diseaseName: this.diseaseName,
                patientId: item.patientId
            });
            this.$router.push({
                path: '/patient',
                query: Object.assign(item,{from: '/followUp'})
            })
        },
        showPopup() {
            this.selectDiseaseVisible = true;
        },
        addPatient() {
            this.$router.push('/addPatient')
        },
        //授权
        async authorize(code) {
            try {
                // let res = await axios.get("http://cdr.emhi.cn/mp/wx/redirect/OAuth2?code="+code);
                let res = await axios.get("http://cdr.emhi.cn/gd/wx/redirect/OAuth2?code="+code);
                if (res.data.user && res.data.user.openId) {
                    let storeData = Object.assign(this.$store.state.userInfo, {
                        openId: res.data.user.openId,
                        headImgUrl: res.data.user.headImgUrl
                    })
                    this.$store.commit("setUserInfo", storeData);
                    this.findDiseaseSpecies();
                }else {
                    this.$router.replace('/login')
                }
            } catch (err) {
                console.log(err)
                this.$router.replace('/login')
            }
        },
        //获取病种列表
        async findDiseaseSpecies() {
            try {
                let res = await this.$http.patient.findDiseaseSpecies({openId:this.$store.state.userInfo.openId});
                if (res.code == '0' && res.data.length != 0) {
                    this.diseaseList = res.data;
                    //判断缓存中是否存在当前病种,如果存在则读缓存，不存在则读第一个病种
                    let isExist = this.diseaseList.some((li)=>{
                        return li.id == this.$store.state.patientInfo.diseaseId;
                    })
                    // if(!this.$store.state.patientInfo.diseaseId) {
                    //     this.diseaseId =  res.data[0].id;
                    //     this.diseaseName = res.data[0].name;
                        
                    // }else {
                    //     this.diseaseId = this.$store.state.patientInfo.diseaseId;
                    //     this.diseaseName = this.$store.state.patientInfo.diseaseName;
                    // }
                    if(isExist) {
                        this.diseaseId = this.$store.state.patientInfo.diseaseId;
                        this.diseaseName = this.$store.state.patientInfo.diseaseName;
                    }else {
                        this.diseaseId =  res.data[0].id;
                        this.diseaseName = res.data[0].name;
                    }
                    this.$store.commit("setPatientInfo", {
                        diseaseId: this.diseaseId,
                        diseaseName: this.diseaseName,
                        patientId: ''
                    });
                    this.findDiseaseUserInfo();
                }else {
                    console.log('病种列表获取失败!');
                    this.$router.replace('/login')
                }
            } catch (err) {
                console.log(err)
                this.$router.replace('/login')
            }
        },
        //获取用户信息,拿到userId
        async findDiseaseUserInfo() {
            let params = {
                "diseaseId": this.diseaseId,
                "openId": this.$store.state.userInfo.openId,
            }
            try {
                let res = await this.$http.patient.findDiseaseUserInfo(params);
                if(res.code == 0 && res.data.id) {
                    this.patientInfo = {
                        userId: res.data.id,
                        userName: res.data.name,
                        diseaseId: this.diseaseId
                    }
                    // this.$store.state.userInfo.orgCode    
                    // this.$store.state.userInfo.source   (local 本机构  share  分享)
                    let storeData = Object.assign(this.$store.state.userInfo, {
                        userId: res.data.id,
                        userName: res.data.name,
                        duty: res.data.duty,
                        orgName: res.data.orgName,
                        orgCode: res.data.orgCode,
                        source: res.data.source
                    })
                    this.$store.commit("setUserInfo", storeData);
                    this.getPatientDataList();
                }else{
                    Toast({message: '获取患者信息失败!',duration: 1500});
                    this.$router.replace('/login')
                }
            } catch (err) {
                console.log(err)
                this.$router.replace('/login')
            }
        },
        //获取报告id
        async getReportId(remindId) {
            try {
                let res = await this.$http.patientInfo.getReportId({remindId:remindId});
                if(res.code == 0) {
                    return Promise.resolve(res.data)
                }
            } catch (err) {
                console.log(err)
            }
        },
        //获取患者记录列表
        async getPatientDataList() {
            Indicator.open('加载中...');
            let params = {
                "offset": this.offset,
                "limit": this.limit,
                "args": {
                    "diseaseId": this.diseaseId,
                    "keyword": this.keyword,
                    "userId": this.$store.state.userInfo.userId
                }
            }
            try {
                let res = await this.$http.patientInfo.getPatientDataList(params);
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
        getQueryString(name) {  
            if(window.location.href.indexOf(name) == -1) {
                return null;
            }
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
            var params = window.location.href.split('?')[1];
            var r = params.match(reg);  
            if (r != null) return unescape(r[2]);  
            return null;  
        },
    }
}
</script>

<style lang="scss" scoped>
    .home {
        position: relative;
        height: 100%;
        .search {
            margin: 12px 16px;
            position: relative;
            input {
                flex: 1;
                line-height: 30px;
                display: block;
                margin-right: 10px;
                outline: none;
                background-color: #F8F8F8;
                padding-left: 26px; 
            }
            .icon {
                position: absolute;
                top: 9px;
                left: 8px;
                font-size: 12px;
                color: #999;
            }
            .search-btn {
                font-size: 15px;
                color: #999;
            }
        }
        #wrapper {
            position: absolute;
            top: 100px;
            left: 0;
            right: 0;
            overflow: auto;
            bottom: 0;
            background-color: #f3f3f3;
            .top-tip {
                position: absolute;
                height: 50px;
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
                    // &:last-child {
                    //     .cont::after{
                    //         display: none;
                    //     }
                    // }
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
                        display: flex;
                        padding: 13px 0;
                        height: 100%;
                        flex-wrap: wrap;
                        justify-content: flex-start;
                        align-content: space-between;
                        font-size: 12px;
                        color: #666;
                        .top {
                            display: flex;
                            justify-content: space-between;
                            align-self: center;
                            width: 100%;
                            .name {
                                font-size: 15px;
                                color: #333;
                                display: inline-block;
                                width: 60px;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                            }
                            i {
                                color: #2395f7;
                                &.iconnv {
                                    color: #f69ae9;
                                }
                            }
                            span {
                                margin-right: 14px;
                            }
                            .time {
                                font-size: 12px;
                            }
                            &> div {
                                width: 140px;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                            }
                        }
                        .bottom {
                            p {
                                display: inline-block;
                                width: 67px;
                                font-size: 12px;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                            }
                            span {
                                color: #a6a6a6;
                            }
                            i {
                                color: #84CB5A;
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
        .mint-popup {
            height: 100%;
            -webkit-overflow-scrolling: touch;
            .wrap {
                width: 244px;
                height: 100%;
                padding: 30px 15px;
                position: relative;
                h1 {
                    font-size: 18px;
                    margin-bottom: 6px;
                    color: #333;
                }
                ul {
                    position: absolute;
                    top: 75px;
                    bottom: 0;
                    left: 0px;
                    right: 0px;
                    overflow: auto;
                    li {
                        line-height: 37px;
                        &.active {
                            background-color: #eee;
                        }
                        padding: 8px 15px;
                        svg.icon {
                            width: 37px;
                            height: 37px;
                            margin-right: 10px;
                            vertical-align: middle;
                        }
                        span {
                            font-size: 14px;
                            color: #666;
                        }
                    }
                }
            }
        }
    }
</style>
