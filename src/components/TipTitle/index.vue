<template>
    <div class="log-row">
            <el-row class="row-tip" style="">
              <el-col :span="9">
                <label class="log-title">{{title}}</label>
              </el-col>
            </el-row>
           <slot></slot>
          </div>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:''
        }
    }
}
</script>

<style>
.log-row {
  margin-top: 1rem;
}
.row-tip{
  margin-bottom: 1rem;
  text-align: left;
  border-bottom: 1px solid #dcdfe6;
  height: 2rem;
}
.log-title {
  margin-left: 3px;
  display: block;
  font-size: 1.3rem;
  width: 150px;
  border-bottom: 2px solid #61d4ff;
  padding-bottom: 0.2rem;
}
</style>


