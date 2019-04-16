<template>
  <div class="select">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="学生姓名">
          <el-input v-model="listQuery.name" clearable style="width:250px;" @keyup.enter.native="getList" />
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="listQuery.class" clearable style="width:250px;" @keyup.enter.native="getList" />
        </el-form-item>
        <el-button @click="handleReset"><svg-icon icon-class="btn-reset" />重置</el-button>
        <el-button @click="getList"><svg-icon icon-class="btn-search" />搜索</el-button>
      </el-form>
    </div>
    <div class="tool">
      <el-button @click="handleUpload"><svg-icon icon-class="btn-send" /> 导入</el-button>
      <el-button @click="handleAdd"><svg-icon icon-class="btn-add" /> 添加</el-button>
    </div>
    <div class="data-container">
      <el-table v-loading="listLoading" max-height="350" :data="list" border highlight-current-row>
        <!-- <el-table-column type="selection" width="55" align="center">
        </el-table-column> -->
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column label="班级" prop="class" align="center">
        </el-table-column>
        <el-table-column label="学号" prop="" align="center">
        </el-table-column>
        <el-table-column label="姓名" prop="" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="scope">
            <el-button type="info" @click="handleUpdate(scope.row)"><svg-icon icon-class="btn-edit" /> 修改</el-button>
            <el-button type="info" @click="handleDelete(scope.row)"><svg-icon icon-class="btn-delete" /> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页控件-->
    <div class="pagination-container">
        <el-pagination v-show="total>0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog
      title="导入班级"
      :visible.sync="UpVisible"
      width="40%">
      <el-form label-width="80px" :model="temp" ref="dataForm" :rules="rules">
        <el-form-item label="班级" prop="name">
          <el-input v-model="temp.name" clearable style="width:250px;" />
        </el-form-item>
        <el-form-item label="上传文件" prop="fileList">
          <el-upload ref="upload"
                    class="avatar-uploader"
                    action="/app/waterquality/import"
                    :multiple="false"
                    :file-list="filesList"
                    :data="formValues"
                    drap
                    :show-file-list="true"
                    :on-success="uploadCallBack"
                    :before-upload="beforeAvatarUpload"
                    :auto-upload="false">
          <el-button slot="trigger"
                      size="small"
                      type="primary">选取文件</el-button>
          <!-- <el-button style="margin-left: 10px;"
                      size="small"
                      type="primary"
                      @click="submitUpload">上传到服务器</el-button> -->
          <div class="el-upload__tip"
                slot="tip">只能上传xls/xlsx文件</div>
        </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="UpVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
    </span>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form label-width="80px" :model="data" ref="dataForm" :rules="rules">
        <el-form-item label="班级" prop="class">
          <el-input v-model="data.class" clearable style="width:250px;" />
        </el-form-item>
        <el-form-item label="学号" prop="usercode">
          <el-input v-model="temp.usercode" 
                    clearable
                    :disabled="disabled"
                    style="width:250px;" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="data.name" clearable style="width:250px;" />
        </el-form-item>
        <el-form-item v-if="this.create" label="密码" prop="name">
          <el-input v-model="data.password" clearable style="width:250px;" />
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
export default {
  data(){
    return {
      listLoading:false,
      fileList: [],
      list: '',
      listQuery: {
        name: '',
        class: '',
        pageNum: 1,
        pageSize: 10,
      },
      temp: {
        name:'',
        fileList: []
      },
      data: {
        class: '',
        usercode: '',
        name: ''
      },
      create: true,
      textMap:['添加学生信息','修改学生信息'],
      title:'',
      UpVisible: false,
      dialogVisible: false,
      total: undefined,
    }
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
    handleReset() {
      this.listQuery={
        pageNum: 1,
        pageSize: 10,
        name: '',
        class: '',
      }
      this.getList()
    },
    handleUpload() {
      this.UpVisible = true
    },
    submitUpload () {
      this.$refs.importForm.validate().then(res => { this.$refs.upload.submit(); }).catch(err => { console.log("失败了：" + err) })
    },
    beforeAvatarUpload (file) {
      if (this.filesList.length > 0) {
        _.remove(this.filesList)
      }
      let names = file.name.split('.')
      let fileType = names[names.length - 1]
      const isExcel = fileType === "xls" || fileType === 'xlsx';
      if (!isExcel) {
        this.$notifyNative(this, "上传文件只能是 xls/xlsx 格式!", 'error')
      } else {
        this.loading = this.$loading({
          lock: true,
          text: "正在导入...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        setTimeout(() => {
          this.getList()
        }, 1000)
      }
      this.loading.close()
      this.importVisible = false
    },
    uploadCallBack (response, file, fileList) {
      var res = notify(this, response);
      _.remove(fileList)
    },
    handleAdd(){
      this.dialogVisible = true
      this.title = this.textMap[0]
      this.create = true
      this.disabled = false
      this.data = {
        class: '',
        usercode:'',
        name:'',
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
      this.data = row
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
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
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

