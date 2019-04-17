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
                <el-form-item label="科目:" prop="subject">
                  <span v-text="paperData.subject"></span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="试卷总分:" prop="score">
                  <span v-text="paperData.score"></span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="试卷名:" prop="name">
                  <span v-text="paperData.name"></span>
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
              <div class="chart">
                <div :id="'selectChart'+index" class="select-chart"></div>
                <div class="tips">
                  <span>Tips:本题错误人数较多，建议重点讲解</span>
                </div>
              </div>
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
              <div :id="'saqChart'+index" class="select-chart"></div>
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
      paperData: {subject: '语文', score:'100',name:'语文考试',selectscore:'10',saqscore:'20'},
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
      selectData:[[3,5],[4,4],[6,2]],
      saqData:[[3,5],[6,2]],
      tempChartData:[]
    }
  },
  mounted(){
    this.$nextTick(()=>{
      setTimeout(()=>{
        for(let i = 0; i< this.selectQuestions.length; i++){
          this.tempChartData = this.selectData[i]
          var select = 'select'
          this.initChart(i,select)
        }
        for(let j = 0; j< this.SAQQuestions.length; j++){
          this.tempChartData = this.saqData[j]
          var saq = 'saq'
          this.initChart(j,saq)
        }
      },200)
    })
    
  },
  created(){
  },
  
  methods:{
    initChart(i,type) {
      let  option = {
        //标题
        title : {
            text: '', //主标题
        },
        //提示框，鼠标悬浮交互时的信息提示    
        tooltip : {
            trigger: 'axis'
        },
        //图例
        legend: {
          data:['人数'] //legend的data: 用于设置图例，data内的字符串数组需要与sereis数组内每一个series的name值对应    
        },
        grid: {
          top: 30,
          x:40,
          x2: 30,
          y2: 20
        },
        xAxis : [
          {
            type : 'value',  //坐标轴类型，纵轴默认为数值型'value'    
            boundaryGap : [0, 0.01]  //类目起始和结束两端空吧策略，true留空，false顶头    [0,0]-->差额百分比
          }
        ],
        yAxis : [
          {
            type : 'category',  //坐标轴类型，横轴默认为类目型'category'    
            name: '得分',
            data : ['对','错']  //类目型坐标轴文本标签数组，指定label内容。 数组项通常为文本，'\n'指定换行
          }
        ],
         //sereis的数据: 用于设置图表数据之用。series是一个对象嵌套的结构；对象内包含对象  
        series : [
          {
            name:'人数',  //系列名称，如果启用legend，该值将被legend.data索引相关    
            type:'bar',  //图表类型，必要参数！如为空或不支持类型，则该系列数据不被显示。
            barWidth:20, //柱宽
            itemStyle: {
              normal: {
                color: function(params) {
                    // build a color map as your need.
                  var colorList = [
                    '#C1232B','#B5C334'
                  ];
                  return colorList[params.dataIndex]
                },
              }
            },
            data:this.tempChartData  //系列中的数据内容数组，柱状图时数组长度等于所使用类目轴文本标签数组axis.data的长度，并且他们间是一一对应的。数组项通常为数值    
          }
        ]
      };
      if(type == 'select'){
        var dom = document.getElementById('selectChart'+i)
      } else {
        var dom = document.getElementById('saqChart'+i)
      }
      // this.$refs['selectChart'+i]
      let myChart = this.$echarts.init(dom)
      myChart.setOption(option);
      console.log('生成图表成功')
    },
    //返回
    handleBack() {
      this.$router.push({
        path:`/examinationPaper/`,
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.analysisPaper{
  .select-chart{
    height: 10rem;
    width: 30%;
    margin:12px 10px;
    canvas{
        width: 97%!important;
    }
    background-color: #f4eff5;
  }
}
</style>