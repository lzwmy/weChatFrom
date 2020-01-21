/**
 * 授权相关接口
 */
import request from "@/http/request.js";


//授权接口
// export const authorize = (code) => {
//     return request({
//         url: 'http://fibrrg.natappfree.cc/mp/wx/redirect/OAuth2?code=' + code,
//         // url: 'http://cdr.emhi.cn/mp/wx/redirect/OAuth2?code=' + code,
//         method: 'get',
//     })
// };

//查找患者信息接口
export const searchPatientInfo = (openId) => {
    return request({
        url: '/research/mp/patient/'+openId+'/search',
        method: 'get',
    })
};



//微信解绑
export const unbind = (params) => {
    return request({
        url: '/research/mp/user/unbind',
        method: 'get',
        params
    })
};