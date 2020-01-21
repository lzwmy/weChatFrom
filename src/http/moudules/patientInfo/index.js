/**
 * 患者信息相关接口
 */
import request from "@/http/request.js";

//记录列表
export const getPatientDataList = (data) => {
    return request({
        url: '/research/mobile/cases/findCases.do',
        method: 'post',
        data
    })
};

//添加患者
export const addPatient = (data) => {
    return request({
        url: '/research/mobile/cases/save.do',
        method: 'post',
        data
    })
};

//获取报告列表
export const reportList = (data) => {
    return request({
        url: '/research/mobile/cases/reportList.do',
        method: 'post',
        data
    })
};

//获取报告列表(添加报告下拉列表)
export const getAppReportList = (params) => {
    return request({
        url: '/research/mobile/cases/crf/list.do',
        method: 'get',
        params
    })
};


//添加报告
export const appReport = (data) => {
    return request({
        url: '/research/mobile/cases/add.do',
        method: 'post',
        data
    })
};

export const getPreview = (params,openId) => {
    return request({
        // url: '/research/mp/patient/'+openId+'/preview',
        url: '/research/mobile/cases/preview.do?'+ 't=' + (+new Date()), 
        method: 'post',
        params
    })
};
export const findReport = (params,openId) => {
    return request({
        // url: '/research/mp/patient/'+openId+'/findReport',
        url: '/research/report/findReport?'+ 't=' + (+new Date()),
        method: 'get',
        params
    })
};

export const savePatientInfo = (data,openId) => {
    return request({
        url: '/research/mp/patient/'+openId+'/save',
        method: 'post',
        data
    })
};

// 获取 报告 的评分表数据
export const getScoreData = (data,openId) => {
    return request({
        url:"/research/report/get/reportScore.do",
        method:'post',
        data
    })
};

// 保存报告数据 模板
export const reportDataSaveList = (data) => {
    return request({
        url:"/research/mp/patient/save",
        method:"post",
        data
    })
}

// 保存 报告 数据 评分功能
export const reportScoreSaveData = (data) => {
    return request({
        url:"/research/report/mobile/save/reportScore.do",
        method:"post",
        data
    })
}
