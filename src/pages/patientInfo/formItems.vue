<template>
    <div>
            <!-- v-show="items.displayIsVisible!=0 && items.controlDisplayName != '参考图' && items.controlType != 'TABLE' && items.children.every(li =>{return li.controlType != 'TABLE'})"  -->
            <!-- v-if="items.displayIsVisible!=0 && items.controlDisplayName != '参考图' && items.controlType != 'TABLE' && (items.controlType !== 'GATHER' && item.children.length !== 0)"  -->
            <!-- item.controlType !== 'TABLE' && items.children.every(li =>{return li.controlType != 'TABLE'}) && item.controlType!=='GATHER' -->
            <!-- v-for="(items, index) in item.children" :key="index" :report="filter(item)"-->
        <mt-field 
            v-if="item.controlType!=='GATHER'&& item.controlType !=='TABLE'&&item.controlType !== 'LABEL'&&item.baseProperty.labelType!=='IMAGE' && item.controlType!=='FILE_UPLOAD'">
            <formItemInput  :item="item" :report="report"></formItemInput>
        </mt-field>
        <!-- v-if="  item.controlDisplayName != '参考图' 
                    && item.controlType != 'TABLE' 
                    && JSON.stringify(item.children)=='[]' || 
                    (item.controlType=='GATHER' && item.gatherKnowType != 0)
                    && item.children.every(li =>{return li.controlType != 'TABLE'})" -->
        <mt-field 
            v-if="item.controlType !== 'LABEL'&&item.baseProperty.labelType!=='IMAGE'&&item.controlType=='GATHER' && item.controlType!=='FILE_UPLOAD'">
            <formItemInput :item="item" :report="report"></formItemInput>
        </mt-field>
        <!-- 上传 -->
            <!-- v-if="item.controlType=='FILE_UPLOAD'"    up html&& item.children.length == 1-->
            <!-- {{item.controlType}} -->
        <fileUpload
            v-if="item.controlType=='FILE_UPLOAD'"
            :item="item" 
            :report="report">
        </fileUpload>
    </div>
</template>

<script>
import formItemInput from './formItemInput'
import fileUpload from './inputComponents/fileUpload'
import utils from '@/components/utils/index'
export default {
    name: 'formItems',
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
            value: ''
        }
    },
    created() {
        // console.log(this.item.children,this.report.children)
        //初始化报告数据
        this.item.children.forEach(element => {
            let arr = this.report.children.filter(
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
                this.report.children.push(newObj);
            }
        });
    },
    components: {
        formItemInput,
        fileUpload,
    },  
    methods: {
        //类型转换
        typeSwitch(str){
            let type;
            switch(str) {
                case 'DATE_TIME': type = 'date'; break;
                case 'DATE': type = 'date'; break;
                case 'SINGLE_INPUT': type = 'text'; break;
                case 'MULTI_INPUT': type = 'textarea field-noInput'; break;
                case 'SINGLE_COMBOX': type = 'field-select'; break;
                case 'TABLE': type = 'field-hide'; break;
                case 'GATHER': type = 'gather'; break;
                case 'RADIO_BUTTON': type = 'field-noInput'; break;
                case 'NUMBER_INPUT': type = 'number'; break;
                case 'CHECKBOX': type = 'fidld-CHECKBOX field-noInput'; break;
                default: type = "text";
            }
            return type;
        },
        upDataReportValue() {
            this.report.value = this.value;
        },
        filter(data) {
            // console.log(data,this.report.children)
            let obj =  this.report.children.filter(item=>{
                return item.name === data.controlDisplayName;
            })
            // if(obj.length == 0) {
            //     return {}
            // }
            return obj[0];
        }
    },
}
</script>
