<template>
    <div class="flex-start-center only-input" :class="[type,item.controlType]">
      <i v-show="item.baseProperty.isRequired"
         :class="{isRequired:item.baseProperty.isRequired}"
         :data-value="report.value"
         style="color: red">*&nbsp;</i>
        <span v-show="item.displayIsVisible" :class="type+'-title'">{{item.controlDisplayName}}：</span>
        <!--<input
            :type='type'
            placeholder="请填写"
            v-model="report.value">-->
        <div :class="[item.controlType+'_box',{'addColor':report.value}]">{{report.value || '(空)'}}</div>
    </div>
</template>

<script>
export default {
    name: 'onlyInput',
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
            
        }
    },
    created() {
        if(JSON.stringify(this.report) == '{}') {
            this.report.name = this.item.controlDisplayName;
            this.report.value = ""
            this.report.children =  []
        }
        if(this.type=="number" && typeof(this.report.value) === 'string') {
            this.report.value = this.report.value.split('|')[0];
        }
    },
}
</script>
<style lang="scss" scoped>
    .only-input{
      width: 100%;
        input{
            padding-left: 6px !important;
        }
        .text-title{
            min-width:22%;
            position:relative;
            top: 2.5px;
        }
    }
</style>
