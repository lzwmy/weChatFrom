<template>
    <ul class="table-view"> 
        <formPage 
            v-for="(items, index) in perview" 
            :item="items"
            :report="filter(items, index)"
            :key="index">
        </formPage>
    </ul>
</template>

<script>
  import './css/readStyle.css';
import formPage from './formPage'
export default {
    name: 'patientInfo',
    props: {
        perview: {
            type: Array,
            default: () =>([])
        },
        report: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {}
    },
    components: {
        formPage
    },
    created() {
        // console.log(this.perview,this.report)
        this.perview.forEach(element => {
            let arr = this.report.pages.filter(
                o => o.pageName == element.pageDisplayName
            );
            if (arr.length == 0) {
                let newObj = { pageName: element.pageDisplayName, portions: [] };
                this.report.pages.push(newObj);
            }
        });
    },
    mounted() {
        this.$nextTick(()=>{
            this.$store.commit("setReport",this.report)
        })
    },
    methods: {
        filter(data,index) {
            let obj = this.report.pages.filter(item=>{
                return item.pageName == data.pageDisplayName;
            })
            return obj[0];
        }
    },
}
</script>

