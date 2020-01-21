<template>
    <div class="news  flex-center-center flex-wrap">
        <div>
            <img src="../images/blank_page.png" alt="" height="150px" @click="popupVisible = true">
            <p style="width:100%; text-align:center;color: #666;" >暂无相关信息</p>
        </div>
    </div>  
</template>

<script>
import { Popup, Picker } from 'mint-ui';
export default {
    name: 'news',
    data () {
        return {
            popupVisible: false,
            slots: [
                {
                    flex: 1,
                    values: [
                        {name:'1',value:'1'},
                        {name:'2',value:'2'},
                        {name:'3',value:'3'},
                        {name:'4',value:'4'},
                        {name:'5',value:'5'},
                        {name:'6',value:'6'},
                    ],
                    className: 'slot1',
                    textAlign: 'center'
                },
                {
                    flex: 1,
                    values: [
                        {name:'1-2',value:'1'},
                        {name:'2-2',value:'2'},
                        {name:'3-2',value:'3'},
                        {name:'4-2',value:'4'},
                        {name:'5-2',value:'5'},
                        {name:'6-2',value:'6'},
                    ],
                    className: 'slot2',
                    textAlign: 'center'
                },
                {
                    flex: 1,
                    values: [
                        {name:'1-3',value:'1'},
                        {name:'2-3',value:'2'},
                        {name:'3-3',value:'3'},
                        {name:'4-3',value:'4'},
                        {name:'5-3',value:'5'},
                        {name:'6-3',value:'6'},
                    ],
                    className: 'slot3',
                    textAlign: 'center'
                }
            ],
        }
    },
    methods:{
        
    }
}
</script>

<style lang="scss" scoped>
    .news{
        height: 100%;
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
