<template>
  <div class="SAQ">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="题目">
          <el-input v-model="listQuery.singleSelect" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <!-- <el-button @click="handleReset"><svg-icon icon-class="btn-reset" />重置</el-button> -->
        <el-button @click="handleFilter">搜索</el-button>
      </el-form>
    </div>
    <div class="tool">
      <el-button @click="dialogVisible = true">添加</el-button>
    </div>
    <div class="data-container">
      <el-table v-loading="listLoading" max-height="600" :data="list" border highlight-current-row>
        <!-- <el-table-column type="selection" width="55" align="center">
        </el-table-column> -->
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column label="题目" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.SAQ }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参考答案" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.answer }}</span>
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
    <el-dialog
      title="添加单选题"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form label-width="80px">
        <el-form-item label="题目" >
          <el-input type="textarea"
                    autosize 
                    v-model="data.SAQ" 
                    clearable
                    style="width:350px;" />
        </el-form-item>
        <el-form-item label="参考答案">
          <el-input type="textarea"
                    autosize 
                    v-model="data.answer" 
                    clearable
                    style="width:350px;" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      listLoading:false,
      data: {
        SAQ: '',
        answer: '',
      },
      listQuery:{
        basePageVO:{
          pageNum: 1,
          pageSize: 10
        },
        SAQ: ''
      },
      dialogVisible: false,
      list: [
        {
          SAQ:'简答题一',
          answer: '参考答案'
        },
        {
          SAQ:'简答题一',
          answer: '参考答案'
        },
      ],
      total: 2,

    }
  },
  methods: {
    handleFilter() {

    },
    handleUpdate() {

    },
    handleDelete(row) {

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
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">

</style>


