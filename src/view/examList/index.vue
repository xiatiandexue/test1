<template>
    <div class="app-container examList">
        <div class="data-container">
          <el-table v-loading="listLoading" max-height="600" :data="list" border highlight-current-row>
              <el-table-column type="index" label="序号" width="60" align="center">
              </el-table-column>
              <el-table-column prop="subject" label="科目" align="center">
              </el-table-column>
              <el-table-column prop="time" label="考试时间" align="center">
              </el-table-column>
                <el-table-column label="操作" align="center" width="230">
                  <template slot-scope="scope">
                      <el-button type="info" @click="takeExam(scope.row)"><svg-icon icon-class="btn-view" />管理</el-button>
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
  // import score from "@/commons/api/score";
  export default {
    name: '',
    data() {
      return {
          //过滤条件
        listQuery: {
          pageNum: 1,
          pageSize: 10,
        },
        total:3,
        list:'',
        listLoading:false,
      }
    },
    created() {
      this.getList()
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
      takeExam(){
        this.$router.push({
        path:`/exam`,
        query: {
          paperid: row.paperid
        }
      })
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