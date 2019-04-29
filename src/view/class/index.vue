<template>
  <div class="app-container classes">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="班级">
          <el-input v-model="listQuery.name" clearable style="width:250px;" @keyup.enter.native="getList" />
        </el-form-item>
        <el-button @click="handleReset"><svg-icon icon-class="btn-reset" />重置</el-button>
        <el-button @click="getList"><svg-icon icon-class="btn-search" />搜索</el-button>
      </el-form>
    </div>
    <div class="tool">
      <el-button @click="handleUpload"><i class="el-icon-upload"></i>导入</el-button>
      <el-button @click="handleDownLoad"><svg-icon icon-class="btn-download" />下载模板</el-button>
      <el-button @click="handleAdd"><svg-icon icon-class="btn-add" /> 创建班级</el-button>
    </div>
    <div class="data-container">
      <el-table v-loading="listLoading" max-height="350" :data="list" border highlight-current-row>
        <!-- <el-table-column type="selection" width="55" align="center">
        </el-table-column> -->
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column label="班级" prop="name" align="center">
        </el-table-column>
        <!-- <el-table-column label="学号" prop="" align="center">
        </el-table-column> -->
        <el-table-column label="姓名" prop="studentNames" align="center">
          <template slot-scope="{row}">
            <span>{{row.studentNames&&row.studentNames.join(',')}}</span>
          </template>
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
      <el-form label-width="80px" :model="formValues" ref="importForm" :rules="rules">
        <el-form-item label="班级" prop="classId">
          <el-select v-model="formValues.classId" placeholder="请选择">
            <el-option
              v-for="item in classesOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload ref="upload"
                    class="avatar-uploader"
                    action="/Exam/saq/import"
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
      <el-form label-width="80px" :model="addForm" ref="dataForm" :rules="rules" v-if="dialogVisible">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="addForm.name" clearable style="width:250px;" />
        </el-form-item>
        <el-form-item label="选择学生" prop="userIds">
          <el-select v-model="addForm.userIds" multiple placeholder="请选择">
            <el-option
              v-for="item in studentOptions"
              :key="item.userid"
              :label="item.name"
              :value="item.userid+''">
            </el-option>
          </el-select>
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
import classes from '@/commons/api/class'
import user from '@/commons/api/user'
import {classesRules} from '@/commons/utils/validate'
import { notify } from '@/commons/utils/notify'
export default {
  data(){
    return {
      listLoading:false,
      rules: classesRules,
      filesList: [],
      list: [],
      listQuery: {
        name: '',
        pageNum: 1,
        pageSize: 10,
      },
      addForm: {
        userIds: [],
        name: '',
        classId:undefined,
      },
      create: true,
      textMap:['添加班级','修改班级'],
      title:'',
      UpVisible: false,
      dialogVisible: false,
      total: undefined,
      formValues:{
        classId:'',
        type:3
      },
      classesOptions:[],
      studentOptions:[],
      tempIds:[]
    }
  },
  created() {
    this.getList()
    this.getStudentOption()
  },
  methods: {
    getList() {
      this.listLoading = true;
      // console.log(this.listQuery)
      classes.getClassList(this.listQuery).then(response => {
        var res = notify(this, response, true);
        if (res) {
          this.list = response.data.list;
          this.total = response.data.total;
          this.classesOptions = response.data.list;
        }
        this.listLoading = false;
      });
    },
    getStudentOption() {
      var role = {role: '学生'}
      user.getUser(role).then(response => {
        var res = notify(this, response, true);
        if (res) {
          this.studentOptions = response.data;
        }
      });
    },
    handleReset() {
      this.listQuery={
        pageNum: 1,
        pageSize: 10,
        name: '',
      }
      this.getList()
    },
    handleUpload() {
      this.UpVisible = true
    },
    submitUpload () {
      // classes.addClass(this.formValues)
      this.$refs.importForm.validate().then(res => { 
        this.$refs.upload.submit();
      
      }).catch(err => { console.log("失败了：" + err) })
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
          this.getStudentOption()
        }, 6000)
      }
      this.loading.close()
      this.UpVisible = false
      
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
      
      this.addForm = {
        userIds: [],
        name: '',
        classId:undefined,
      }
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          classes.addClass(this.addForm).then(response => {
            var res = notify(this, response)
            if (res) {
              this.dialogVisible = false
              this.getList()
              this.$refs["dataForm"].resetFields();
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.title = this.textMap[1]
      this.create = false
      this.addForm.classId=row.id
      this.addForm.name=row.name

      _.remove(this.addForm.userIds)
      _.assign(this.addForm.userIds ,row.studentIds)
      this.tempIds=row.studentIds
      this.$nextTick(()=>{
        this.dialogVisible = true
      })
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.addForm.deleteIds=_.filter(this.tempIds,(id)=>{
            return !this.addForm.userIds.includes(id)
          })
          classes.updateClass(this.addForm).then(response => {
            var res = notify(this, response)
            if (res) {
              this.dialogVisible = false
              this.getList()
              this.$refs["dataForm"].resetFields();
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
          ids: [row.id]
        }
        classes.deleteClass(deleteInfo).then(response => {
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
    handleDownLoad() {
      var url = `/Exam/saq/download?type=${3}`
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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

