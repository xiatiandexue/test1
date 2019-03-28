<template>
  <div class="select">
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
            <span>{{ scope.row.singleSelect }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项一" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.choiceOne }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项二" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.choiceTwo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项三" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.choiceThree }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项四" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.choiceFour }}</span>
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
                    v-model="data.singleSelect" 
                    clearable
                    style="width:350px;" />
        </el-form-item>
        <el-form-item label="选项一">
          <el-input v-model="data.choiceOne" clearable style="width:250px;" />
        </el-form-item>
        <el-form-item label="选项二">
          <el-input v-model="data.choiceTwo" clearable style="width:250px;" />
        </el-form-item>
        <el-form-item label="选项三">
          <el-input v-model="data.choiceThree" clearable style="width:250px;" />
        </el-form-item>
        <el-form-item label="选项四">
          <el-input v-model="data.choiceFour" clearable style="width:250px;" />
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
        singleSelect: '',
        choiceOne: '',
        choiceTwo: '',
        choiceThree: '',
        choiceFour: ''
      },
      listQuery:{
        basePageVO:{
          pageNum: 1,
          pageSize: 10
        },
        singleSelect: ''
      },
      dialogVisible: false,
      list: [
        {
          singleSelect:'单选题一',
          choiceOne: '选项一',
          choiceTwo: '选项二',
          choiceThree: '选项三',
          choiceFour: '选项四'
        },
        {
          singleSelect:'单选题一',
          choiceOne: '选项一',
          choiceTwo: '选项二',
          choiceThree: '选项三',
          choiceFour: '选项四'
        },
      ],
      total: 3,

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


