import request, {fetch} from '@/commons/utils/request'
import {
  getInterface
} from '@/commons/api/index'
var root = 'Exam'
export function loginByUsername (usercode, password,role) {
  const data = {
    usercode,
    password,
    role
  }
  return request({
    url: '/Exam/login',
    method: 'post',
    data
  })
}
export function logout () {
  return request({
    url: '/Exam/logout',
    method: 'get'
  })
}
export default {
 // 用户管理
 getUserPage: (data) => getInterface(root, '/users/', data, 'post', 'page'), // 分页查询用户
 addUser: (data) => getInterface(root, '/users/', data, 'post', ''), // 添加用户
 updateUser: (data) => getInterface(root, '/users/', data, 'put', ''), // 更新用户
 deleteUser: (data) => getInterface(root, '/users/', data, 'delete', ''), // 删除用户
 getUser: (data) => getInterface(root, '/users/', data, 'post', 'list')
}