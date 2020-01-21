/**
 * 随访页相关接口
 */
import request from "@/http/request.js";

//随访列表
export const getFollowUpList = (data) => {
    return request({
        url: '/research/mobile/cases/task/list.do',
        method: 'post',
        data
    })
};

//发送短信
export const sendSMSmessage = (data) => {
    return request({
        url: '/research/mobile/cases/push/sms',
        method: 'post',
        data
    })
};

//发送微信
export const sendweChatmessage = (data) => {
    return request({
        url: '/research/mobile/cases/push/mp',
        method: 'post',
        data
    })
};

//保存随访表单
export const savefollowUpPatientInfo = (data) => {
    return request({
        url: '/research/report/remind/save/report',
        method: 'post',
        data
    })
};

export const getReportId = (params) => {
    return request({
        url: '/research/report/remind/detail',
        method: 'get',
        params
    })
};