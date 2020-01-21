import Vue from 'vue'
import vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import patienDetailInfo from './modules/patienInfo'

Vue.use(vuex);

const state = {
    userInfo:{
        userId: '',
        userName: '',
        openId: '',
        // openId: 'oVg3qv6lGVlgvkPeSCgU_HJXGlM8',
        // openId: 'oVg3qv9mAaqs2Qc7phlIlsGKLicE',
        // openId: 'oVg3qvzWCTXdy0eUZVQnkMZo86BE', //admin
        headImgUrl: "",
        duty: '',
        orgName: ''
    },
    patientInfo:{
        diseaseId: '',
        diseaseName: '',
        patientId: '',
    },
    curRecord: {},
    loginInfo: {
        type: '', //mp 微信 sms 短信 pc 电脑
        formCrfId: '',
        reportId: '',
    }
};
const getters = {
    
};
const mutations = {
    setUserInfo(state, data) {
        state.userInfo = data;
    },
    setPatientInfo(state, data) {
        state.patientInfo = data;
    },
    setCurRecord(state, data) {
        state.curRecord = data;
    },
    setLoginType(state, data) {
        state.loginInfo = data;
    }
};
const actions = {
}
const store = new vuex.Store({
    modules: {
        patienDetailInfo
    },
    state,
    getters,
    mutations,
    actions,
    plugins: [createPersistedState({
        key: 'vuex_'+window.location.href.split('?')[0]
    })]
})

export default store
