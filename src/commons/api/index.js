import {
  http
} from '@/commons/utils/request'

import {
  notify
} from '@/commons/utils/notify'


// import {
//   getName
// } from '@/commons/utils/auth' // 获取登录的用户名称

export function getInterface (root, modules, data, method, action) {
  if (!action) {
    action = ''
  }
  var url = '/' + root + modules + action
  return http(url, data, method)
}

export default {
  // =====筛选条件相关=====
  // 重置按钮操作
  handleReset: function (obj) {
    obj.resetListQuery.pageSize = obj.listQuery.pageSize
    obj.listQuery = Object.assign({}, obj.resetListQuery)
    if (obj.getList) {
      obj.getList()
    }
  },

 

  // 获取列表数据
  getList: function (obj, modules, fun) {
    obj.listLoading = true // 显示加载标识
    modules[fun](obj.listQuery).then(response => {
      var res = notify(obj, response, true)
      if (res) {
        obj.list = response.data.list
        obj.total = response.data.total
      }
      obj.listLoading = false
    })
  },



  // 刪除按钮操作
  handleDelete: function (obj, modules, fun, row) {
    obj.$confirm('确认删除该记录吗?', '提示', {
      type: 'warning'
    }).then(() => {
      var deleteInfo = {
        ids: [row.id]
      }
      modules[fun](deleteInfo).then(response => {
        var res = notify(obj, response)
        if (res) {
          obj.getList()
        }
        // 删除过程后，重新加载过程列表
        if (fun === 'deleteProcess') {
          obj.getProcessList(obj.eventRow)
        }
      })
    }).catch(() => {})
  },


  // 控制每页显示条数
  handleSizeChange: function (obj, val) {
    obj.listQuery.pageSize = val
    obj.getList()
  },

  // 跳转页码
  handleCurrentChange: function (obj, val) {
    obj.listQuery.pageNum = val
    obj.getList()
  },

  // 重置表单项
  resetTemp: function (obj) {
    obj.temp = {}
    obj.temp.files = []
    obj.fileList = []
  },

  // 插入数据
  createData: function (obj, modules, fun) {
    obj.$refs['dataForm'].validate(valid => {
      if (valid) {
        // 插入文件列表
        modules[fun](obj.temp).then(response => {
          var res = notify(obj, response)
          if (res) {
            obj.dialogFormVisible = false
            obj.getList()
          }
        })
      }
    })
  },


  

  // 更新数据
  updateData: function (obj, modules, fun) {
    obj.$refs['dataForm'].validate(valid => {
      if (valid) {
        const tempData = Object.assign({}, obj.temp)

        // 没有文件时，后台返回时null;回传到后台需变成[]
        if (!tempData.files) {
          tempData.files = []
        }
        modules[fun](tempData).then(response => {
          var res = notify(obj, response)
          if (res) {
            obj.dialogFormVisible = false
            obj.getList()
          }
        })
      }
    })
  },
}
  
