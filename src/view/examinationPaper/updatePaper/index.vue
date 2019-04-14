<template>
  <div class="updatePaper" style="height: 87vh">
    <span class="back">
      <el-button type="primary" @click="handleUpdate">确定</el-button>
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
        <div class="tool">
          <el-button @click="addSelect"><svg-icon icon-class="btn-add" />添加</el-button>
        </div>
        <ul class="question-item">
          <li class="marginB10" v-for="(item,index) in selectQuestions" :key="item.questionid">
            <p class="question-title">
              {{index+1}} 、{{item.question}}
              <span class="delete_button">
                <el-button @click="deleteSelect(item.questionid)"><svg-icon icon-class="btn-delete" />删除</el-button>
              </span>
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
        <div class="tool">
          <el-button @click="addSAQ"><svg-icon icon-class="btn-add" />添加</el-button>
        </div>
        <ul class="question-item">
          <li class="marginB10" v-for="(item,index) in SAQQuestions" :key="item.saqid">
            <p class="question-title">
              {{index+1}} 、{{item.question}}
              <span class="delete_button">
                <el-button @click="deleteSAQ(item.saqid)"><svg-icon icon-class="btn-delete" />删除</el-button>
              </span>
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
import paper from '@/commons/api/paper'
import { notify } from '@/commons/utils/notify'
export default {
    name: 'UpdatePaper',
    data(){
      return {
        paperid: '',
        paperData: '',
        selectQuestions: '',
        SAQQuestions:'',
        options:['A','B','C','D'],
        scroll: document.body.scrollTop,
        selectDialog: false
      }
    },
    
    activated() {
      this.paperid = this.$route.query.paperid;
      this.init();
      
    },
    methods:{
      //初始化
      init(){
        if(this.paperid == '' || !this.paperid ){
            this.$router.push({path:'/examinationPaper/'});
            return
        } else {
          var id = {paperid:this.paperid} 
          paper.getPaper(id).then(response => {
            var res = notify(this, response, true);
            if(res){
              this.paperData = response.data
              this.getSelectById();
              this.getSAQById();
            }
            
          }).catch(err => {
            this.$message.error(err);
          })
        }
      },
      //通过题目id获取题目具体信息
      getSelectById() {
        var questionids = {questionids: this.paperData.questionids}
        paper.getSelectById(questionids).then(response => {
          var res = notify(this, response, true);
          this.selectQuestions = response.data
          console.log(this.selectQuestions)
        })
      },
      getSAQById() {
        var saqids = {saqids: this.paperData.saqids}
        paper.getSAQById(saqids).then(response => {
          var res = notify(this, response, true);
          this.SAQQuestions = response.data
        })
      },
      //删除单选题
      deleteSelect(id) {
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        })
        .then(() => {
          var deleteInfo = { questionid: id, paperid: this.paperData.paperid };
          paper.deleteSelect(deleteInfo).then(response => {
            var res = notify(this, response);
            if (res) {
              this.init();
            }
          });
        })
        .catch(() => {});
      },
      deleteSAQ(id) {
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        })
        .then(() => {
          var deleteInfo = { saqid: id, paperid: this.paperData.paperid };
          paper.deleteSAQ(deleteInfo).then(response => {
            var res = notify(this, response);
            if (res) {
              this.init();
            }
          });
        })
        .catch(() => {});
      },
      //添加单选题
      addSelect() {
        this.$router.push({
          path:`/examinationPaper/updatePaper/addSelect`,
          query: {
            paperid: this.paperData.paperid,
            subject: this.paperData.subject
          }
        })
      },
      addSAQ() {
        this.$router.push({
          path:`/examinationPaper/updatePaper/addSAQ`,
          query: {
            paperid: this.paperData.paperid,
            subject: this.paperData.subject
          }
        })
      },
      handleUpdate() {

      },
      handleBack() {
      this.$router.push({
        path:`/examinationPaper/`,
      })
    },
    
    }
  }
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  .updatePaper{
    padding: 20px 0;
    .back{
      position: fixed;
      top: 15vh;
      right:5vh;
    }
    .delete_button{
      position: absolute;
      right:5vh;
    }
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