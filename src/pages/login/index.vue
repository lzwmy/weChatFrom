<template>
    <div class="login">
        <div class="box">
            <div class="top">
                <img src="./bg_login.png" alt="">
            </div>
            <div class="login-content">
                <div class="mode-moblie">
                    <div class="input">
                        <i class="icon iconfont iconshoujihao" :class="mobileCode?'active':''"></i>
                        <input type="number" placeholder="请输入手机号"  v-model.trim="mobileCode"/><br/><br/>
                    </div>
                    <div class="input">
                        <i class="icon iconfont iconyanzhengmabeifen" :class="verificationCode?'active':''"></i>
                        <input type="number" placeholder="请输入验证码" v-model.trim="verificationCode"/>
                        <mt-button plain type="primary" v-if="inviteCodeTime == 60" @click="getValidCode">获取验证码</mt-button>
                        <mt-button plain type="primary" v-else @click="getValidCode">重新获取<span v-if="inviteCodeTime != 60 && inviteCodeTime != 0" style="font-size:14px;">({{inviteCodeTime}})s</span></mt-button>
                    </div>
                </div>
                <mt-button class="login-btn" :style="verificationCode && mobileCode?'':'opacity: 0.5;'" type="primary" size="small" @click="login">立即登录</mt-button>
            </div>
        </div>
        <p class="t">技术支持单位：卫健智能、宜远智能</p>
    </div>
</template>

<script>
import { Button, Toast } from 'mint-ui';
import request from "@/http/request.js";
import axios from "axios"


export default {
    name: 'login',
    data(){
        return {
            mobileCode: "",
            verificationCode: "",
            inviteCodeTime: 60,
            timer: null
        }
    },
    watch: {
        inviteCodeTime: function(newVal) {
            if(newVal == 0) {
                clearInterval(this.timer)
            }
        }
    },
    created() {
        window.localStorage.removeItem('vuex_'+window.location.host);
    },
    mounted() {
        console.log('url='+window.location.href)
        let winHeight = document.querySelector('body').offsetHeight; //获取当前页面高度  
        window.onresize = function() {
            if(!document.querySelector('.t')) {
                return
            }
            let curWinHeight = document.querySelector('body').offsetHeight;  //窗体变化后的高度
            if (winHeight - curWinHeight > 50) {  
                //软键盘弹出,50是设置的阈值，用来排除其他影响窗体大小变化的因素，比如有的浏览器的工具栏的显示和隐藏
                document.querySelector('.t').style.position = 'static';
            } else {   
                //软键盘关闭
                document.querySelector('.t').style.position = 'absolute';
            }  
        }
        //防止页面后退
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL);
        });
    },
    methods: {
        changeMode(val) {
            this.mobileCode = "";
            this.verificationCode = "";
        },
        login() {
            if(!this.mobileCode) {
                Toast({
                    message: '请输入手机号',
                    duration: 3000
                });
                return;
            }else if(!this.verificationCode){
                Toast({
                    message: '请输入验证码',
                    duration: 3000
                });
                return;
            }else {
                this.checkValidCode()
            }
        },
        //获取手机验证码
        async getValidCode() {
            if(!this.mobileCode) {
                Toast({
                    message: '请输入手机号',
                    duration: 3000
                });
                return;
            }
            if(this.inviteCodeTime < 60 && this.inviteCodeTime != 0) {
                this.instance = Toast('请在'+this.inviteCodeTime+"s后,再操作");
                return;
            }
            try {
                let res = await this.$http.login.getValidCode({
                    phoneNumber: this.mobileCode
                });
                if(res.code == 0 ) {
                    this.inviteCodeTime = 59;
                    this.handleinviteCodeTime();
                }else {
                    Toast({
                        message: res.msg,
                        duration: 2000
                    });
                }
                console.log(res)
            } catch (err) {
                Toast({
                    message: err.msg,
                    duration: 2000
                });
                console.log(err)
            }
        },
        //验证手机验证码
        async checkValidCode() {
            try {
                let res = await this.$http.login.checkValidCode({
                    code: this.verificationCode,
                    openId: this.$store.state.userInfo.openId,
                    phoneNumber: this.mobileCode
                });
                if(res.code == 0) {
                    Toast({
                        message: '登录成功',
                        duration: 1500
                    });
                    this.$router.push('/home')
                }else {
                    Toast({
                        message: '登录失败',
                        duration: 1500
                    });
                }
            } catch (err) {
                console.log(err)
            }
        },
        handleinviteCodeTime() {
            this.timer = setInterval(()=>{
                this.inviteCodeTime --;
            },1000)
        }
    },
}
</script>

<style lang="scss" scoped>
    .login {
        .box {
            .top {
                position: relative;
                .page-title {
                    font-size: 18px;
                    text-align: center;
                    color: #fff;
                    padding-top: 20px;
                }
                p{
                    color: #666;
                    background-color: #fff;
                    font-size: 20px;
                    height: 65px;
                    position: absolute;
                    bottom: 0;
                    padding: 19px 16px;
                    left: 14px;
                    right: 14px;
                    border-top-right-radius: 5px;
                    border-top-left-radius: 5px;
                    line-height: 30px;
                }
                .login-mode {
                    width: 100%;
                    span {
                        color: #fff;
                        font-size: 16px;
                        position: relative;
                        &.active::after{
                            content: "";
                            position: absolute;
                            width: 100%;
                            height: 1px;
                            background: #fff;
                            bottom: -5px;
                            left: 50%;
                            transform: translateX(-50%);
                        }
                    }
                }
            }
            .login-content {
                padding: 35px;
                .input {
                    position: relative;
                    height: 36px;
                    margin-bottom: 40px;
                    i {
                        font-size: 22px;
                        color: #ccc;
                        position: absolute;
                        bottom: 8px;
                        left: -2px;
                        color: #999;
                    }
                    i.active + input{
                        color: #666;
                    }
                    input {
                        border: none;
                        line-height: 36px;
                        // background: rgba(35, 149, 247, 0.1);
                        border-bottom: 1px solid rgba(204, 204, 204, 1);
                        width: 100%;
                        color: #999;
                        font-size: 16px;
                        padding-left: 25px;
                        // border-radius: 20px;
                        outline: none;
                        &::-webkit-input-placeholder {
                            color: #999;
                            font-size: 16px;
                        }
                    }
                    .mint-button {
                        position: absolute;
                        height: 26px;
                        padding: 0 15px;
                        bottom: 8px;
                        right: 0;
                        border-radius: 2px;
                        border: none;
                        font-size: 12px;
                        &::before {
                            content: "";
                            position: absolute;
                            left: 0;
                            bottom: 5px;
                            height: 17px;
                            width: 1px;
                            background: rgba(204, 204, 204, 1);
                        }
                    }
                }
                .mode_inviteCode {
                    input {
                        padding-left: 25px;
                    }
                    p {
                        font-size: 16px;
                        color: #666;
                    }
                }
            }
            .login-btn {
                width: 100%;
                margin-top: 20px;
                font-size: 15px;
                height: 40px;
                line-height: 40px;
                border-radius: 2px;
            }
        }
        .t {
            color: #666;
            text-align: center;
            line-height: 50px;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
        }
    }
</style>
