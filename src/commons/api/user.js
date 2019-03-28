import request, {fetch} from '@/commons/utils/request'

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