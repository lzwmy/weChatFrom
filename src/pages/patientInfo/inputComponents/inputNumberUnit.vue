<template>
    <div :class="type" style="width:100%;">
        
        <input
            :type='type'
            :placeholder="'请选择'+item.controlDisplayName"
            v-model="form.inputVal">
        <select 
            :multiple="item.controlType=='MULTI_COMBOX'" 
            placeholder="请选择..."  
            v-model="form.inputUnit"
            @keyup.enter="valChange">
            <option  :name="termItemList" v-for="(termItemList, termSetIndex) in item.termSet.termItemList" :key="termSetIndex">{{termItemList}}</option>
        </select>
    </div>
</template>

<script>
export default {
    name: 'inputNumberUnit',
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
            form: {
                inputVal:"",
                inputUnit:""
            }
        }
    },
    watch: {
        form: {
            handler:function(newVal){
                this.report.value = newVal.inputVal +'|'+ newVal.inputUnit;
            },
            deep: true
        } 
    },
    created() {
        if(JSON.stringify(this.report) == '{}') {
            this.report.name = this.item.controlDisplayName;
            this.report.value = ""
            this.report.children =  []
        }
        this.form.inputVal = this.report.value.split('|')[0];
        this.form.inputUnit = this.report.value.split('|')[1]?this.report.value.split('|')[1]:this.item.termSet.termItemList[0].termItemName;
    },
}
</script>
