<template>
    <div class="mine ">
        <div class="top">
            我的
        </div>
        <div class="userInfo">
            <img :src="$store.state.userInfo.headImgUrl" alt="用户头像" width="60" height="60">
            <p class="userName flex-center-center">{{$store.state.userInfo.userName}} <span> {{$store.state.userInfo.duty || '医生'}}</span></p>
            <p class="org">{{$store.state.userInfo.orgName}}</p>
        </div>
        <div class="logout" @click="logout">注 销</div>
    </div>   
</template>

<script>
import { Indicator, Toast  } from 'mint-ui';
export default {
    name: 'mine',
    data () {
        return {
            
        }
    },
    methods:{
        async logout() {
            Indicator.open('正在注销...');
            try {
                let res = await this.$http.authorize.unbind({openId:this.$store.state.userInfo.openId});
                if(res.code == 0) {
                    window.localStorage.removeItem('vuex_'+window.location.href.split('?')[0]);
                    this.$router.replace('/login');
                }else {
                    Toast({message:'注销失败!',duration:1500});
                }
                Indicator.close();
            } catch (err) {
                console.log(err)
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    .mine {
        height: 100%;
        .top {
            height: 120px;
            background-image: url('../../../static/images/mine_bg.png');
            background-size: cover;
            color: #fff;
            text-align: center;
            font-size: 18px;
            padding-top: 20px;
        }
        .userInfo {
            height: 118px;
            background: #fff;
            position: relative;
            padding: 45px 0 20px;
            box-shadow: 0px 1px 2px 0px rgba(212,211,211,0.5);
            img {
                border-radius: 50%;
                position: absolute;
                top: 0;
                left: 50%;
                transform: translate(-50%,-50%);
                border: 1px solid #fff;
            }
            .userName {
                text-align: center;
                font-size: 20px;
                color: rgba(51, 51, 51, 1);
                font-weight: bold;
                margin-bottom: 8px;
                span {
                    background: rgba(55, 217, 175, 0.2);
                    color: rgba(55, 217, 175, 1);
                    font-size: 12px;
                    font-weight: bold;
                    padding: 4px 10px;
                    min-width: 45px;
                    margin-left: 10px;
                    border: 1px solid rgba(55, 217, 175, 1);
                    border-radius: 20px;
                    text-align: center;
                }
            }
            .org {
                text-align: center;
                font-size: 14px;
                color: rgba(102, 102, 102, 1);
            }
        }
        .logout {
            line-height: 40px;
            text-align: center;
            font-size: 19px;
            background: rgba(35, 149, 247, 1);
            color: #fff;
            width: 305px;
            border-radius: 2px;
            margin: 60px auto;
        }
    }
</style>
