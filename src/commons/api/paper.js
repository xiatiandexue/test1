import {
  getInterface
} from '@/commons/api/index'
var root = 'Exam'
export default {
  //自动生成试卷
  autoGenerating: (data) => getInterface(root, '/paper/', data, 'post', 'autoGenerating'),
}