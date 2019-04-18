import {
  getInterface
} from '@/commons/api/index'
var root = 'Exam'
export default {
  //考试安排
  getExamList: (data) => getInterface(root, '/arrange/', data, 'post', 'page'), // 分页查询考试安排
  getStatus: (data) => getInterface(root, '/arrange/', data, 'get', ''), // 考试安排状态下拉表
  addExam: (data) => getInterface(root, '/arrange/', data, 'post', ''), // 添加考试安排
  updateExam: (data) => getInterface(root, '/arrange/', data, 'put', ''), // 更新考试安排
  deleteExam: (data) => getInterface(root, '/arrange/', data, 'delete', ''), // 删除考试安排

  //考试
  getPaperContent: (data) => getInterface(root, '/exam/', data, 'get', 'paper'), //考试或试卷分析
  submitAnswer: (data) => getInterface(root, '/exam/', data, 'post', 'submit'), //随时保存、最终提交
}