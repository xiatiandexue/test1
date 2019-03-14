<template>
  <el-form ref="form" :model="Data" label-width="120px">
    <tip-title title="基本信息"></tip-title>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="科目">
          <el-select v-model="Data.subject" placeholder="请选择科目">
            <el-option label="语文" value="Chinese"></el-option>
            <el-option label="数学" value="Math"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="试卷总分"><el-input v-model="Data.score"></el-input></el-form-item>
      </el-col>
    </el-row>
    <tip-title title="试卷信息"></tip-title>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="单选题数量"><el-input v-model="Data.select"></el-input></el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="简答题数量"><el-input v-model="Data.SAQ"></el-input></el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
          <el-form-item label="第一章题目数"><el-input v-model="Data.one"></el-input></el-form-item>
      </el-col>
      <el-col :span="6">
          <el-form-item label="第二章题目数"><el-input v-model="Data.two"></el-input></el-form-item>
      </el-col>
      <el-col :span="6">
          <el-form-item label="第三章题目数"><el-input v-model="Data.three"></el-input></el-form-item>
      </el-col>
    </el-row>
    <el-row>
        <el-col :span="18">
          <el-button type="primary" @click="handleCreate" style="float:right;">生成试卷</el-button>
        </el-col>
    </el-row>
  </el-form>
</template>

<script>
import TipTitle from '@/components/TipTitle'

export default {
  name: '',
  components: {
    TipTitle,
  },
  data() {
    return {
      Data: {
        subject: '',
        score: '',
        select: '',
        SAQ: '',
        one: '',
        two: '',
        three: ''

      },
    }
  },
  methods: {
    handleCreate() {

    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">

</style>