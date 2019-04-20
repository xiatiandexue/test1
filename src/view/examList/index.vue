<template>
    <div class="app-container examList">
        <div class="data-container">
          <el-table v-loading="listLoading" max-height="600" :data="list" border highlight-current-row>
              <el-table-column type="index" label="序号" width="60" align="center">
              </el-table-column>
              <el-table-column prop="subject" label="科目" align="center">
              </el-table-column>
              <el-table-column prop="examName" label="考试名" align="center">
              </el-table-column>
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
              <el-table-column prop="status" label="考试状态" align="center">
                <template slot-scope="scope">
                  <span v-text="getStatusById(scope.row.status)"></span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="230">
                <template slot-scope="scope">
                    <el-button v-if="(scope.row.status == '2')" type="info" @click="takeExam(scope.row)"><svg-icon icon-class="btn-view" />考试</el-button>
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
  import {format} from '@/commons/utils'
  import { getClassId } from "@/commons/utils/auth"
  import { notify } from '@/commons/utils/notify'
  import exam from '@/commons/api/exam'
  export default {
    name: '',
    data() {
      return {
          //过滤条件
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          classId:getClassId(),
        },
        total:undefined,
        list:[],
        listLoading:false,
        statusOptions: [
          {value: "1", label: '未开始' },
          {value: "2", label: '进行中' },
          {value: "3", label: '已结束' },
        ],
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true;
        // console.log(this.listQuery)
        exam.getExamList(this.listQuery).then(response => {
          var res = notify(this, response, true);
          if (res) {
            this.list = response.data.list;
            this.total = response.data.total;
          }
          this.listLoading = false;
        });
      },
      takeExam(row){
        this.$router.push({
        path:`/exam`,
        query: {
          paperId: row.paperId,
          examId: row.examId,
          isAnalyze: false
        }
      })
      },
      formatDate(time) {
        var date = new Date(time);
        return format(date, 'yyyy-MM-dd hh:mm:ss');
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