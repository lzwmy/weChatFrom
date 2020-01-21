/**
 * 患者页相关接口
 */
import request from "@/http/request.js";

//专病列表
export const findDiseaseSpecies = (params) => {
    return request({
        url: '/research/mp/user/disease/list',
        method: 'get',
        params: params
    })
};

//病种下的用户信息
export const findDiseaseUserInfo = (params) => {
    return request({
        url: '/research/mp/user/info',
        method: 'get',
        params: params
    })
};
