<template>
    <div :class="[type,item.controlType]" >
<!--      style="display:block;width: 100%;"-->
      <span v-show="item.baseProperty.isRequired"
            :class="{isRequired:item.baseProperty.isRequired}"
            :data-value="report.value"
            style="color: red">*&nbsp;</span>
      <span v-show="item.displayIsVisible" :class="item.controlType+'-title'">{{item.controlDisplayName}}：</span>
      <span v-if="!item.displayIsVisible"></span>
<!--      style="display: flex;flex-wrap:wrap;width: 100%;"-->
      <div :class="[item.controlType+'-box',{'addColor':report.value}]" >
        <!--<textarea v-model="report.value" style="min-width: 300px;width:100%;display:block;" type='textarea' rows="3" placeholder="请填写" />-->
        {{report.value || '(空)'}}
      </div>
    </div>
</template>

<script>
export default {
    name: 'inputTextarea',
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
    },
}
</script>
