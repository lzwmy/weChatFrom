<template>
    <div>
        <formPortions 
            v-for="(items, index) in item.formPortions" 
            :item="items"
            :report="filter(items, index)"
            :index='index'
            :key="index">
        </formPortions>
    </div>
</template>

<script>
import formPortions from './formPortions'
export default {
    name: 'formPage',
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
    components: {
        formPortions
    },
    created() {
        // console.log(this.item.formPortions,this.report.portions)
        this.item.formPortions.forEach(element => {
            let arr = this.report.portions.filter(
                o => o.portionName == element.portionName
            );
            if (arr.length == 0) {
                let newObj = { portionName: element.portionName, items: [] };
                this.report.portions.push(newObj);
            }
        });
    },
    mounted() {
    },
    methods: {
        filter(data) {
            let obj = this.report.portions.filter(item=>{
                return item.portionName == data.portionName;
            })
            return obj[0];
        }
    },
}
</script>

