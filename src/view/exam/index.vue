<template>
  <div class="exam">
    <h3 class="text-center marginT10">{{paperData.subject}}</h3>
    <div class="text-center marginT10">考试时长：{{paperData.time}}分钟  总分：{{paperData.score}}分</div>
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
            <hr />
          </li>
        </ul>
      </div>
    </div>

    
  </div>
</template>
<script>
export default {
    data(){
      return {
        paperid: '',
        paperData:'',
        startTime:'',
        nowTime: '',
        examTime: '',
        timer: null,
        options:['A','B','C','D'],
        selectQuestions:[],
        SAQQuestions:[],
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
          this.$message.error('考试时间到，强制提交!');
          let isMust = true;
          this.submit(isMust);
        }
      }
    },
    created() {
      this.paperid = this.$route.query.paperid;
    },
    mounted(){
      this.nowTime = new Date();
      // this.startTime = new Date();
      this.init();
    },
    methods:{
      /**
       * 初始化
       */
      init(){
        if(this.paperid == '' || !this.paperid ){
            this.$router.push({path:`/exmaList`});
            return
        } else {
          var id = {paperid:this.paperid} 
          paper.getPaper(id).then(response => {
            var res = notify(this, response, true);
            if(res){
              this.paperData = response.data;
              this.startTime = response.startTime;
              this.examTime = this.paperData.time*60 - ((this.nowTime - new Date(this.startTime))/1000);
              if(this.examTime <= 0){
                this.$message.error('考试时间已过!');
                this.$router.go(-1);
              }
              this.getCode();
              // this.timeOut();
              res.result._questions.forEach(item => {
                if(item.type=='single'){
                  item.sanswer = '';
                  this.singleQuestions.push(item);
                }else if(item.type == 'judgement'){
                  item.sanswer = '';
                  this.judgeQuestions.push(item);
                }
              })
            }
          }).catch(err => {
            this.$message.error(err);
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
     
      /**
       * 提交试卷
       * @return {[type]} [description]
       */
      submit(isMust){
        let isAllAnswer = true;
        let single = true;
        let SAQ = true;
        this.singleQuestions.some((item) => {
          single = !item.sanswer == '';
        })
        this.SAQQuestions.some((item) => {
          SAQ = !item.sanswer == '';
        })
        if(single&&SAQ){
          isAllAnswer = true;
        } else {
          isAllAnswer = false;
        }
        console.log(isAllAnswer,isMust);
        if(isAllAnswer === false && isMust !== true){
          this.$message.warning('考试时间未到，请完成所有题目!');
        } else {
          let score = 0; // 得分
          let answers = [];
          this.singleQuestions.forEach(item => {
            if(item.sanswer === item.answer){
              score += item.score;
            }
          });
          if(this.SAQQuestions.length > 0) {
            this.QAQuestions.forEach(item => {
              answers.push({
                _question: item._id,
                answer: item.sanswer
              })
            })
          }
          if(isMust === true){
            this.submitApi(score,answers);
          } else {
            this.$confirm('是否提前交卷？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              this.submitApi(score,answers);
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
      submitApi(score,answers){
        this.$axios.post('/api/submitExam',{
          id: this.id,
          score: score,
          answers: answers,
          startTime: this.startTime
        }).then(response => {
          let res = response.data;
          if(res.status == '0') {
            this.$message.success('提交成功!');
            this.$router.push({path:'frontstudentinfo'});
          }
        }).catch(err => {
          this.$message.error('提交失败，请联系老师!');
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