<template>
  <el-form ref="form" :model="Data" label-width="120px" rules="rules">
    <tip-title title="基本信息"></tip-title>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="科目" prop="subject">
          <el-select v-model="Data.subject" placeholder="请选择科目">
            <el-option label="语文" value="语文"></el-option>
            <el-option label="历史" value="历史"></el-option>
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
        <el-form-item label="单选题数量"><el-input v-model="Data.selectnum"></el-input></el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="简答题数量"><el-input v-model="Data.saqnum"></el-input></el-form-item>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="20">
      <el-col :span="6">
          <el-form-item label="第一章题目数"><el-input v-model="Data.one"></el-input></el-form-item>
      </el-col>
      <el-col :span="6">
          <el-form-item label="第二章题目数"><el-input v-model="Data.two"></el-input></el-form-item>
      </el-col>
      <el-col :span="6">
          <el-form-item label="第三章题目数"><el-input v-model="Data.three"></el-input></el-form-item>
      </el-col>
    </el-row> -->
    <el-row>
        <el-col :span="18">
          <el-button type="primary" @click="handleCreate" style="float:right;">生成试卷</el-button>
        </el-col>
    </el-row>
  </el-form>
</template>

<script>
import TipTitle from '@/components/TipTitle'
import paper from '@/commons/api/paper'
import { notify } from '@/commons/utils/notify'
import {autoGeneratingPaperRules} from '@/commons/utils/validate'

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
        selectnum: '',
        saqnum: '',
        // one: '',
        // two: '',
        // three: ''

      },
      rules: autoGeneratingPaperRules
    }
  },
  methods: {
    handleCreate() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          paper.autoGenerating(this.Data).then(response => {
            var res = notify(this, response)
            // if (res) {
              // this.dialogVisible = false
            //   this.getList()
            // }
          })
        }
      })
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">

</style>