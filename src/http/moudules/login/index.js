/**
 * 登录相关接口
 */
import request from "@/http/request.js";

//获取验证码接口
export const getValidCode = (params) => {
    return request({
        url: '/research/mp/binding/send/valid/code',
        method: 'get',
        params
    })
};

//验证验证码接口
export const checkValidCode = (data) => {
    return request({
        url: '/research/mp/binding/valid/code',
        method: 'post',
        data
    })
};

//验证邀请码接口
export const checkInviteCode = (data) => {
    return request({
        url: '/research/mp/binding/invite/code',
        method: 'post',
        data
    })
};


