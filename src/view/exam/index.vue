<template>
  <div class="exam" style="height: 87vh">
    <h3 class="text-center marginT10">{{paperData.examName}}</h3>
    <div class="text-center marginT10">考试时长：{{duration}}分钟  总分：{{paperData.score}}分</div>
    <hr>  
    <div class="submit-box" ref="submitBox">
      <el-button @click="submit" type="primary" class="submit-btn">提交试卷</el-button>
      <div class="timeout">
        <p>距离考试结束</p>
        <p>{{time}}</p>
      </div>
    </div>
    <div class="main">
      <div class="select">
        <h3>一、单选题（{{paperData.selectScore}}分）</h3>
        <ul class="question-item">
          <li class="marginB10" v-for="(item,index) in selectQuestions" :key="item.questionid">
            <p class="question-title">
              {{index+1}} 、{{item.question}}
            </p>
            <el-radio-group v-model="item.userAnswer">
              <el-radio :label="item.one">{{options[0]}}、{{item.one}}</el-radio>
              <el-radio :label="item.two">{{options[1]}}、{{item.two}}</el-radio>
              <el-radio :label="item.three">{{options[2]}}、{{item.three}}</el-radio>
              <el-radio :label="item.four">{{options[3]}}、{{item.four}}</el-radio>
            </el-radio-group>
          </li>
        </ul>
      </div>
      
      <div class="SAQ">
        <h3>二、判断题（{{paperData.saqScore}}分）</h3>
        <ul class="question-item">
          <li class="marginB10" v-for="(item,index) in SAQQuestions" :key="item.saqid">
            <p class="question-title">
              {{index+1}} 、{{item.question}}
              </p>
            <el-radio-group v-model="item.userAnswer">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </li>
        </ul>
      </div>
    </div>

    
  </div>
</template>
<script>
  import {format, dateDiff} from '@/commons/utils'
  import { notify } from '@/commons/utils/notify'
  import { getUserId } from "@/commons/utils/auth"
  import exam from '@/commons/api/exam'
export default {
    data(){
      return {
        query: {
          paperId: undefined,
          examId: undefined,
          isAnalyze: undefined,
          userId: getUserId(),
        },
        paperData:'',
        startTime:'',
        nowTime: '',
        examTime: '',
        timer: null,
        options:['A','B','C','D'],
        selectQuestions:[],
        SAQQuestions:[],
        duration: '',
        submitAnswer: '',
      }
    },
    computed:{
      time(){
        let time = this.examTime;
        let hour = 0;
        let mm = 0;
        let ss = 0;
        hour = Math.floor(time / 3600);
        mm = Math.floor((time / 60 % 60));
        ss = Math.floor((time % 60));
        return  `${hour}小时${mm}分钟${ss}秒`;
      }
    },
    watch: {
      time(curVal, oldVal) {
        if(curVal == "小时分钟秒"){
          this.$message({
            message: '考试时间到，强制提交!',
            type: 'error'
          });
          let isMust = true;
          this.submit(isMust);
        }
      }
    },
    activated() {
      this.query.paperId = this.$route.query.paperId;
      this.query.examId = this.$route.query.examId;
      this.query.isAnalyze = this.$route.query.isAnalyze;
      this.$nextTick(() => {
        this.init()
      })
    },
    mounted(){
      this.nowTime = new Date();
      // this.startTime = new Date();
      // this.init();
    },
    methods:{
      /**
       * 初始化
       */
      init(){
        if(this.query.examId == '' || !this.query.examId ){
            this.$router.push({path:`/examList`});
            return
        } else {
          exam.getPaperContent(this.query).then(response => {
            var res = notify(this, response, true);
            if(res){
              this.paperData = response.data.paperData
              this.selectQuestions = response.data.single
              this.SAQQuestions = response.data.saq
              this.selectQuestions.forEach(item1 => {
                if(!item1.userAnswer){
                  item1.userAnswer = ''
                }
                item1.type = '2'
                item1.value = this.paperData.selectScore
              })
              this.SAQQuestions.forEach(item2 => {
                if(!item2.userAnswer){
                  item2.userAnswer = ''
                }
                item2.type = '1'
                item2.value = this.paperData.saqScore
              })
              
              this.duration = dateDiff(this.paperData.beginTime,this.paperData.endTime)
              this.startTime = this.paperData.beginTime;
              this.examTime = this.duration*60 - ((this.nowTime - new Date(this.startTime))/1000);
              console.log(this.examTime)
              if(this.examTime <= 0){
                this.$message({
                  message: '考试时间已过!',
                  type: 'error'
                });
                this.$router.push({path:`/examList`});
              }
              this.getCode();
              this.regularlySubmit();
              
            }
          }).catch(err => {
            this.$message({
              message: err,
              type: 'error'
            });
          })
        }
      },
      //设置倒计时
      getCode(){
        const TIME_COUNT = this.examTime;
        if (!this.timer) {
          this.timer = setInterval(() => {
            if (this.examTime > 0 && this.examTime <= TIME_COUNT) {
              this.examTime--;
            } else {
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }
      },
      //定时提交试卷
      regularlySubmit(){
        let regular = setInterval(() => {
          if (this.examTime > 0 ) {
            this.submitAnswer = {
              userId: getUserId(),
              examId: this.query.examId,
              paperId: this.query.paperId,
              isSubmit: false,
              answerList: [...this.selectQuestions, ...this.SAQQuestions]
            }
            this.submitApi(this.submitAnswer)
          } else {
            clearInterval(regular);
          }
        }, 60000)
      },

      /**
       * 提交试卷
       * @return {[type]} [description]
       */
      submit(isMust){
        let isAllAnswer = true;
        let single = true;
        let SAQ = true;
        this.selectQuestions.some((item) => {
          single = !item.userAnswer == '';
        })
        this.SAQQuestions.some((item) => {
          SAQ = !item.userAnswer == '';
        })
        if(single&&SAQ){
          isAllAnswer = true;
        } else {
          isAllAnswer = false;
        }
        if(isAllAnswer === false && isMust !== true){
          this.$message({
            type: 'warning',
            message: '考试时间未到，请完成所有题目!'
          })
        } else {
          this.submitAnswer = {
            userId: getUserId(),
            examId: this.query.examId,
            paperId: this.query.paperId,
            isSubmit: true,
            answerList: [...this.selectQuestions, ...this.SAQQuestions]
          }
          console.log(this.submitAnswer)
          if(isMust === true){
            this.submitApi(this.submitAnswer);
          } else {
            this.$confirm('是否提前交卷？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              this.submitApi(this.submitAnswer);
            }).catch(()=>{
              this.$message({
                type: 'info',
                message: '已取消操作'
              });
            })
          } 
        } 
      },
      /**@argument score answers
       * 提交试卷api请求
       */
      submitApi(submitAnswer){
        exam.submitAnswer(submitAnswer).then(response => {
          var res = notify(this, response, true);
          if(res && submitAnswer.isSubmit){
            this.$router.push({
              path:`/examList`,
              query: {
                takeExam: true
              }
            });
          }
        })
      }
    }
  }
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  .exam{
    padding: 20px 0;
    .main{
      padding: 20px 40px;
      .question-title{
        font-size: 16px;
        margin-bottom: 5px;
      }
      .option{
        display: block;
        margin:5px 0 0 15px;
      }
      .question-item{
        margin-left: 15px;
      }
      .textarea{
        width: 500px;
      }
    }
    .scroll_top{
      background-color: #fff;
      position: fixed;
      right: 100px;
      bottom: 150px;
      width: 40px;
      height: 40px;
      border-radius: 20px;
      cursor: pointer;
      transition: .3s;
      box-shadow: 0 0 6px rgba(0,0,0,.12);
      z-index: 5;
      i{
        color: #409eff;
        display: block;
        line-height: 40px;
        text-align: center;
        font-size: 18px;
      }
    }
    .submit-box{
      position: fixed;
      right: 30px;
      padding: 30px;
      transition: 1s;
      text-align: center;
      border: 1px solid #ffffff;
      box-shadow: 1px 1px 1px #c5c5c5;
      background: rgba(193, 193, 193, 0.1);
      border-radius: 20px;
      .timeout{
        margin-top: 10px;
        text-align: center;
      }
    }
  }
</style>