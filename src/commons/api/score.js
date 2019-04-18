import {
  getInterface
} from '@/commons/api/index'
import {
  getDownload
} from '@/commons/utils/request'
var root = 'Exam'
export default {
  //成绩管理
  // downLoadGrade: (data) => getDownload('/exam/score/download?type=' + data.type), // 导出成绩
  downLoadGrade: (data) => getInterface(root, '/exam/', data, 'get', 'download'), // 导出成绩
  getGradePage: (data) => getInterface(root, '/exam/', data, 'post', 'grade'), // 分页查询成绩
}