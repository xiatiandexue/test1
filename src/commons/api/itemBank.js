import {
  getInterface
} from '@/commons/api/index'
var root = 'Exam'
export default {
  //单选题
  getSelectPage: (data) => getInterface(root, '/select/', data, 'post', 'page'), // 分页查询单选题
  addSelect: (data) => getInterface(root, '/select/', data, 'post', ''), // 添加单选题
  updateSelect: (data) => getInterface(root, '/select/', data, 'put', ''), // 修改单选题
  deleteSelect: (data) => getInterface(root, '/select/', data, 'delete', ''), // 修改单选题
}