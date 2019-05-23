<template>
  <div class="app-container Chinese">
    <el-tabs v-model="activeName">
      <el-tab-pane label="单选题" name="select">
        <single-select :subject="subject"></single-select>
      </el-tab-pane>
      <el-tab-pane label="判断题" name="saq">
        <judge :subject="subject"></judge>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import singleSelect from "./singleSelect/";
  import judge from "./SAQ/";
export default {
  components:{
    singleSelect,judge
  },
  data(){
    return{
      activeName: 'select',
      subject:'大学语文'
    }
  }
}
</script>