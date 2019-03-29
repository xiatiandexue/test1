<template>
<div id="login">
  <img :src="login_img"/>
  <div id="login_main">
      <div id="login_main_top">
        <h1>在线考试系统</h1>
      </div><!-- main头部结尾-->
      <div id="login_main_center">   
          <el-form :model="loginForm" :rules="rules2"  ref="loginForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="usercode" >
              <el-input type="text" v-model="loginForm.usercode" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password"  v-model="loginForm.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户类型" >
              <el-radio-group v-model="loginForm.role">
                <el-radio label="学生">学生</el-radio>
                <el-radio label="教师">教师</el-radio>
                <el-radio label="管理员">管理员</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <span id="login_button_user"><el-button type="primary" @click="doLogin" :loading="loading">登录</el-button></span>
              <!-- <span id="login_button_admin"><el-button type="success" @click="adminLogin">登录</el-button></span> -->
            </el-form-item>
        </el-form>
      </div><!-- main中部结尾-->
  </div><!-- main结尾-->
</div><!-- login结尾-->
</template>
<script>
  export default {
    data() {
      
      var validateUsercode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } 
          callback();
      };
      var validatePassword = (rule, value, callback) => {
         if (value === '') {
          callback(new Error('请输入密码'));
        } 
          callback();
      };
      return {
        login_img: require("@/assets/images/login.jpg"),
        loginForm: {
          usercode: '',
          password: '',
          role: 'admin'
        },
        // 表单验证规则
        rules2: {
          usercode: [
            { validator: validateUsercode, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ]
        },
        loading:false,
      };
    },
    methods: {
        //错误封装方法
        errormsg(msgerror) {
            this.$message.error(msgerror);
        },
        //把获取参数加入全局store中
        change(id,username,password,role){
          this.$store.state.user_id=id;
          this.$store.state.username=username;
          this.$store.state.password=password;
          this.$store.state.role=role;
        },
        //登录加载过渡效果的方法
        load(){
           this.loading = true;
           setTimeout(() => {this.loading = false; }, 1000);
           this.$Loading.start();
           setTimeout(() => {this.$Loading.finish();}, 1000); 
        },
        doLogin() {
          console.log(this.loginForm)
          this.$refs.loginForm.validate(valid => {
            if (valid) {
              this.loading = true;
              this.$store
                .dispatch("LoginByUsername", this.loginForm)
                .then(() => {
                  this.loading = false;
                  this.$router.push({ path: "/" });
                  
                })
                .catch(data => {
                  this.$notify.error({
                    title: '失败',
                    message:'登录失败'})
                  this.loading = false;
                });
            } else {
              console.log("error submit!!");
              return false;
            }
          });
        },
    //     doLogin(){
    //         this.$http.post('http://localhost:8089/Exam/showUser'
    //         ,{
    //           params:{
    //             usercode:this.loginForm.usercode,
    //             password:this.loginForm.password
    //           }, 
    //         }
    //         )
    //         .then(function (response) {
    //           var errorcode=response.data.errorcode;
    //              if(errorcode=="200"){
    //               //  console.debug(response.data.data);
    //                   //进去主界面的过渡效果方法
    //                   this.load();
    //                   //把获取到的参数存入store
    //                   this.change(this.loginForm.usercode,this.loginForm.password,true);
    //                   setTimeout(() => {this.$router.push({ path: '/' });}, 1500); 

    //             }else if(errorcode=="500"){
                    
    //                 //如果返回500，就在页面上方弹出错误信息
    //                 this.errormsg(response.data.errormsg);
    //             }
    //           })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // },

    adminLogin(){
      this.$router.push({ path: '/Layout' });
    },
    register(){
       this.$router.push({ path: '/Register' });
    }
  }
}
</script>

<style>
/*登录form*/
#login{
  width: 100%;
  margin: 0 auto;
  position:relative;
  /*background-color:black;*/
}
/* 登录背景
.login_img{
    width:500px;
    height:400px;
    display:flex;
    align-items:center;
    justify-content:center;
} */
img{
    width:100%;
    height:calc(96.5vh);
}

/*输入框*/
#login_main{
   width: 450px;
   margin: auto;
   /* margin:250px 50px 200px 450px; */
   text-align: center;
   border:1px solid #C0CCDA;
   opacity:0.8;
   border-radius:10px;
   box-shadow:inset 0 0 1px 1px #C0CCDA;
   position:absolute;
   left: 0;
   top: 30%;
   right: 0;
   background-color:#F9FAFC;
}
#login_main_top{
  height: 60px;
  /*background-color:green;*/
  text-align: center;
}
#login_main_center{
   margin: 0px 20% 0px 40px;
   /*background-color:green;*/
}

/*登录按钮*/
#login_button_user{
  margin-right:5px;
}
/*管理员登录按钮*/
#login_button_admin{
  /* margin-left:60px; */
  margin-right:15px;
}
/*注册按钮*/
/*#reset_button{


}*/


  </style>