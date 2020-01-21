/**
 *  统计 接口
 * **/

import request from "@/http/request.js";

//查询机构列表
export const groupList = (params) => {
  return request({
    url: '/research/mobile/statistics/diseases/cases/list.do',
    method: 'get',
    params
  })
};
//病种录入情况

export const getDiseaseFillInfo = (data) => {
  return request({
    url:"/research/mobile/statistics/diseases/cases/bar.do",
    method: 'post',
    data
  })
};

// 病种病例增长趋势图

export const diseaseChartList = (data) => {
  return request({
    url:"/research/mobile/statistics/diseases/cases/line.do",
    method:"post",
    data
  })
};
