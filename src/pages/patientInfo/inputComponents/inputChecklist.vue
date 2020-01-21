<template>
    <div class="checkBox_list" :class="[item.controlType]">
        <span v-show="item.displayIsVisible" :class="item.controlType+'_title'">{{item.controlDisplayName}}：</span>
        <div :class="item.controlType+'_box'">
          <mt-checklist
            v-if="item.controlType=='CHECKBOX'"
            v-model="checkList"
            :options="processSplit(item.termSet.termItemList)">
          </mt-checklist>
          <input type="text" class="Extend_input" v-if="checkList.includes('其他') && this.item.baseProperty.controlIsExtend"
                 v-model="report.value2"
                 style="display: inline-block !important;border: 1px solid rgba(102, 102, 102,0.4)"
                 placeholder="请输入"/>
        </div>

    </div>
</template>

<script>
export default {
    name: 'inputChecklist',
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
            checkList: []
        }
    },
    watch: {
        checkList: function(newVal) {
            let array = newVal.filter(item => item != '');
            this.report.value = array.join("|");
        }
    },
    created() {
        // this.item.termSet.termItemList = this.item.termSet.rangeText.split('\n');
        if(JSON.stringify(this.report) == '{}') {
            this.report.name = this.item.controlDisplayName;
            this.report.value = ""
            this.report.children =  []
        }
        let checklist = this.report.value.split("|");
        this.checkList = checklist;
    },
    methods: {
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
    .mint-checklist {
        padding-left: 8px !important;
        /deep/ input {
            display: none !important;
        }
        /deep/ span {
            color: #666;
        }
        /*/deep/ .mint-cell-wrapper{
            padding: 8px 5px 8px 0 !important;
        }*/
      /deep/ .mint-field.is-nolabel .mint-cell-title{
        display: inline-block;
      }
    }
    /*.checkBox_list{
        display: flex;
        width: 100%;
        span{
            min-width: 22%;
            white-space: nowrap;
            margin-top: 16.5px;
        }
    }*/
    /*/deep/ .mint-checkbox-label{
        position:relative;
        top: 2px;
    }*/
</style>
