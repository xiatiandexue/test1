import {
  getInterface
} from '@/commons/api/index'
var root = 'Exam'
export default {
  //考试安排
  getExamList: (data) => getInterface(root, '/select/', data, 'post', 'page'), // 分页查询考试安排

  //考试

  //试卷分析
}