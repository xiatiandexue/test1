import {
  getInterface
} from '@/commons/api/index'
var root = 'Exam'
export default {
  //自动生成试卷
  autoGenerating: (data) => getInterface(root, '/paper/', data, 'post', 'autoGenerating'), //自动组卷
  getPaperPage: (data) => getInterface(root, '/paper/', data, 'post', 'page'), //分页查询所有试卷
  deletePaper: (data) => getInterface(root, '/paper/', data, 'delete', ''), //删除试卷
  //更新试卷
  getPaper: (data) => getInterface(root, '/paper/', data, 'get', ''), //查询试卷信息
  getSelectById: (data) => getInterface(root, '/paper/', data, 'post', 'select'), //查询单选题信息
  getSAQById: (data) => getInterface(root, '/paper/', data, 'post', 'saq'), //查询判断题信息
  deleteSelect: (data) => getInterface(root, '/paper/', data, 'delete', 'select'), //删除单选题
  deleteSAQ: (data) => getInterface(root, '/paper/', data, 'delete', 'saq'), //删除单选题
  addSelect: (data) => getInterface(root, '/paper/', data, 'post', 'addSelect'), //添加单选题
  addSAQ: (data) => getInterface(root, '/paper/', data, 'post', 'addSAQ'), //添加判断题
}