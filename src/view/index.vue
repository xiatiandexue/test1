<template>
  <div class="app-container observationStation">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="开始时间">
          <el-date-picker v-model="searchData.startDate"
                          type="date"
                          size="mini"
                          :clearable="false"
                          :picker-options="startDateOptions"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="searchData.endDate"
                          type="date"
                          size="mini"
                          :clearable="false"
                          class="end"
                          :picker-options="endDateOptions"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item"
                     @click="handleReset">
                     <svg-icon icon-class="btn-reset" />
                     重置</el-button>
          <el-button class="filter-item"
                     @click="handleFilter">
                     <svg-icon icon-class="btn-search" />
                     搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="export">
      <el-form>
        <el-form-item>
          <el-button @click="handleExport"><svg-icon icon-class="btn-download" />导出Excel</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-container">
      <el-table v-loading="listLoading"
                :data="tableData"
                :span-method="objectSpanMethod"
                border
                fit
                stripe
                show-summary
                :summary-method="getSummaries"
                highlight-current-row
                style="width: 100%;">
        <el-table-column prop="city" label="受水区" align="center" ></el-table-column>
        <el-table-column prop="name" label="取水户" align="center"></el-table-column>
        <el-table-column prop="intake" label="实际取水量" align="center"></el-table-column>
        <el-table-column prop="plan" label="计划取水量" align="center"></el-table-column>
        <el-table-column prop="dif" label="实际-计划" align="center"></el-table-column>
        <el-table-column prop="pay" label="应缴水费" align="center"></el-table-column>
        <el-table-column prop="statusId" label="是否按期缴费" align="center">
          <template slot-scope="scope">
            <span v-text="getIsPayOptionById(scope.row.statusId)"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import VueElTable from '@/components/VueElTable'
  import report from '@/commons/api/report'
  import eneralize from '@/commons/api/eneralize';
  import { notify } from "@/commons/utils/notify";
  import {format} from '@/commons/utils'
  export default {
    components: {
      VueElTable
    },
    computed: {
      startDateOptions () {
        let that = this
        return {
          disabledDate (time) {
            if (that.searchData.endDate) {
              var end = new Date(that.searchData.endDate)
              if(that.hide) {
                return time.getTime() > end
              } else {
                var end1 = end.setMonth(end.getMonth() - 1);
                var end2 = end.setMonth(end.getMonth() - 11);
                return time.getTime() > new Date(end1) || time.getTime() < new Date(end2);
              }
            } else {
              return false;
            }
          }
        }
      },
      endDateOptions () {
        let that = this
        return {
          disabledDate (time) {
            if (that.searchData.startDate) {
              var start = new Date(that.searchData.startDate)
              if(that.hide){
                return time.getTime() < start
              } else {
                var start1 = start.setMonth(start.getMonth() + 1);
                var start2 = start.setMonth(start.getMonth() + 11);
                return time.getTime() < new Date(start1) || time.getTime() > new Date(start2);
              }
            } else {
              return false;
            }
          }
        }
      },
    },
    data () {
      return {
        hide:false,
        clearable:false,
        listLoading: false,
        tableData: [],
        searchData: {
          // year: new Date(),
          startDate: "",
          endDate: "",
          pageNum: 1,
          pageSize: 10
        },
        IsPayOption: [],
      }
    },
    created() {
      this.initDefaultDate()
      this.getIsPayOption()
      this.getList()
    },
    methods: {
      handleReset () {
        this.searchData.stcd = ""
        this.searchData.pageNum = 1
        delete this.searchData.stcdName
        this.getList()
      },
      handleFilter () {
      //前往到第一页
        this.searchData.pageNum = 1;
        if(this.searchData.stcd){
          this.searchData.stcdName = this.getStcdNameById(this.searchData.stcd)
        }else{
          delete this.searchData.stcdName
        }
        this.getList();
      },
      objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex < 2) {
            if(rowIndex % 2 === 0) {
              return [2,1]
            } else {
                return [0,0]
            }
          } else if (rowIndex < 6) {
            if (rowIndex < 4){
              if(rowIndex % 2 === 0) {
                return [4,1]
              }else {
                return [0,0]
              }
            }else {
              return [0,0]
            }
          } else if (rowIndex < 7){
            if (rowIndex % 2 == 0) {
              return [1,1]
            }
          } else if (rowIndex < 9) {
            if(rowIndex % 7 === 0) {
              return [2,1]
            } else {
                return [0,0]
            }
          } else if (rowIndex < 15) {
            if (rowIndex < 11){
              if (rowIndex % 3 === 0){
                return [6,1]
              }else {
                  return [0,0]
              }
            } else {
              return [0,0]
            }
          }else if (rowIndex < 17) {
            if(rowIndex % 3 === 0) {
              return [2,1]
            } else {
                return [0,0]
            }
          }
        }
      },
      
     
      initDefaultDate () {
        var startDate = new Date();
        var endDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        var start = format(startDate, 'yyyy-MM-dd')
        var end = format(endDate, 'yyyy-MM-dd')
        this.searchData = {
          startDate: start,
          endDate: end,
        }
        this.hide = false
      },
      getList () {
        this.listLoading = true
        report.getIntakeList(this.searchData).then(response => {
          var res = notify(this, response, true);
          if(res) {
            this.tableData = response.data.list
            this.total= response.data.total
          }
          this.listLoading = false;
        })
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
      //获取缴费状态
      getIsPayOption() {
        eneralize.getIsPayOption().then(res => {
          if(res.code==0&&res.data) {
            this.IsPayOption = res.data
          }
        })
      },
      //通过ID获取缴费状态
      getIsPayOptionById(id) {
        var name = ''
        var typeList = this.IsPayOption
        for (var type of typeList) {
          if(type.dictDataId === id) {
            name = type.dictDataName
            break
          }
        }
        return name
      },
      //合计
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = sums[index].toFixed(2)
          }
          
        });
        return sums;
      },
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss">
.observationStation {
  /* 筛选面板 */
  .filter-container {
    text-align: left;
    padding-bottom: 0px;
    .filter-item {
      margin-bottom: 0px;
    }
  }
  .export {
    text-align: left;
    .el-form-item--small.el-form-item{
      margin-bottom: 10px;
    }
  }
}
</style>