<template>
    <mt-header :title="title">
        <mt-button slot="left" v-if="$route.meta.backKey"  icon="back" @click="back"></mt-button>
        <i slot="left" class="icon iconfont icon-sousuo"></i>
    </mt-header>
</template>

<script>
import Vue from 'vue'
import { Header,Button, MessageBox,Toast, Indicator } from 'mint-ui';
Vue.component(Header.name, Header);
Vue.component(Button.name, Button);
export default {
    name:"head-com",
    data () {
        return{
            title:"",
        }
    },
    watch:{
        $route(to, from){
            this.title = this.$route.meta.title;
        }
    },
    created(){
        
    },
    methods: {
        onHeadRignBtn() {
            let path = this.$route.path;
            switch(path) {
                case '/portionsDetail' : 
                    Indicator.open('正在保存中...');
                    this.reportDataSaveList();
                    break;
                default: ;
            }
        },
        back() {
            this.$router.back(-1);
        },
        //随访进来表单保存
        async savefollowUpPatientInfo() {
            Indicator.open('正在保存中...');
            let that = this;
            let curRecord = that.$store.state.curRecord;
            let formData = Object.assign(that.$store.state.patienDetailInfo.reportData.pages[0],{
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
                "sourceType": that.$store.state.loginInfo.type, 
                "creatorName": that.$store.state.patientInfo.patientname,
                "creatorId": that.$store.state.patientInfo.patientid
            })
            if(that.$store.state.loginInfo.type == 'sms' || that.$store.state.loginInfo.type == 'mp') {
                formData.crfId = that.$store.state.loginInfo.formCrfId
                formData.id = that.$store.state.loginInfo.reportId
            }
            console.log(formData);
            try{
                let data = await that.$http.followUp.savefollowUpPatientInfo(formData);
                if(data.code === 0) {
                    Toast({
                        message: '保存成功',
                    });
                }
                if(!this.$store.state.loginInfo.type) {
                    window.history.go(-1);
                }
                Indicator.close();
            }catch (error) {
                console.log(error);
            }
        },
        // 患者报告保存 信息
        async reportDataSaveList() {
            let that = this;
            let formData = {
                userId:that.$store.state.userInfo.userId,
                userName:that.$store.state.userInfo.userName,
                reportBakDto:that.$store.state.patienDetailInfo.reportData.pages[0]
            };
            try{
                let data = await that.$http.patientInfo.reportDataSaveList(formData);
                if(data.code === 0) {
                    Toast({
                        message: '保存成功',
                    });
                    window.history.go(-1);
                    Indicator.close();
                }
            }catch (error) {
                console.log(error);
            }
        }
    },
}
</script>

<style scoped lang="scss">
    .mint-header{
        height: 45px;
        background: #2395f7;
        color:#fff;
        position: absolute;
        top:0;
        left:0;
        width:100%;
        z-index: 999;
        i{
            font-size:.4rem;
        }
        /deep/ h1 {
            font-size: 16px;
        }
    }
</style>

