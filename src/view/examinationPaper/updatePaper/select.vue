<template>
  <div class="addSelect">
    <span class="back">
      <el-button type="primary" @click="handleBack">返回修改试卷页面</el-button>
    </span>
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="题目">
          <el-input v-model="listQuery.question" clearable style="width:250px;"  />
        </el-form-item>
        <el-form-item label="章节">
          <el-input v-model="listQuery.chapter" clearable style="width:250px;"/>
        </el-form-item>
        <!-- <svg-icon icon-class="btn-reset" /> -->
        <el-button @click="handleReset"><svg-icon icon-class="btn-reset" />重置</el-button>
        <el-button @click="handleFilter"><svg-icon icon-class="btn-search" />搜索</el-button>
      </el-form>
    </div>
    <div class="data-container">
      <el-table v-loading="listLoading" max-height="400" :data="list" border highlight-current-row>
        <!-- <el-table-column type="selection" width="55" align="center">
        </el-table-column> -->
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column label="题目" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.question }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项一" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.choiceone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项二" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.choicetwo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项三" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.choicethree }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项四" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.choicefour }}</span>
          </template>
        </el-table-column>
        <el-table-column label="答案" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.answer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="科目" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.subject }}</span>
          </template>
        </el-table-column>
        <el-table-column label="章节" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.chapter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="难度" align="center">
          <template slot-scope="scope">
            <span v-text="getDifficultyById(scope.row.difficulty)"></span>
          </template>
        </el-table-column>
        <el-table-column label="创建者" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createuser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="scope">
            <el-button type="primary" @click="add(scope.row)">添加</el-button>
          </template>
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
import itemBank from '@/commons/api/itemBank'
import paper from '@/commons/api/paper'
import { notify } from '@/commons/utils/notify'
import { getName } from "@/commons/utils/auth";
export default {
  data () {
    return {
      listLoading:false,
      data: {
        question: '',
        choiceOne: '',
        choiceTwo: '',
        choiceThree: '',
        choiceFour: '',
        subject: '',
        chapter: '',
        score: undefined,
        difficulty: undefined,
        answer: '',
        createuser: ''
      },
      listQuery:{
        pageNum: 1,
        pageSize: 10,
        quetion: '',
        subject: '',
        chapter: ''
      },
      dialogVisible: false,
      list: [],
      total: undefined,
      create: true,
      textMap:['添加单选题','修改单选题'],
      title:'',
      options: [
        {value: 1, label: '简单' },
        {value: 2, label: '一般' },
        {value: 3, label: '困难' },
      ],
      paperid: '',
    }
  },
  activated(){
    this.paperid = this.$route.query.paperid;
    this.listQuery.subject = this.$route.query.subject;
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      // console.log(this.listQuery)
      this.listQuery.paperId = this.paperid
      itemBank.getSelectPage(this.listQuery).then(response => {
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
        subject: this.$route.query.subject,
        chapter: ''
      }
      this.getList()
    },
    handleBack() {
      this.$router.push({
        path:`/examinationPaper/updatePaper`,
        query: {
          paperid: this.paperid
        }
      })
    },
    add(row) {
      var addInfo = { questionid: row.questionid, paperid: this.paperid };
      paper.addSelect(addInfo).then(response => {
        var res = notify(this, response, true);
        if (res) {
          this.$router.push({
            path:`/examinationPaper/updatePaper`,
            query: {
              paperid: this.paperid
            }
          })
        }
      })
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
.addSelect{
  .back{
    position: fixed;
    top: 10vh;
    right:5vh;
  }
}
</style>


