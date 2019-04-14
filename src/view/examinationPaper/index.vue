<template>
  <div class="app-container score">
    <!--筛选条件-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="科目">
          <el-input v-model="listQuery.subject" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item v-if="role == '管理员'" label="创建者">
          <el-input v-model="listQuery.createuser" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button @click="handleReset"><svg-icon icon-class="btn-reset" />重置</el-button>
        <el-button @click="handleFilter"><svg-icon icon-class="btn-search" />搜索</el-button>
      </el-form>
    </div>
    <div class="tool">
      <el-button @click="dialogVisible = true"><svg-icon icon-class="btn-add" />添加</el-button>
    </div>
    <div class="data-container">
      <el-table v-loading="listLoading" max-height="400" :data="list" border highlight-current-row>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="name" label="试卷名称" align="center"></el-table-column>
        <el-table-column prop="subject" label="科目" align="center"></el-table-column>
        <el-table-column prop="score" label="试卷总分" align="center"></el-table-column>
        <el-table-column prop="totalselect" label="单选题总数" align="center"></el-table-column>
        <el-table-column prop="selectnum" label="单选题数量" align="center"></el-table-column>
        <el-table-column prop="selectscore" label="单选题分数" align="center"></el-table-column>
        <el-table-column prop="totalsaq" label="判断题总数" align="center"></el-table-column>
        <el-table-column prop="saqnum" label="判断题数量" align="center"></el-table-column>
        <el-table-column prop="saqscore" label="判断题分数" align="center"></el-table-column>
        <el-table-column prop="createuser" label="创建者" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
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
      title="自动组卷"
      :visible.sync="dialogVisible"
      width="45%">
      <el-form ref="form" :model="Data" label-width="120px" rules="rules">
        <tip-title title="基本信息"></tip-title>
        <el-row>
          <el-form-item label="试卷名" prop="name">
            <el-input v-model="Data.name"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="科目" prop="subject">
              <el-select v-model="Data.subject" placeholder="请选择科目">
                <el-option label="语文" value="语文"></el-option>
                <el-option label="历史" value="历史"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试卷总分"><el-input v-model="Data.score"></el-input></el-form-item>
          </el-col>
        </el-row>
        <tip-title title="试卷信息"></tip-title>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单选题总数"><el-input v-model="Data.totalselect"></el-input></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="判断题总数"><el-input v-model="Data.totalsaq"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单选题分数"><el-input v-model="Data.selectscore"></el-input></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="判断题分数"><el-input v-model="Data.saqscore"></el-input></el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
            <el-col :span="23">
              <el-button type="primary" @click="handleCreate" style="float:right;">生成试卷</el-button>
            </el-col>
        </el-row> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreate">生成试卷</el-button>
        <!-- <el-button v-if="this.create" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button> -->
    </span>
    </el-dialog>
  </div>
</template>

<script>
import TipTitle from '@/components/TipTitle'
import paper from '@/commons/api/paper'
import { notify } from '@/commons/utils/notify'
import {autoGeneratingPaperRules} from '@/commons/utils/validate'
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
        createuser: ''
      },
      total: undefined,
      list:[],
      Data: {
        name: '',
        subject: '',
        score: '',
        selectnum: '',
        saqnum: '',
        createuser: getName()
      },
      listLoading:false,
      rules: autoGeneratingPaperRules
    }
  },
  activated () {
    this.getList()
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
    handleCreate() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          paper.autoGenerating(this.Data).then(response => {
            var res = notify(this, response)
            if (res) {
              this.dialogVisible = false
              this.getList()
              this.Data = {
                name: '',
                subject: '',
                score: '',
                selectnum: '',
                saqnum: '',
                createuser: getName()
              }
              
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.$router.push({
        path:`/examinationPaper/updatePaper`,
        query: {
          paperid: row.paperid
        }
      })
    },
    // handleUpdate() {
    //   this.$router.push({
    //     // path: '/examinationPaper/updatePaper'
    //     name:'updatePaper'
    //   });
    // },
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
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>