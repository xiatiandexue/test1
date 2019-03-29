<template>
  <div class="select">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input v-model="listQuery.name" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="用户类型">
          <el-input v-model="listQuery.role" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button @click="handleReset">重置</el-button>
          <!-- <svg-icon icon-class="btn-reset" /> -->
        <el-button @click="handleFilter">搜索</el-button>
      </el-form>
    </div>
    <div class="tool">
      <el-button @click="handleCreate">添加</el-button>
    </div>
    <div class="data-container">
      <el-table v-loading="listLoading" max-height="350" :data="list" border highlight-current-row>
        <!-- <el-table-column type="selection" width="55" align="center">
        </el-table-column> -->
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column label="账号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.usercode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.role }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="scope">
            <el-button type="info" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button type="info" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页控件-->
    <div class="pagination-container">
        <el-pagination v-show="total>0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form label-width="80px" :model="temp" ref="dataForm" :rules="rules">
        <el-form-item label="账号" prop="usercode">
          <el-input v-model="temp.usercode" 
                    clearable
                    :disabled="disabled"
                    style="width:250px;" />
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="temp.name" clearable style="width:250px;" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" clearable style="width:250px;" />
        </el-form-item>
        <el-form-item label="用户类型" prop="role">
          <el-input v-model="temp.role" clearable style="width:250px;" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="this.create" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import user from '@/commons/api/user'
import { notify } from '@/commons/utils/notify'
import {userRules} from '@/commons/utils/validate'
export default {
  data () {
    return {
      listLoading:false,
      temp:{
        usercode:'',
        name:'',
        password:'',
        role:''
      },
      rules: userRules,
      listQuery:{
        pageNum: 1,
        pageSize: 10,
        name: '',
        role: ''
      },
      dialogVisible: false,
      list: [],
      total: 3,
      create: true,
      disabled: false,
      textMap:['添加用户信息','修改用户信息'],
      title:'',
    }
  },
  created(){
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      // console.log(this.listQuery)
      user.getUserPage(this.listQuery).then(response => {
        var res = notify(this, response, true);
        if (res) {
          this.list = response.data.list;
          this.total = response.data.total;
        }
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.getList()
    },
    handleReset() {
      this.listQuery={
        pageNum: 1,
        pageSize: 10,
        name: '',
        role: ''
      }
      this.getList()
    },
    handleCreate() {
      this.dialogVisible = true
      this.title = this.textMap[0]
      this.create = true
      this.disabled = false
      this.temp = {
        usercode:'',
        name:'',
        password:'',
        role:''
      }
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          user.addUser(this.temp).then(response => {
            var res = notify(this, response)
            if (res) {
              this.dialogVisible = false
              this.getList()
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.title = this.textMap[1]
      this.create = false
      this.disabled = true
      this.temp = row
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          user.updateUser(this.temp).then(response => {
            var res = notify(this, response)
            if (res) {
              this.dialogVisible = false
              this.getList()
            }
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        var deleteInfo = {
          usercode: row.usercode
        }
        user.deleteUser(deleteInfo).then(response => {
          var res = notify(this, response)
          if (res) {
            this.getList()
          }
        })
      }).catch(() => {})
    },
    //=====分页相关=====
    //控制每页显示条数
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    //跳转页码
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">

</style>


