<template>
  <div class="updatePaper">
    <div class="main">
      <div class="select">
        <h3>一、单选题（只有一个正确答案）</h3>
        <ul class="question-item">
          <li class="marginB10" v-for="(item,index) in questionids" :key="item.id">
            <p class="question-title">{{index+1}} 、{{item.name}}</p>
            <span class="option"
                  v-for="(item1,index1) in item.selection" :key="item1.id">
              <el-radio v-model="item.sanswer" :label="options[index1]" :key="index1">
                {{options[index1]}}、{{item1}}
              </el-radio>
            </span>
          </li>
        </ul>
      </div>
      
      <div class="SAQ">
        <h3>二、判断题</h3>
        <ul class="question-item">
          <li class="marginB10" v-for="(item,index) in saqids" :key="item.id">
            <p class="question-title">{{index+1}} 、{{item.name}}</p>
            <el-input
              class="textarea"
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="item.sanswer">
            </el-input>
          </li>
        </ul>
      </div>
    </div>
    <div class="scroll_top" @click="scrollTop" v-if="scroll>500">
      <i class="el-icon-caret-top"></i>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
    name: 'UpdatePaper',
    data(){
      return {
        paperid: '',
        paperData:{
          name:'',
          time:'',
          totalPoints:''
        },
        startTime:'',
        nowTime: '',
        examTime: '',
        timer: null,
        // singleQuestions:[],
        singleQuestions:[
          {name:'测试1',
           selection:[
             '1','2','3','4'
           ]
          },
          {name:'测试2',
           selection:[
             '1','2','3','4'
           ]
          },
        ],
        multiQuestions:[],
        QAQuestions:[],
        judgeQuestions:[],
        options:['A','B','C','D'],
        scroll: document.body.scrollTop
      }
    },
    
    created() {
      this.PaperId = this.$route.query.PaperId;
    },
    mounted(){
      this.nowTime = new Date();
      // this.startTime = new Date();
      this.init();
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy(){
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods:{
      /**
       * 初始化
       */
      init(){
        if(this.id == '' || !this.id ){
            this.$router.push({path:'forntexamindex'});
            return
        } else {
          this.$axios.get('/api/getExamInfo',{
            params:{
              id: this.id
            }
          }).then(response => {
            let res = response.data;
            if(res.status == '0') {
              for(let key in this.paperData) {
                  this.paperData[key] = res.result[key];
              }
              this.startTime = res.result.startTime;
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
      /**
       * 回到顶部
       * @return {[type]} [description]
       */
      scrollTop(){
        let timer = setInterval(() => {
          let top = document.body.scrollTop || document.documentElement.scrollTop;
          let speed = Math.ceil(top / 5);
          document.body.scrollTop = top - speed;
          if (top === 0) {
            clearInterval(timer);
          }
        }, 20)
      },
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
      handleScroll(){
        this.scroll = document.body.scrollTop;
        if(this.scroll>250) {
          this.$refs.submitBox.style.top=10+'px';
        } else {
          this.$refs.submitBox.style.top=250+'px';
        }
      },
      /**
       * 提交试卷
       * @return {[type]} [description]
       */
      submit(isMust){
        let isAllAnswer = true;
        let single = true;
        let mutil = true;
        let judge = true;
        let QA = true;
        this.singleQuestions.some((item) => {
          single = !item.sanswer == '';
        })
        this.multiQuestions.some((item) => {
          mutil = !item.sanswer.length == 0;
        })
        this.judgeQuestions.some((item) => {
          judge = !item.sanswer == '';
        })
        this.QAQuestions.some((item) => {
          QA = !item.sanswer == '';
        })
        if(single&&mutil&&judge&&QA){
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
          this.multiQuestions.forEach(item => {
            let answer = item.answer.split(',');
            if(answer.equals(item.sanswer)){
              score += item.score;
            }
          });
          this.judgeQuestions.forEach((item) => {
            if(item.sanswer === item.answer){
              score += item.score;
            }
          })
          if(this.QAQuestions.length > 0) {
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
  .updatePaper{
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