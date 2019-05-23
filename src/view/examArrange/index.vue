<template>
  <div class="app-container examArrange">
    <!--筛选条件-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="考试名">
          <el-input v-model="listQuery.examName" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="试卷名">
          <el-input v-model="listQuery.paperName" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="listQuery.classId" placeholder="请选择">
            <el-option
              v-for="item in classesOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试状态">
          <el-select v-model="listQuery.status" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="时间">
            <el-date-picker v-model="listQuery.beginTime" type="date" placeholder="选择日期" :picker-options="beginTimeOptions">
            </el-date-picker>
            <span>~</span>
            <el-date-picker v-model="listQuery.endTime" type="date" placeholder="选择日期" :picker-options="endTimeOptions">
            </el-date-picker>
        </el-form-item> -->
        <el-form-item v-if="role == '管理员'" label="创建者">
          <el-input v-model="listQuery.createName" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button @click="handleReset"><svg-icon icon-class="btn-reset" />重置</el-button>
        <el-button @click="handleFilter"><svg-icon icon-class="btn-search" />搜索</el-button>
      </el-form>
    </div>
    <div class="tool">
      <el-button @click="handleCreate"><svg-icon icon-class="btn-add" />添加</el-button>
    </div>
    <div class="data-container">
      <el-table v-loading="listLoading" max-height="350" :data="list" border highlight-current-row>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="subject" label="科目" align="center"></el-table-column>
        <el-table-column prop="examName" label="考试名" align="center"></el-table-column>
        <el-table-column prop="beginTime" label="考试开始时间" align="center">
          <template slot-scope="scope">
            {{formatDate(scope.row.beginTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="center">
          <template slot-scope="scope">
            {{formatDate(scope.row.endTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="paperName" label="试卷名称" align="center">
        </el-table-column>
        <el-table-column prop="classIds" label="考试班级" align="center">
          <template slot-scope="scope">
            <span v-text="getClassNameById(scope.row.classIds)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="考试状态" align="center">
          <template slot-scope="scope">
            <span v-text="getStatusById(scope.row.status)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="创建者" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button v-if="(scope.row.status == '1')" type="info" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="(scope.row.status == '3')" type="info" @click="handleView(scope.row)">试卷分析</el-button>
            <el-button v-if="(scope.row.status == '1')" type="info" @click="handleDelete(scope.row)">删除</el-button>
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
      width="55%">
      <el-form ref="form" :model="formValues" label-width="120px" :rules="rules">
        <tip-title title="基本信息"></tip-title>
        <el-row>
          <el-col :span="12">
            <el-form-item label="科目" prop="subject">
              <el-select v-model="formValues.subject" placeholder="请选择科目">
                <el-option label="大学语文" value="大学语文"></el-option>
                <el-option label="中国古代历史" value="中国古代历史"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考试名" prop="examName">
              <el-input v-model="formValues.examName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="考试开始时间" prop="beginTime" class="beginTime">
              <el-date-picker v-model="formValues.beginTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考试结束时间" prop="endTime" class="beginTime">
              <el-date-picker v-model="formValues.endTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="试卷名" prop="paperId">
              <el-select
                v-model="formValues.paperId"
                placeholder="请选择">
                <el-option
                  v-for="item in paperOptions"
                  :key="item.paperid"
                  :label="item.name"
                  :value="item.paperid">
                </el-option>
              </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考试班级" prop="classIds">
              <el-select v-model="formValues.classIds" multiple placeholder="请选择">
              <el-option
                v-for="item in classesOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id+''">
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="创建人"><el-input v-model="formValues.saqscore"></el-input></el-form-item>
          </el-col>
        </el-row> -->
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
import TipTitle from '@/components/TipTitle'
import exam from '@/commons/api/exam'
import classes from '@/commons/api/class'
import { notify } from '@/commons/utils/notify'
import {examArrangeRules} from '@/commons/utils/validate'
import { getName,getUserId,getRole } from "@/commons/utils/auth"
import {format} from '@/commons/utils'
export default {
  name: 'Paper',
  components: {
    TipTitle,format
  },
  data() {
    return {
      dialogVisible: false,
      role: getRole(),
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        examName: undefined,
        paperName: undefined,
        status: undefined,
        classId:'',
        createName: undefined,
      },
      total: undefined,
      list:[],
      textMap:['添加考试安排','修改考试安排'],
      title:'',
      listLoading:false,
      rules: examArrangeRules,
      create: true,
      formValues:{
        createUser:getUserId(),
        subject:'',
      },
      paperName:[],
      statusOptions: [
        {value: "1", label: '未开始' },
        {value: "2", label: '进行中' },
        {value: "3", label: '已结束' },
      ],
      classesOptions:[],
      paperOptions:[],
      subject:"",
    }
  },
  watch: {
    'formValues.subject':{
      handler(newSubject,oldSubject){
        var info = {subject:newSubject}
        exam.getPaperOptions(info).then(response => {
          this.paperOptions = response.data
        })
      },
      deep: true
    }
  },
  created () {
    this.getClassesOptions()
    this.$nextTick(() => {
      this.getList()
    })
  },
  computed:{
    endTimeOptions(){
      let that=this
      return {
        disabledDate (time) {
          return that.listQuery.beginTime !== '' ? time.getTime() > new Date(that.listQuery.beginTime) : false;
        }
      }
    },
    beginTimeOptions(){
      let that=this
      return {
          disabledDate(time) {
            if(that.listQuery.endTime){
              return time.getTime()>new Date(that.listQuery.endTime);
            }else{
              return false;
            }
          }
        }
    },
  },
  methods: {
    formatDate(time) {
      var date = new Date(time);
      return format(date, 'yyyy-MM-dd hh:mm:ss');
    },
    handleReset () {
      this.listQuery={
        pageNum: 1,
        pageSize: 10,
        examName: undefined,
        paperName: undefined,
        status: undefined,
        classId:undefined,
        createName: undefined,
      }
      this.getList()
    },
    handleFilter () {
    //前往到第一页
      this.listQuery.pageNum = 1;
      this.getList();
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
    getList() {
      this.listLoading = true;
      // console.log(this.listQuery)
      if(this.role == '教师'){
        this.listQuery.createName = getName()
      }
      exam.getExamList(this.listQuery).then(response => {
        var res = notify(this, response, true);
        if (res) {
          this.list = response.data.list;
          this.total = response.data.total;
        }
        this.listLoading = false;
      });
    },
    //获取班级列表
    getClassesOptions() {
      var info = {pageNum: 1,pageSize: 100,}
      classes.getClassList(info).then(response => {
        var res = notify(this, response, true);
        if (res) {
          this.classesOptions = response.data.list;
        }
      });
    },
    handleCreate(){
      this.title = this.textMap[0]
      this.create = true
      // this.data.createuser = getName()
      this.dialogVisible = true
    },
    createData() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          exam.addExam(this.formValues).then(response => {
            var res = notify(this, response)
            if (res) {
              this.dialogVisible = false
              this.getList()
              this.$refs[form].resetFields();//重置表单
              
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.title = this.textMap[1]
      this.create = false
      this.formValues = row
      this.formValues.beginTime = new Date(row.beginTime)
      this.formValues.endTime = new Date(row.endTime)
      this.dialogVisible = true
    },
    updateData() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formValues.beginTime = format(this.formValues.beginTime, 'yyyy-MM-dd hh:mm:ss')
          this.formValues.endTime = format(this.formValues.endTime, 'yyyy-MM-dd hh:mm:ss')
          this.formValues.createUser = this.formValues.userId
          console.log(this.formValues.createUser)
          exam.updateExam(this.formValues).then(response => {
            var res = notify(this, response)
            if (res) {
              this.dialogVisible = false
              this.getList()
              this.$refs[form].resetFields();//重置表单
            }
          })
        }
      })
    },
    //刪除按钮操作
    handleDelete(row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          var deleteRecordInfo = { ids: [row.examId] };
          exam.deleteExam(deleteRecordInfo).then(response => {
            var res = notify(this, response);
            if (res) {
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    handleView(row) {
      this.$router.push({
        path:`/paperAnalysis`,
        query: {
          paperId: row.paperId,
          examId: row.examId
        }
      })
    },
    //通过id获取考试状态
    getStatusById(id) {
      var name = ''
      var typeList = this.statusOptions
      for (var type of typeList) {
        if(type.value === id) {
          name = type.label
          break
        }
      }
      return name
    },
    //通过id获取班级名称
    getClassNameById(ids) {
      var names = []
      var typeList = this.classesOptions
      for (var type of typeList) {
        for(var i = 0; i < ids.length; i++) {
          if(type.id+'' === ids[i]) {
            names[i] = type.name
            break
          }

        }
      }
      return names.join(",")
    },
    //远程查找试卷
    // remoteMethod(query) {
    //     if (query !== '') {
    //       setTimeout(() => {
    //         debugger
    //         exam.getPaperOptions(this.formValues.subject).then(response => {
    //           this.paperOptions = response.data.list
    //         })
    //       }, 200);
    //     } else {
    //       this.paperOptions = [];
    //     }
    //   }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.examArrange{
  // .beginTime{
  //   .el-date-editor.el-input, .el-date-editor.el-input__inner {
  //     width: 164px;
  //   }
  // }
}
</style>