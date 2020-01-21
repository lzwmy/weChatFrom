<template>
    <li class="table-view-cell" v-if="!isTableItem(item.formItemList)" >
        <span class="navigate-right" @click="handleFold">
            <div>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconjibenxinxi"></use>
                </svg>
                <!-- <span style="font-weight:bold;color:#2395F7;font-size:18px;">{{item.portionName}}</span> -->
                <span style="color:#2395F7;font-size:16px;">{{item.portionName}}</span>
            </div>
            <!-- <i class="icon iconfont iconshousuo" style="font-size:16px"></i> -->
            <img height="20px" class="close open-img"  src="./images/jia.png" alt="">
            <img height="21px" class="close colse-img" src="./images/jian.png" alt="">
        </span>
        <div class="collapse-content" >
            <formItems 
                class="formItems"
                v-for="(items, index) in item.formItemList" 
                :item="items"
                :report="filter(items,index)"
                :key="index">
            </formItems>
        </div>
    </li>
</template>

<script>
import formItems from './formItems'
export default {
    name: 'formPortions',
    props: {
        item: {
            type: Object,
            default: () =>({})
        },
        report: {
            type: Object,
            default: () => ({})
        },
        index:{
            type:Number,
            default:null
        }
    },
    data () {
        return {
            acitveTab:''
        }
    },
    components: {
        formItems
    },
    created() {
        // console.log(this.item,this.report)
        this.item.formItemList.forEach(element => {
            let arr = this.report.items.filter(
                o => o.name == element.controlDisplayName
            );
            if (arr.length == 0) {
                let newObj = {
                name: element.controlDisplayName,
                controlType:element.controlType,
                value: "",
                value2:"",
                children: []
                };
                this.report.items.push(newObj);
            }
        });
    },
    mounted() {
        // document.querySelector("ul.table-view div").firstElementChild.classList.add('open');
    },
    methods: {
        activeTab(index) {
            if(index == this.acitveTab) {
                this.acitveTab = "" ;
                return ;
            }
            this.acitveTab = index ;
        },
        handleFold(e) {
            let oli = e.target.offsetParent;
            let clearClass = function(){
                Array.from(document.querySelector("ul.table-view").children).forEach( (element,index) =>{
                    Array.from(element.getElementsByClassName('table-view-cell')).forEach(li =>{
                        li.classList.remove('open')
                    })
                })
            }
            if(oli.className.indexOf('open') == -1) {
                clearClass();
                oli.classList.add('open')
            }else{
                clearClass();
            }
        },
        isTableItem(arr) {
            return arr.every(item =>{
                return item.controlType == 'TABLE';
            })
        },
        filter(data,index) {
            // console.log(this.report,data)
            let obj =  this.report.items.filter(item=>{
                return item.portionName === data.portionName;
            })
            return  obj[index];
        }
    },
}
</script>

<style lang="scss">
.table-view-cell{
    .close{
        display: none;
    }
     .open-img{
            display: inline-block;
        }
}
    li.open {
        .colse-img{
            display: inline-block;
        }
        .open-img{
            display: none;
        }
       
    }
</style>
