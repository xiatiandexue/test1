<template>
    <div class="app-container score">
        <!--筛选条件-->
        <div class="filter-container">
            <el-form :inline="true">
                <el-form-item label="科目">
                 <el-input v-model="listQuery.subject" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
                </el-form-item>
                <!-- <el-button @click="handleReset"><svg-icon icon-class="btn-reset" />重置</el-button> -->
                <el-button @click="handleFilter"><svg-icon icon-class="btn-search" />搜索</el-button>
            </el-form>
        </div>
        <!--工具栏-->
        <!-- <div class="operate-container">
            <el-button @click="handleCreate"><svg-icon icon-class="btn-add" />添加</el-button>
          <!--  <el-button @click="batchRemove" :disabled="this.sels.length===0"><svg-icon icon-class="btn-delete" />批量删除</el-button> -->
        <!-- </div> -->
        <!--表格数据-->
        <div class="data-container">
            <el-table v-loading="listLoading" max-height="600" :key="tableKey" :data="list" border highlight-current-row>
                <!-- <el-table-column type="selection" width="55" align="center">
                </el-table-column> -->
                <el-table-column type="index" label="序号" width="60" align="center">
                </el-table-column>
                <el-table-column label="科目" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.subject }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="考试时间" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="成绩" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.score }}</span>
                    </template>
                </el-table-column>
                 <!-- <el-table-column :label="$t('table.actions')" align="center" width="230">
                    <template slot-scope="scope">
                        <el-button type="info" @click="handleUpdate(scope.row)"><svg-icon icon-class="btn-edit" />修改</el-button>
                        <el-button type="info" @click="dictDetails(scope.row)"><svg-icon icon-class="btn-view" />管理</el-button>
                        <el-button type="info" @click="handleDelete(scope.row)"><svg-icon icon-class="btn-delete" />{{ $t('table.delete') }}</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <!--分页控件-->
        <div class="pagination-container">
            <el-pagination v-show="total>0" :current-page="listQuery.basePageVO.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.basePageVO.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    
</template>
<script>
  // import score from "@/commons/api/score";
  export default {
    name: '',
    data() {
      return {
          //过滤条件
        listQuery: {
            basePageVO:{
                pageNum: 1,
                pageSize: 10
            },
            subject:"",
        },
        list:[
          {subject:'语文',
           time:'2019-01-03',
           score:'87'
          },
          {subject:'数学',
           time:'2019-01-03',
           score:'87'
          },
          {subject:'历史',
           time:'2019-01-03',
           score:'87'
          },
        ],
        listLoading:false,
      }
    },
    method: {
      getList() {
        this.listLoading = true;
        // console.log(this.listQuery)
        score.getList(this.listQuery).then(response => {
          var res = notify(this, response, true);
          if (res) {
            this.list = response.data.list;
            this.total = response.data.total;
          }
          this.listLoading = false;
        });
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