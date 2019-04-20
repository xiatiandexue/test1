import {http} from '@/commons/utils/request'
/**
 * Created by jiachenpan on 16/11/18.
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime (time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

// 格式化时间
export function getQueryObject (url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen (val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

export function cleanArray (actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param (json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

export function param2Obj (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}

export function html2Text (val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge (target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

export function scrollTo (element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = (difference / duration) * 10
  setTimeout(() => {
    console.log(new Date())
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass (element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [{
  text: '今天',
  onClick (picker) {
    const end = new Date()
    const start = new Date(new Date().toDateString())
    end.setTime(start.getTime())
    picker.$emit('pick', [start, end])
  }
},
{
  text: '最近一周',
  onClick (picker) {
    const end = new Date(new Date().toDateString())
    const start = new Date()
    start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
    picker.$emit('pick', [start, end])
  }
},
{
  text: '最近一个月',
  onClick (picker) {
    const end = new Date(new Date().toDateString())
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    picker.$emit('pick', [start, end])
  }
},
{
  text: '最近三个月',
  onClick (picker) {
    const end = new Date(new Date().toDateString())
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
    picker.$emit('pick', [start, end])
  }
}
]

export function getTime (type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function uniqueArr (arr) {
  return Array.from(new Set(arr))
}

// 角色菜单列表转成菜单树
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  // 数组转成以下标为属性的对象
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  // 遍历数组
  for (var k = 0; k < data.length; k++) {
    // 获取有父级部门的子部门
    if (temp[data[k][pid]]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      // 获取父级部门
      res.push(data[k])
    }
  }
  return res
}

// 部门列表和用户列表转成部门用户树
export function treeDataTranslate2 (organList, userList, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}

  for (var j = 0; j < userList.length; j++) {
    // 获取用户的部门id
    var organId = userList[j].organId

    // 统一id和label的属性名称，elementUi tree组件的渲染需要
    userList[j].departmentId = userList[j].userCode
    userList[j].departmentName = userList[j].userName

    // 错误数据，没有部门的用户
    if (!organId) {
      continue
    }
    // 遍历所有部门
    for (var i = 0; i < organList.length; i++) {
      // 获取部门id
      var departmentId = organList[i].departmentId
      if (organId === departmentId) {
        if (!organList[i]['children']) {
          organList[i]['children'] = []
          // 添加用户到对应的部门下
          organList[i]['children'].push(userList[j])
        } else {
          organList[i]['children'].push(userList[j])
        }
      }
    }
  }

  console.log(organList)
  res = treeDataTranslate(organList, id = 'departmentId', pid = 'departmentSuperiorId')
  console.log(res)
  return res
}

export function getTreeCheckedNodes (data, id = 'menuId', roleId = 'roleId') {
  var res = []
  // 遍历数组
  for (var k = 0; k < data.length; k++) {
    // 获取有父级部门的子部门
    if (data[k][roleId]) {
      res.push(data[k][id])
    }
  }
  return res
}

// 验证字符串不是否包含中文且长度为32位
export function checkNumber (theObj) {
  var reg = /^[\u4e00-\u9fa5]/
  if (!reg.test(theObj) && theObj.length === 32) {
    return true
  }
  return false
}

export function isNotANumber (inputData) {
  // isNaN(inputData)不能判断空串或一个空格
  // 如果是一个空串或是一个空格，而isNaN是做为数字0进行处理的，而parseInt与parseFloat是返回一个错误消息，这个isNaN检查不严密而导致的。
  if (parseFloat(inputData).toString() === 'NaN') {
    // alert("请输入数字……");注掉，放到调用时，由调用者弹出提示。
    return false
  } else {
    return true
  }
}

// 更换js对象的属性名
export function removeFilePrefix (obj, oldName, newName) {
  return JSON.parse(JSON.stringify(obj).replace(/fileName/g, 'name').replace(/fileUrl/g, 'url'))
}

// 将文件对象的属性名中的‘doc’改成‘file’
export function docToFile (obj, oldName, newName) {
  return JSON.parse(JSON.stringify(obj).replace(/docId/g, 'fileId').replace(/docName/g, 'fileName').replace(/docUrl/g, 'fileUrl').replace(/docType/g, 'fileType'))
}

// 两个日期之间的天数
export function dateDiff (date1, date2) {
  var type1 = typeof date1,
    type2 = typeof date2
  if (type1 === 'string') {
    date1 = new Date(date1)
  } else if (date1.getTime) {
    date1 = date1.getTime()
  }
  if (type2 === 'string') {
    date2 = new Date(date2)
  } else if (date2.getTime) {
    date2 = date2.getTime()
  }
  return (date2 - date1) / 1000 / 60 / 60 / 24 // 除1000是毫秒，不加是秒
}

//
export function format (date, fmt) { // date 可以是new Date 、可以是时间戳可以是字符串形式的时间，format(date,'yyyy-MM-dd hh:mm:ss')
  if (!date) {
    return ''
  }
  var type = typeof date
  if (type === 'string' || type === 'number') {
    if (Number(date)) {
      date = new Date(Number(date))
    } else {
      date = new Date(date.replace(/-/g, '/').trim())
    }
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

export function formatDate (date) {
  var year = date.getFullYear() // 年
  var month = date.getMonth() + 1 // 月
  if (month < 10) {
    month = '0' + month
  }
  var day = date.getDate() // 日
  if (day < 10) {
    day = '0' + day
  }
  return year + '-' + month + '-' + day
}

export function datetime2Date (datetime) {
  if (!datetime) return ''
  return datetime.split(' ')[0]
}

export function filterParams (obj) {
  let _newPar = {}
  for (let key in obj) {
    // 如果对象属性的值不为空，就保存该属性（这里我做了限制，如果属性的值为0，保存该属性。如果属性的值全部是空格，属于为空。）
    if ((obj[key] === 0 || obj[key]) && obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
      // 记录属性
      _newPar[key] = obj[key]
    }
  }
  // 返回对象
  return _newPar
}

// 小数转百分数，默认不保留小数
export function toPercent (x, y, i) {
  if (!x || !y) {
    return '—'
  }
  var point = x / y
  if (!i) {
    return Number(point * 100) + '%'
  } else {
    return Number(point * 100).toFixed(i) + '%'
  }
}

export function downFile (url, name) {
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', name)
  link.setAttribute('target', '_self')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function postDownload (url, data, fileName, method) {
  http( // 用axios发送post请求
    url, // 请求地址
    data, // 参数
    method,
    'blob' // 表明返回服务器返回的数据类型
  ).then((res) => { // 处理返回的文件流
    const content = res
    const blob = new Blob([content])
    // if ('download' in document.createElement('a')) { // 非IE下载
    if ('msSaveOrOpenBlob' in navigator) {
      window.navigator.msSaveOrOpenBlob(
        new Blob([res]),
        fileName
      )
    } else {
      let url1 = window.URL.createObjectURL(new Blob([res]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url1

      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    }
    // } else { // IE10+下载
    //   navigator.msSaveBlob(blob, fileName)
    // }
  })
}
export function getDownload (url, name) {
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', name)
  link.setAttribute('target', '_self')
  window.open(url,'_self')
  document.body.appendChild(link)
  // if(document.all)    
  //         {
  //                //   IE里面触发

  //                link.click()               
  //         }         
  //         else  
  //         {  
  //               //   firefox 里面触发
  //                var event = document.createEvent("MouseEvents");  
  //                event .initEvent("click",true,true);  
  //                link.dispatchEvent(event );  
  //          }  
  
  document.body.removeChild(link)
}
