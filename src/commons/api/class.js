import {
  getInterface
} from '@/commons/api/index'
var root = 'Exam'
export default {
  getClassList: (data) => getInterface(root, '/class/', data, 'get', ''), // 分页查询班级列表
  addClass: (data) => getInterface(root, '/class/', data, 'post', ''), // 添加班级
  updateClass: (data) => getInterface(root, '/class/', data, 'put', ''), // 修改班级
  deleteClass: (data) => getInterface(root, '/class/', data, 'delete', ''), // 删除班级
  importStudent: (data) => http('/exam/saq/import', data, 'post','import'), // 导入判断题
  downLoadClass: (data) => getInterface(root, '/saq/', data, 'get', 'download') // 下载模板
}