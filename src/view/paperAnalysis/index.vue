<template>
  <div class="analysisPaper" style="height: 87vh">
    <span class="back">
      <el-button type="primary" @click="handleBack">返回</el-button>
    </span>
      <div class="main">
        <div class="title">
          <el-form label-width="80px" ref="dataForm" >
            <el-row :gutter="20">
              <el-col :span="5">
                <el-form-item label="科目" prop="subject">
                  <el-input v-model="paperData.subject" 
                            disabled
                            style="width:100px;" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="试卷总分" prop="score">
                  <el-input v-model="paperData.score" 
                            disabled
                            style="width:100px;" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="试卷名" prop="name">
                  <el-input v-model="paperData.name" 
                            clearable
                            style="width:350px;" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="select">
          <h3>一、单选题（{{paperData.selectscore}}分）</h3>
          <ul class="question-item">
            <li class="marginB10" v-for="(item,index) in selectQuestions" :key="item.questionid">
              <p class="question-title">
                {{index+1}} 、{{item.question}}
              </p>
              <el-radio-group v-model="item.answer">
                <el-radio :label="item.choiceone">{{options[0]}}、{{item.choiceone}}</el-radio>
                <el-radio :label="item.choicetwo">{{options[1]}}、{{item.choicetwo}}</el-radio>
                <el-radio :label="item.choicethree">{{options[2]}}、{{item.choicethree}}</el-radio>
                <el-radio :label="item.choicefour">{{options[3]}}、{{item.choicefour}}</el-radio>
              </el-radio-group>
              <div ref="selectChart" class="select-chart"></div>
              <hr />
            </li>
          </ul>
        </div>
        
        <div class="SAQ">
          <h3>二、判断题（{{paperData.saqscore}}分）</h3>
          <ul class="question-item">
            <li class="marginB10" v-for="(item,index) in SAQQuestions" :key="item.saqid">
              <p class="question-title">
                {{index+1}} 、{{item.question}}
                </p>
              <el-radio-group v-model="item.answer">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
              <div ref="SAQChart" class="select-chart"></div>
              <hr />
            </li>
          </ul>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return{
      options:['A','B','C','D'],
      paperData: [{subject: '语文', score:'100',name:'语文考试',selectscore:'10',saqscore:'20'}],
      selectQuestions: [
        {
          question:'1',answer:'1',choiceone:'1',choicetwo:'2',choicethree:'3',choicefour:'4'
        },{
          question:'2',answer:'2',choiceone:'1',choicetwo:'2',choicethree:'3',choicefour:'4'
        },{
          question:'3',answer:'3',choiceone:'1',choicetwo:'2',choicethree:'3',choicefour:'4'
        },
      ],
      SAQQuestions: [
        {question:'1',answer:'1'},
        {question:'2',answer:'0'},
      ],
      selectData:[]
    }
  },
  methods:{
    selectChart() {
      let  option = {
        title : {
          text: '',
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: { //图例
            data:['人数']
        },
        xAxis : [
            {
              type : 'value',
              boundaryGap : [0, 0.01]
            }
        ],
        // yAxis : [
        //     {
        //         type : 'category',
        //         data : ['巴西','印尼','美国','印度','中国','世界人口(万)']
        //     }
        //   ],
        yAxis: {
          type: 'value',
          name: '得分',
          data: this.data
          // nameLocation: 'start'
        },
        series : [
          {
              name:'人数',
              type:'bar',
              data:this.dateData
          }
        ]
      };
      let myChart = this.$echarts.init(this.$refs.waterChart)
      myChart.setOption(option);
      console.log('生成图表成功')
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.analysisPaper{
  .water-chart{
    height: 26rem;
    width: 95%;
    margin:12px 10px;
    canvas{
        width: 97%!important;
    }
    background-color: #f4eff5;
  }
}
</style>