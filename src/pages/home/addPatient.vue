<template>
    <div class="addPatient">
        <div class="page-top flex-between-center">
            <span @click="$router.go(-1)"><i class="icon iconfont iconfanhui right_6"></i></span>
            <p class="text-center">{{$route.meta.title}}</p>
            <span @click="confirmForm">提 交</span>
        </div>
        <div class="content">
            <div class="li scale-1px flex-start-center">
                <span class="input-label"><i style="color: #ff1d1d;">*</i> 姓名:</span>
                <input v-model.trim="form.name" type="text" placeholder="请输入姓名(必填)">
            </div>
            <div class="li scale-1px flex-start-center">
                <span class="input-label"><i style="color: #ff1d1d;">*</i> 性别:</span>
                <div class="gender flex-start-center">
                    <p @click="form.gender = '1'"><i class="icon iconfont iconnan1 right_6" :class="form.gender=='1'?'active':''"></i>男</p>
                    <p @click="form.gender = '2'"><i class="icon iconfont iconnv1 right_6" :class="form.gender=='2'?'active':''"></i>女</p>
                </div>
            </div>
            <div class="li scale-1px flex-start-center" @click="openDateTime">
                <span class="input-label"><i style="color: #ff1d1d;">*</i> 出生日期:</span>
                <p class="select flex-between-center">
                    <span class="placeholder" v-show="!form.birthday">请选择出生日期(必填)</span>
                    {{form.birthday}}
                    <i class="icon iconfont iconshousuo"></i>   
                </p>
            </div>
            <div class="li scale-1px flex-start-center">
                <span class="input-label"><i style="color: #ff1d1d;">*</i> 手机号:</span>
                <input v-model.trim="form.tel" type="number" placeholder="请输入手机号(必填)">
            </div>
            <div class="li scale-1px flex-start-center">
                <span class="input-label"> 病人ID:</span>
                <input v-model.trim="form.hisPatientId" type="number" placeholder="请输入病人ID">
            </div>
            <div class="li scale-1px flex-start-center">
                <span class="input-label"> 身份证号:</span>
                <input v-model.trim="form.IDCard" type="number" placeholder="请输入身份证号">
            </div>
            <div class="li scale-1px flex-start-center">
                <span class="input-label"> 地址:</span>
                <input v-model.trim="form.address" type="text" placeholder="请输入地址">
            </div>
        </div>
        <mt-datetime-picker
            ref="picker"
            type="date"
            v-model="defaultDate"
            :startDate="startDate"
            :endDate="endDate"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            @confirm="handleConfirmDate">
        </mt-datetime-picker>
    </div>  
</template>

<script>
import { DatetimePicker,Toast,Indicator } from 'mint-ui';
export default {
    name: 'addPatient',
    data () {
        return {
            startDate: new Date(new Date().getFullYear()-100+'/01/01'),
            endDate: new Date(),
            form: {
                name: '',
                gender: '1',
                birthday: '',
                tel: '',
                hisPatientId: '',
                IDCard: '',
                address: ''
            },
            defaultDate: new Date(new Date().getFullYear()-30+'/01/01')
        }
    },
    watch: {
        defaultDate: function(newVal) {
        }
    },
    mounted() {
            // this.$refs.picker.dateSlots[0].values.reverse()
        
    },
    methods:{
        formatDate(date) {
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' +date.getDate();
        },
        handleConfirmDate(val) {
            this.form.birthday = this.formatDate(val);
        },
        openDateTime() {
            this.$refs.picker.open();
        },
        confirmForm() {
            if(!this.form.name) {
                Toast({message:'请输入姓名!',duration:1500});
                return;
            }else if(!this.form.tel) {
                Toast({message:'请输入手机号!',duration:1500});
                return;
            }else if(!this.form.birthday) {
                Toast({message:'请输入出生日期!',duration:1500});
                return;
            }else if(!this.form.tel) {
                Toast({message:'请输入手机号!',duration:1500});
                return;
            }
            let checkTel =  /^1[2|3|4|5|6|7|8|9][0-9]\d{8}$/;
            if(!checkTel.test(this.form.tel)) {
                Toast({message:'请输入正确的手机号!',duration:1500});
                return; 
            }
            this.addPatient();
        },
        //添加患者
        async addPatient() {
            Indicator.open('保存中...');
            let params = {
                "patientName": this.form.name,
                "genderCode": this.form.gender,
                "birthdate": this.form.birthday,
                'hisPatientId': this.form.hisPatientId,
                "patientId": '',
                'userId': this.$store.state.userInfo.userId,
                'userName': this.$store.state.userInfo.userName,
                "idCardNo": this.form.IDCard,
                "phoneNumber": this.form.tel,
                "address": this.form.address,
                "diseaseId": this.$store.state.patientInfo.diseaseId,
                "subjectId": "",
                "groupId": "",
                "diseaseName": "",
                "subjectName": "",
                "groupName": ""
            }
            try {
                let res = await this.$http.patientInfo.addPatient(params);
                Indicator.close();
                if(res.code == 0) {
                    Toast({message: '添加成功!',duration: 1500});
                    this.$router.push('/index')
                }else if(res.code == 40){
                    Toast({message: res.msg || '添加患者失败!',duration: 1500});
                }else {
                  Toast({message: '添加患者失败!',duration: 1500});
                }
            } catch (err) {
                console.log(err)
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    .addPatient {
        .page-top {
            color: #fff;
            background-color: #2395f7;
            padding: 0 16px;
            p {
                font-size: 18px;
                line-height: 50px;
            }
            i {
                font-size: 16px;
            }
            span {
                font-size: 14px;
            }
        }
        .content {
            .li {
                line-height: 49px;
                padding: 0 16px;
                .input-label {
                    font-size: 15px;
                    color: #666;
                    min-width: 80px;
                }
                .select {
                    flex: 1;
                    font-size: 14px;
                    color: #666;
                    .icon {
                        transform: rotate(180deg);
                        color: #999;
                    }
                }
                .placeholder {
                    color: #999;
                    font-size: 14px;
                }
                .gender {
                    p {
                        margin-right: 35px;
                        &:first-child .icon.active {
                            color: #2395f7;
                        }
                        &:last-child .icon.active {
                            color: #f69ae9;
                        }
                        .icon{
                            color: #ccc;
                            font-size: 18px;
                        }
                    }
                }
            }
        }
    }
</style>
