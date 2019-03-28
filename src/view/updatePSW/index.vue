<template>
  <div class="updatePSW">
  <el-form :model="addUserFormData" ref="vueElForm" :rules="rules" label-width="80px">
    <el-form-item label="密码"  prop="password">
      <el-input type="password" v-model="addUserFormData.password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="password_confirm">
      <el-input type="password" v-model="addUserFormData.password_confirm" placeholder="确认密码"></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="update()">确 定</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
  // import { pswRules } from "@/commons/utils/validate";
export default {
  
  data(){                
    var validatePass = (rule, value, callback) => {            
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.addUserFormData.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return{
      addUserFormData:{
        password:'',
        password_confirm:''
      },
      rules:{
        password_confirm:[
          {require: true, validator: validatePass, trigger: 'blur' }
        ]    
      }
    }
  },
  method: {
    update () {
      this.$refs["vueElForm"].form.validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.addUserFormData);
          system.updatePSW(tempData).then(response => {
              //通知
              var res = notify(this, response);
              if (res) {
                  this.getList();
              }
          });
        }
      });
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.updatePSW{
  width: 40vh;
  height: 40vh;
  vertical-align: middle;
  margin: 20px auto;
}
</style>