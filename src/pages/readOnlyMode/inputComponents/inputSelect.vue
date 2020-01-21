<template>
    <div :class="[type,item.controlType]" style="width: 100%">
        <span v-show="item.baseProperty.isRequired"
              :class="{isRequired:item.baseProperty.isRequired}"
              :data-value="report.value"
              style="color: red">*&nbsp;</span>
        <span v-show="item.displayIsVisible" class="slect-title" >{{item.controlDisplayName}}：</span>
        <div :class="[item.controlType+'_box',{'addColor':report.value}]" v-if="item.controlType=='MULTI_COMBOX'">
            {{value || '(空)'}}
        </div>
        <div :class="[item.controlType+'_box',{'addColor':report.value}]" v-else>
          {{report.value || '(空)'}}
        </div>
        <!--<select
            v-if="item.controlType=='MULTI_COMBOX'"
            :multiple="item.controlType=='MULTI_COMBOX'"
            placeholder="请选择..."
            @change="handerChange(value)"
            v-model="value">
            <option :name="termItemList" v-for="(termItemList, termSetIndex) in item.termSet.termItemList" :value="precessData(termItemList)" :key="termSetIndex">{{precessData(termItemList)}}</option>
        </select>
      <select
        v-else
        placeholder="请选择..."
        v-model="report.value">
        <option value='' disabled selected style='display:none;'>请选择</option>
        <option :name="termItemList" v-for="(termItemList, termSetIndex) in item.termSet.termItemList" :value="precessData(termItemList)" :key="termSetIndex">{{precessData(termItemList)}}</option>
      </select>-->
    </div>
</template>

<script>
export default {
    name: 'inputSelect',
    props: {
        type: {
            type: String,
            default: ""
        },
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
            value:[]
        }
    },
    methods:{
      handerChange(data) {
        this.report.value = data.join('|');
      },
      //处理 ^
      precessData(data) {
        if(data.indexOf('^')!=='-1') {
          return data.split('^')[0]
        }else {
          return data
        }
      },
    },
    created() {
        // console.log(this.report.value)
        if(JSON.stringify(this.report) == '{}') {
            this.report.name = this.item.controlDisplayName;
            this.report.value = ""
            this.report.children =  []
        }
        if(this.item.controlType=="MULTI_COMBOX") {
          if(this.report.value !== "") {
            if(this.report.value.indexOf('|') !== '-1') {
              this.value = this.report.value.split('|').join('、')
            }else {
              this.value = this.report.value || []
            }
          }
        }

    },
}
</script>
<style lang="scss" scoped>
  select {
    color: #666666;
  }
/*.flex-start-center{
     select{
        margin-left: 8px;
    }
    .slect-title{
        min-width: 22%;
        position: relative;
        top: 2.5px;
    }
}*/
</style>
