<template>
    <div class="app-container score">
        <!--筛选条件-->
        <div class="filter-container">
            <el-form :inline="true">
                <el-form-item label="科目">
                  <el-select v-model="listQuery.subject" placeholder="请选择科目">
                    <el-option label="大学语文" value="大学语文"></el-option>
                    <el-option label="中国古代历史" value="中国古代历史"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="考试名">
                  <el-input v-model="listQuery.examName" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
                </el-form-item>
                <el-form-item label="试卷名">
                  <el-input v-model="listQuery.paperName" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
                </el-form-item>
                <el-form-item label="班级" v-if="role != '学生'">
                  <el-select v-model="listQuery.classId" placeholder="请选择">
                    <el-option
                      v-for="item in classesOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-button @click="handleReset"><svg-icon icon-class="btn-reset" />重置</el-button>
                <el-button @click="handleFilter"><svg-icon icon-class="btn-search" />搜索</el-button>
            </el-form>
        </div>
        <!--工具栏-->
        <div class="operate-container" v-if="role != '学生'">
          <el-button @click="handleExport"><svg-icon icon-class="btn-download" />导出</el-button>
        </div>
        <!--表格数据-->
        <div class="data-container">
          <el-table v-loading="listLoading" max-height="350" :data="list" border highlight-current-row>
              <el-table-column type="index" label="序号" width="60" align="center">
              </el-table-column>
              <el-table-column label="科目" prop="subject" align="center">
              </el-table-column>
              <el-table-column label="考试名" prop="examName" align="center">
              </el-table-column>
              <el-table-column label="试卷名" prop="paperName" align="center">
              </el-table-column>
              <el-table-column label="考试时间" prop="beginTime" align="center">
                <template slot-scope="scope">
                  {{formatDate(scope.row.beginTime)}}
                </template>
              </el-table-column>
              <el-table-column label="班级" prop="className" align="center">
              </el-table-column>
              <el-table-column label="学号" prop="code" align="center">
              </el-table-column>
              <el-table-column label="姓名" prop="name" align="center">
              </el-table-column>
              <el-table-column label="成绩" prop="score" align="center">
              </el-table-column>
          </el-table>
        </div>
        <!--分页控件-->
        <div class="pagination-container">
            <el-pagination v-show="total>0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    
</template>
<script>
  import classes from '@/commons/api/class'
  import score from '@/commons/api/score'
  import {format} from '@/commons/utils'
  import { notify } from '@/commons/utils/notify'
  import { getUserId, getRole } from "@/commons/utils/auth"
  export default {
    name: '',
    data() {
      return {
          //过滤条件
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          subject:'',
          examName: '',
          paperName:'',
          classId: undefined,
          isStudent:false,
        },
        total:undefined,
        list:[],
        classesOptions:[],
        listLoading:false,
        role:getRole(),
      }
    },
    created(){
      this.getList()
      if(this.role != '学生'){
        this.getClassesOptions()
      }
    },
    methods: {
      //搜索
      handleFilter(){
        // this.listQuery.pageNum = 1;
        this.getList()
      },
      //重置
      handleReset () {
        this.listQuery = {
          pageNum: 1,
          pageSize: 10,
          subject:'',
          examName: '',
          paperName:'',
          classId: undefined,
          isStudent:false,
        },
        this.getList()
      },
      getList() {
        this.listLoading = true;
        // console.log(this.listQuery)
        if(getRole() == "学生") {
          this.listQuery.userId = getUserId()
          this.listQuery.isStudent = true
        }
        score.getGradePage(this.listQuery).then(response => {
          var res = notify(this, response, true);
          if (res) {
            this.list = response.data.list;
            this.total = response.data.total;
          }
          this.listLoading = false;
        });
      },
      getClassesOptions() {
        classes.getClassList(this.listQuery).then(response => {
          var res = notify(this, response, true);
          if (res) {
            this.classesOptions = response.data.list;
          }
          this.listLoading = false;
        });
      },
      handleExport () {
        if(!this.listQuery.classId) {
          var url = `/Exam/exam/download?subject=${this.listQuery.subject}&paperName=${this.listQuery.paperName}&examName=${this.listQuery.examName}&isStudent=${this.listQuery.isStudent}`
        } else {
          var url = `/Exam/exam/download?classId=${this.listQuery.classId}&subject=${this.listQuery.subject}&paperName=${this.listQuery.paperName}&examName=${this.listQuery.examName}&isStudent=${this.listQuery.isStudent}`
        }
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        // setTimeout(() => {
        //   loading.close();
        // }, 1000);
      },
      handleDownload () {
        score.downLoadGrade(this.listQuery)
      },
      formatDate(time) {
        var date = new Date(time);
        return format(date, 'yyyy-MM-dd hh:mm:ss');
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
.dictionary {
  /* 筛选面板 */
  .filter-container {
    margin-top: 20px;
    text-align: left;
  }
  /* 操作面板 */
  .operate-container {
    text-align: left;
  }
  /* 数据面板 */
  .data-container {
    margin-top: 20px;
  }
}
</style>