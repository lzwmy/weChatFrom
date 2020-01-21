/*
 * 接口统一集成模块
 */
import * as patientInfo from './moudules/patientInfo/index'
import * as patient from './moudules/patient/index'
import * as authorize from './moudules/authorize/index'
import * as login from './moudules/login/index'
import * as statistics from './moudules/statistics/index';
import * as followUp from './moudules/followUp/index'

// 默认全部导出
export default {
  authorize,
  patientInfo,
  patient,
  login,
  followUp,
  statistics
}
