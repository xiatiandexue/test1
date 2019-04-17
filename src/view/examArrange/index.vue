<template>
  <div class="app-container score">
    <!--筛选条件-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="科目">
          <el-input v-model="listQuery.subject" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="listQuery.class" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="时间">
            <el-date-picker v-model="listQuery.beginTime" type="date" placeholder="选择日期" :picker-options="beginTimeOptions">
            </el-date-picker>
            <span>~</span>
            <el-date-picker v-model="listQuery.endTime" type="date" placeholder="选择日期" :picker-options="endTimeOptions">
            </el-date-picker>
        </el-form-item>
        <el-form-item v-if="role == '管理员'" label="创建者">
          <el-input v-model="listQuery.createuser" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button @click="handleReset"><svg-icon icon-class="btn-reset" />重置</el-button>
        <el-button @click="handleFilter"><svg-icon icon-class="btn-search" />搜索</el-button>
      </el-form>
    </div>
    <div class="tool">
      <el-button @click="handleCreate"><svg-icon icon-class="btn-add" />添加</el-button>
    </div>
    <div class="data-container">
      <el-table v-loading="listLoading" max-height="400" :data="list" border highlight-current-row>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="subject" label="科目" align="center"></el-table-column>
        <el-table-column prop="name" label="考试名" align="center"></el-table-column>
        <el-table-column prop="" label="考试开始时间" align="center"></el-table-column>
        <el-table-column prop="" label="考试时长" align="center"></el-table-column>
        <el-table-column prop="" label="试卷名称" align="center"></el-table-column>
        <el-table-column prop="" label="考试班级" align="center"></el-table-column>
        <el-table-column prop="" label="考试状态" align="center"></el-table-column>
        <el-table-column prop="createuser" label="创建者" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="info" @click="handleUpdate(scope.row)"><svg-icon icon-class="btn-edit" />修改</el-button>
            <el-button type="info" @click="handleView(scope.row)"><svg-icon icon-class="btn-view" />试卷分析</el-button>
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
      title="title"
      :visible.sync="dialogVisible"
      width="45%">
      <el-form ref="form" :model="formValues" label-width="120px" :rules="rules">
        <tip-title title="基本信息"></tip-title>
        <el-row>
          <el-col :span="12">
            <el-form-item label="科目" prop="subject">
              <el-input v-model="formValues.subject"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考试名" prop="testname">
              <el-input v-model="formValues.testname"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="考试开始时间" prop="start">
              <el-date-picker v-model="formValues.start" type="date" placeholder="选择日期" :picker-options="beginTimeOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考试时长" prop="duration"><el-input v-model="formValues.duration"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="试卷名" prop="name">
              <el-select v-model="formValues.name">
                <el-option
                v-for="item in papername"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考试班级" prop="class">
              <el-select v-model="formValues.class">
                  <el-option
                  v-for="item in papername"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="考试状态" prop="status">
              <el-select v-model="formValues.status">
                  <el-option
                  v-for="item in papername"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人"><el-input v-model="formValues.saqscore"></el-input></el-form-item>
          </el-col>
        </el-row>
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
import paper from '@/commons/api/paper'
import { notify } from '@/commons/utils/notify'
import {examArrangeRules} from '@/commons/utils/validate'
import { getName } from "@/commons/utils/auth"
import { getRole } from "@/commons/utils/auth"
export default {
  name: 'Paper',
  components: {
    TipTitle,
  },
  data() {
    return {
      dialogVisible: false,
      role: getRole(),
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        subject: '',
        class:'',
        beginTime:'',
        endTime:'',
        createuser: '',
      },
      total: undefined,
      list:[],
      textMap:['添加考试安排','修改考试安排'],
      title:'',
      listLoading:false,
      rules: examArrangeRules,
      create: true,
      formValues:{},
    }
  },
  created () {
    this.getList()
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
    handleReset () {
      this.listQuery={
        pageNum: 1,
        pageSize: 10,
        quetion: '',
        createuser: ''
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
        this.listQuery.createuser = getName()
      }
      paper.getPaperPage(this.listQuery).then(response => {
        var res = notify(this, response, true);
        if (res) {
          this.list = response.data.list;
          this.total = response.data.total;
        }
        this.listLoading = false;
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
          paper.autoGenerating(this.Data).then(response => {
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
      this.dialogVisible = true
      this.title = this.textMap[1]
      this.create = false
      this.data = row
    },
    updateData() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          itemBank.updateSaq(this.data).then(response => {
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
          var deleteRecordInfo = { paperid: row.paperid };
          paper.deletePaper(deleteRecordInfo).then(response => {
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
          paperid: row.paperid
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>