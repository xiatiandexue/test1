/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return true
}

/* 合法uri */
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母 */
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}
let ChangeTrigger = true
// 非空校验
const reqf = (name, changeTrigger) => {
  return {
    required: true,
    message: `${name}不能为空`,
    trigger: changeTrigger ? 'change' : 'blur'
  }
}
// 长度校验
const lenf = (min, max) => {
  return {
    min: min || 0,
    max: max || 30,
    message: `长度必须在${min || 0}到${max || 30}个字符之间`,
    trigger: 'blur'
  }
}

// 数字或带小数点数字校验
const numpf = (name) => {
  const re = /^\d+(\.\d+)?$/
  var validate = (rule, value, callback) => {
    if (re.test(value)) {
      callback()
    } else {
      callback(new Error('只能填写数字!'))
    }
  }
  return {
    validator: validate,
    trigger: 'blur'
  }
}

// 手机号码校验
const phonef = (name) => {
  const re = /^1[34578]\d{9}$/
  var validate = (rule, value, callback) => {
    if (re.test(value)) {
      callback()
    } else {
      callback(new Error('请正确填写手机号码!'))
    }
  }
  return {
    validator: validate,
    trigger: 'blur'
  }
}

// 纯数字校验
const numf = (name) => {
  const re = /^[0-9]*$/
  var validate = (rule, value, callback) => {
    if (re.test(value)) {
      callback()
    } else {
      callback(new Error('只能填写数字!'))
    }
  }
  return {
    validator: validate,
    trigger: 'blur'
  }
}

// 特殊字符校验
const specif = (name) => {
  var specialKey = "[`~!#$^&%*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
  var validate = (rule, value, callback) => {
    for (var i = 0; i < value.length; i++) {
      if (specialKey.indexOf(value.substr(i, 1)) !== -1) {
        callback(new Error('不能包含特殊字符!'))
      } else {
        callback()
      }
    };
  }
  return {
    validator: validate,
    trigger: 'blur'
  }
}

export const rules = {
  req: {
    required: true,
    message: name + '不能为空',
    trigger: 'blur'
  },
  len: {
    min: 1,
    max: 32,
    message: '长度必须在1到32个字符之间',
    trigger: 'blur'
  },
  email: {
    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: '邮件格式不正确',
    trigger: 'blur'
  },
  

}


export const userRules = {
  usercode: [reqf('账号'), lenf(6, 20)],
  name: [reqf('姓名'), lenf()],
  // password: [reqf('密码'), lenf(8, 32)],
  role: [reqf('用户类型', true)]
}

export const selectRules = {
  question: [reqf('题目')],
  choiceone: [reqf('选项一')],
  choicetwo: [reqf('选项二')],
  choicethree: [reqf('选项三')],
  choicefour: [reqf('选项四')],
  answer: [reqf('答案')],
  score: [reqf('分值'), numf()],
  subject: [reqf('科目')],
  chapter: [reqf('章节')],
  difficulty: [reqf('难度')]
}
export const saqRules = {
  question: [reqf('题目')],
  answer: [reqf('参考答案')],
  subject: [reqf('科目')],
  chapter: [reqf('章节')],
  difficulty: [reqf('难度')],
  score: [reqf('分值'), numf()],
}
export const autoGeneratingPaperRules = {
  subject: [reqf('科目')]
}
export const classesRules = {
  name: [reqf('班级')]
}
export const examArrangeRules = {
  subject: [reqf('科目')],
  testname: [reqf('考试名')],
  start: [reqf('考试开始时间')],
  duration: [reqf('考试时长')],
  name: [reqf('试卷名')],
  class: [reqf('考试班级')],
  status: [reqf('考试状态')],
  createuser: [reqf('创建人')]
}

