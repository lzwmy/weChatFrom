<template>
    <div  :class="item.controlType">
<!--      class="gather radionList"-->
        <span v-show="item.displayIsVisible" class="radio-title">{{item.controlDisplayName}}：</span>
      <div :class="item.controlType+'_box'">
        <mt-radio
          v-model="report.value"
          :options="processSplit(item.termSet.termItemList)">
        </mt-radio>
        <input type="text" class="Extend_input" v-if="report.value == '其他' && this.item.baseProperty.controlIsExtend"
               v-model="report.value2"
               style="display: inline-block !important;border: 1px solid rgba(102, 102, 102,0.4)"
               placeholder="请输入"/>
      </div>

        <!-- <mt-button class="clearBtn" size="small" plain @click="clearGather">清空</mt-button> -->
    </div>
</template>

<script>
export default {
    name: 'inputRadionList',
    props: {
        item: {
            type: Object,
            default: () =>({})
        },
        report: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
        }
    },
    created() {
        if(JSON.stringify(this.report) == '{}') {
            this.report.name = this.item.controlDisplayName;
            this.report.value = "";
            this.report.children =  []
        }
    },
    mounted() {
        
    },
    methods: {
        clearGather() {
            this.report.value = '';
        },
      processSplit(data) {
        let array = [];
          data.forEach((item) => {
            if(item.indexOf('^')!=='-1') {
              array.push({
                label:item.split('^')[0],
                value:item.split('^')[0],
              })
            }else {
              array.push({
                label:item,
                value:item,
              })
            }
          })
        return array;
      }
    },
}
</script>

<style lang="scss" scoped>
    .radionList {
        // padding-left: 1em;
        min-width: 250px;
        flex-wrap: wrap;
        /deep/ .mint-radiolist {
            padding-left: 6px !important;
            .mint-radio-label{
                position:relative;
                top: 1px;
            }
        }
        span{
            // white-space:nowrap;
            margin-top: 12px;
            min-width: 22%;
        }
        .radio-title{
            position: relative;
            top: 1px;
        }
    }
    .mint-radiolist /deep/ span{
        color: #666;
    }
</style>
