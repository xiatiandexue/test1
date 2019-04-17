import {
  getInterface
} from '@/commons/api/index'
import {
  getDownload
} from '@/commons/utils/request'
var root = 'Exam'
export default {
  //成绩管理
  download: (data) => getDownload('/exam/score/download?type=' + data.type), // 导出成绩

}