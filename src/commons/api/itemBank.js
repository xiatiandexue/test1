import {
  getInterface
} from '@/commons/api/index'
import request, {
  http
} from '@/commons/utils/request'
var root = 'Exam'
export default {
  //单选题
  getSelectPage: (data) => getInterface(root, '/select/', data, 'post', 'page'), // 分页查询单选题
  addSelect: (data) => getInterface(root, '/select/', data, 'post', ''), // 添加单选题
  updateSelect: (data) => getInterface(root, '/select/', data, 'put', ''), // 修改单选题
  deleteSelect: (data) => getInterface(root, '/select/', data, 'delete', ''), // 修改单选题
  importSelect: (data) => http('/exam/select/import', data, 'post', 'import'), // 导入单选题
  downLoadSelect: (data) => getInterface(root, '/saq/', data, 'get', 'download'), // 下载模板
  //判断题
  getSaqPage: (data) => getInterface(root, '/saq/', data, 'post', 'page'),
  addSaq: (data) => getInterface(root, '/saq/', data, 'post', ''),
  updateSaq: (data) => getInterface(root, '/saq/', data, 'put', ''),
  deleteSaq: (data) => getInterface(root, '/saq/', data, 'delete', ''),
  importSAQ: (data) => http('/exam/saq/import', data, 'post','import'), // 导入判断题
  downLoadSaq: (data) => getInterface(root, '/saq/', data, 'get', 'download'), // 下载模板
}