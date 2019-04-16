<template>
    <div class="app-container score">
        <!--筛选条件-->
        <div class="filter-container">
            <el-form :inline="true">
                <el-form-item label="科目">
                  <el-input v-model="listQuery.subject" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
                </el-form-item>
                <el-form-item label="学生学号">
                  <el-input v-model="listQuery.usercode" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
                </el-form-item>
                <el-form-item label="学生姓名">
                  <el-input v-model="listQuery.name" clearable style="width:250px;" @keyup.enter.native="handleFilter" />
                </el-form-item>
                <el-button @click="handleReset"><svg-icon icon-class="btn-reset" />重置</el-button>
                <el-button @click="handleFilter"><svg-icon icon-class="btn-search" />搜索</el-button>
            </el-form>
        </div>
        <!--工具栏-->
        <div class="operate-container">
          <el-button @click="handleExport"><svg-icon icon-class="btn-download" />导出</el-button>
        </div>
        <!--表格数据-->
        <div class="data-container">
          <el-table v-loading="listLoading" max-height="600" :data="list" border highlight-current-row>
              <!-- <el-table-column type="selection" width="55" align="center">
              </el-table-column> -->
              <el-table-column type="index" label="序号" width="60" align="center">
              </el-table-column>
              <el-table-column label="科目" prop="subject" align="center">
              </el-table-column>
              <el-table-column label="考试时间" prop="startTime" align="center">
              </el-table-column>
              <el-table-column label="学号" prop="usercode" align="center">
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
  // import score from "@/commons/api/score";
  export default {
    name: '',
    data() {
      return {
          //过滤条件
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          subject:"",
          usercode: '',
          name:'',
        },
        total:3,
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
    create(){
      // this.getList()
    },
    methods: {
      //搜索
      handleFilter(){
        this.listQuery.pageNum = 1;
        this.getList()
      },
      //重置
      handleReset () {
        this.listQuery = {
          pageNum: 1,
          pageSize: 10,
          subject:"",
          usercode: '',
          name:'',
        },
        this.getList()
      },
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
      handleExport () {
        var url = `/app/intakeReport/export?startDate=${this.searchData.startDate}&endDate=${this.searchData.endDate}`
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
        eneralize.downloadTemplate({ type: this.values.searchData.type })
      },
      // downloadTemplate: (data) => getDownload('/app/waterquality/download?type=' + data.type), // 水质列表模板下载
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