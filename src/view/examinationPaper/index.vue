<template>
  <div class="app-container score">
    <!--筛选条件-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="科目">
          <el-input v-model="listQuery.subject" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <!-- <el-button @click="handleReset"><svg-icon icon-class="btn-reset" />重置</el-button> -->
        <el-button @click="handleFilter">搜索</el-button>
      </el-form>
    </div>
    <div class="data-container">
      <el-table v-loading="listLoading" max-height="600" :data="list" border highlight-current-row>
        <!-- <el-table-column type="selection" width="55" align="center">
        </el-table-column> -->
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column label="科目" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.subject }}</span>
          </template>
        </el-table-column>
        <el-table-column label="试卷总分" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单选题数量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.select }}</span>
          </template>
        </el-table-column>
        <el-table-column label="简答题数量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.SAQ }}</span>
          </template>
        </el-table-column>
          <el-table-column label="操作" align="center" width="230">
            <template slot-scope="scope">
              <el-button type="info" @click="handleUpdate">修改</el-button>
              <el-button type="info" @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      </div>
    <!--分页控件-->
    <div class="pagination-container">
        <el-pagination v-show="total>0" :current-page="listQuery.basePageVO.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.basePageVO.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Paper',
  data() {
    return {
      listQuery: {
        basePageVO:{
          pageNum: 1,
          pageSize: 10
        },
        subject:"",
      },
      total: 3,
      list:[
        {subject:'语文',
          score:'100',
          select:'20',
          SAQ:'5'
        },
        {subject:'数学',
          score:'100',
          select:'15',
          SAQ:'5',
        },
        {subject:'历史',
          score:'100',
          select:'25',
          SAQ:'3'
        },
      ],
      listLoading:false,
    }
  },
  methods: {
    handleFilter () {
    //前往到第一页
      this.searchData.pageNum = 1;
      this.getList();
    },
    //=====分页相关=====
    //控制每页显示条数
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.getList();
    },
    //跳转页码
    handleCurrentChange(val) {
      this.searchData.pageNum = val;
      this.getList();
    },
    getList() {

    },
    // handleUpdate(row) {
    //   this.$router.push({
    //     path:`/examinationPaper/updatePaper`,
    //     query: {
          
    //     }
    //   })
    // },
    handleUpdate() {
      debugger
      this.$router.push({
        // path: '/examinationPaper/updatePaper'
        name:'updatePaper'
      });
    },
    //刪除按钮操作
    handleDelete(row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          // var deleteRecordInfo = { ids: [row.id] };
          // deleteRecord(deleteRecordInfo).then(response => {
          //   var res = notify(this, response);
          //   if (res) {
          //     this.getList();
          //   }
          // });
        })
        .catch(() => {});
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>