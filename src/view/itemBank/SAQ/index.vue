<template>
  <div class="app-container SAQ">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="题目">
          <el-input v-model="listQuery.question" clearable style="width:150px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="科目">
          <el-input v-model="listQuery.subject" clearable style="width:150px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="章节">
          <el-input v-model="listQuery.chapter" clearable style="width:150px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item v-if="role == '管理员'" label="创建者">
          <el-input v-model="listQuery.createuser" clearable style="width:150px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button @click="handleReset"><svg-icon icon-class="btn-reset" />重置</el-button>
        <el-button @click="handleFilter"><svg-icon icon-class="btn-search" />搜索</el-button>
      </el-form>
    </div>
    <div class="tool">
      <el-button @click="handleCreate"><svg-icon icon-class="btn-add" />添加</el-button>
      <el-button @click="handleDownLoad"><svg-icon icon-class="btn-download" />下载模板</el-button>
      <el-button @click="handleImport"><i class="el-icon-upload"></i>导入</el-button>
    </div>
    <div class="data-container">
      <el-table v-loading="listLoading" max-height="350" :data="list" border highlight-current-row>
        <!-- <el-table-column type="selection" width="55" align="center">
        </el-table-column> -->
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column prop="question" label="题目" align="center">
        </el-table-column>
        <el-table-column prop="answer" label="参考答案" align="center">
        </el-table-column>
        <el-table-column prop="subject" label="科目" align="center"></el-table-column>
        <el-table-column prop="chapter" label="章节" align="center"></el-table-column>
        <el-table-column label="难度" align="center">
          <template slot-scope="scope">
            <span v-text="getDifficultyById(scope.row.difficulty)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="createuser" label="创建者" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="scope">
            <el-button type="info" @click="handleUpdate(scope.row)"><svg-icon icon-class="btn-edit" />修改</el-button>
            <el-button type="info" @click="handleDelete(scope.row)"><svg-icon icon-class="btn-delete" />删除</el-button>
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
      width="45%">
      <el-form label-width="80px" :model="data" ref="dataForm" :rules="rules">
        <el-form-item label="题目" prop="question">
          <el-input type="textarea"
                    autosize 
                    v-model="data.question" 
                    clearable
                    style="width:350px;" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="科目" prop="subject">
              <el-input v-model="data.subject" clearable style="width:200px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="章节" prop="chapter">
              <el-input v-model="data.chapter" clearable style="width:200px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="答案" prop="answer">
              <el-select v-model="data.answer" placeholder="请选择答案">
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="data.difficulty" clearable placeholder="请选择难度" >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!-- <el-input v-model="data.difficulty" clearable style="width:100px;" /> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="this.create" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
    </span>
    </el-dialog>
    <el-dialog :visible.sync="importVisible"
                  :append-to-body='true'
                 width="40%">
      <div style="margin:0rem 1rem;">
        <el-form ref="importForm"
                  :rules="rules"
                  :model="data"
                  label-width="80px"
                  label-position="center">
          <!-- <tip-title title="一、导入信息">
            <el-row>
              <el-col :span="12">
                <el-form-item label="科目"
                              prop="subject">
                  <el-input v-model="data.subject" clearable style="width:200px;" />
                </el-form-item>
              </el-col>
            </el-row>
          </tip-title> -->
          <tip-title title="二、上传数据">
            <div style="overflow:hidden;">
              <div style="height:28px;line-height:28px;width:100px;float:left;font-weight:bold;">上传文件：</div>
              <div style="float:left;">
                <el-upload ref="upload"
                            class="avatar-uploader"
                            action="/Exam/saq/import"
                            :multiple="false"
                            :file-list="filesList"
                            :data="formValue"
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
              </div>
            </div>
          </tip-title>
        </el-form>
        <div slot="footer"
              class="dialog-footer">
          <el-button @click="submitUpload"
                      type="primary">上传</el-button>
          <el-button @click="importVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import itemBank from '@/commons/api/itemBank'
import { notify } from '@/commons/utils/notify'
import {saqRules} from '@/commons/utils/validate'
import { getName } from "@/commons/utils/auth"
import { getRole } from "@/commons/utils/auth"
import TipTitle from "@/components/TipTitle";
export default {
  components:{TipTitle},
  data () {
    return {
      listLoading:false,
      rules: saqRules,
      role: getRole(),
      data: {
        question: '',
        answer: '',
        subject: '',
        chapter: '',
        difficulty: undefined,
        score: undefined,
        createuser: ''
      },
      listQuery:{
        pageNum: 1,
        pageSize: 10,
        question: '',
        subject: '',
        chapter: '',
        createuser: ''
      },
      formValue:{type:1},
      dialogVisible: false,
      list: [],
      total: undefined,
      create: true,
      textMap:['添加简答题','修改简答题'],
      title:'',
      options: [
        {value: 1, label: '简单' },
        {value: 2, label: '一般' },
        {value: 3, label: '困难' },
      ],
      importVisible: false,
      filesList: [],
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      // console.log(this.listQuery)
      if(this.role == '教师'){
        this.listQuery.createuser = getName()
      }
      itemBank.getSaqPage(this.listQuery).then(response => {
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
        quetion: '',
      }
      this.getList()
    },
    handleCreate() {
      this.title = this.textMap[0]
      this.create = true
      this.data = {
        question: '',
        answer: '',
        subject: '',
        chapter: '',
        difficulty: undefined,
        score: undefined,
      }
      this.data.createuser = getName()
      this.dialogVisible = true

    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          itemBank.addSaq(this.data).then(response => {
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
          itemBank.updateSaq(this.data).then(response => {
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
          saqid: row.saqid
        }
        itemBank.deleteSaq(deleteInfo).then(response => {
          var res = notify(this, response)
          if (res) {
            this.getList()
          }
        })
      }).catch(() => {})
    },
    getDifficultyById(id) {
      var name = ''
      var typeList = this.options
      for (var type of typeList) {
        if(type.value === id) {
          name = type.label
          break
        }
      }
      return name
    },
    //导入数据
    handleImport(){
      this.importVisible = true
    },
    submitUpload () {
      this.$refs.importForm.validate().then(res => { this.$refs.upload.submit(); }).catch(err => { console.log("失败了：" + err) })
      this.getList()
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
    handleDownLoad() {
      var url = `/Exam/saq/download?type=${1}`
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


