<template>
  <el-form ref="form" :model="Data" label-width="120px" rules="rules">
    <el-row>
      <el-col :span="8">
        <div>
          
        </div>
      </el-col>
      <el-col :span="16">
        <div>
          <tip-title title="基本信息"></tip-title>
          <el-row>
            <el-form-item label="试卷名" prop="name">
              <el-input v-model="Data.name"></el-input>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="科目" prop="subject">
                <el-select v-model="Data.subject" placeholder="请选择科目">
                  <el-option label="大学语文" value="大学语文"></el-option>
                  <el-option label="中国古代历史" value="中国古代历史"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="试卷总分"><el-input v-model="Data.score"></el-input></el-form-item>
            </el-col>
          </el-row>
          <tip-title title="单选题"></tip-title>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="单选题总数"><el-input v-model="Data.totalselect"></el-input></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单选题分数"><el-input v-model="Data.selectscore"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="7">
                <el-form-item label="第一章题目数"><el-input v-model="Data.one"></el-input></el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="第二章题目数"><el-input v-model="Data.two"></el-input></el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="第三章题目数"><el-input v-model="Data.three"></el-input></el-form-item>
            </el-col>
          </el-row>
          <tip-title title="判断题"></tip-title>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="判断题总数"><el-input v-model="Data.totalsaq"></el-input></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="判断题分数"><el-input v-model="Data.saqscore"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
                <el-form-item label="第一章题目数"><el-input v-model="Data.one"></el-input></el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="第二章题目数"><el-input v-model="Data.two"></el-input></el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="第三章题目数"><el-input v-model="Data.three"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row>
              <el-col :span="23">
                <el-button type="primary" @click="handleCreate" style="float:right;">生成试卷</el-button>
              </el-col>
          </el-row>
        </div>

      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import TipTitle from '@/components/TipTitle'
import paper from '@/commons/api/paper'
import { notify } from '@/commons/utils/notify'
import {autoGeneratingPaperRules} from '@/commons/utils/validate'
import { getName } from "@/commons/utils/auth"
import { getRole } from "@/commons/utils/auth"

export default {
  name: '',
  components: {
    TipTitle,
  },
  data() {
    return {
      Data: {
        name: '',
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
            if (res) {
              this.dialogVisible = false
              this.getList()
              this.Data = {
                name: '',
                subject: '',
                score: '',
                selectnum: '',
                saqnum: '',
                createuser: getName()
              }
              
            }
          })
        }
      })
    },
  }
}

</script>

<style rel="stylesheet/scss" lang="scss">

</style>