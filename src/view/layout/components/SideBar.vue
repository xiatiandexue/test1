<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      router
    >
      <div class="menu-item">
        <el-menu-item index="/updatePSW">
          <svg-icon icon-class="update-psw"/>
          <span slot="title">修改密码</span>
        </el-menu-item>
      </div>
      <div class="menu-item">
        <el-menu-item index="/score">
          <svg-icon icon-class="score"/>
          <span slot="title">成绩管理</span>
        </el-menu-item>
      </div>
      <div v-if="role=='管理员'" class="menu-item">
        <el-menu-item index="/user">
          <svg-icon icon-class="user"/>
          <span slot="title">用户管理</span>
        </el-menu-item>
      </div>
      <div v-if="role=='管理员'" class="menu-item">
        <el-menu-item index="/class">
          <svg-icon icon-class="class"/>
          <span slot="title">班级管理</span>
        </el-menu-item>
      </div>
      <div v-if="role != '学生'" class="menu-item">
        <el-menu-item index="/examinationPaper">
          <svg-icon icon-class="paper"/>
          <span slot="title">试卷管理</span>
        </el-menu-item>
      </div>
      <div v-if="role != '学生'" class="menu-wrapper">
        <el-submenu index="6">
          <template slot="title">
            <svg-icon icon-class="itemBank"/>
            <span slot="title">题库管理</span>
          </template>

          <template>
              <el-menu-item index="/itemBank/Chinese">
                <span slot="title">大学语文</span>
              </el-menu-item>
          </template>
          <template>
              <el-menu-item index="/itemBank/history">
                <span slot="title">中国古代历史</span>
              </el-menu-item>
          </template>
        </el-submenu>
      </div>
      <div class="menu-item">
        <el-menu-item index="/examList" v-if="role == '学生'">
          <svg-icon icon-class="examlist"/>
          <span slot="title">考试列表</span>
        </el-menu-item>
        <el-menu-item index="/examArrange" v-else>
          <svg-icon icon-class="examlist"/>
          <span slot="title">考试安排</span>
        </el-menu-item>
      </div>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRole } from "@/commons/utils/auth";
export default {
  data(){
    return{
      role: getRole(),
    }
  },
  computed: {
    ...mapGetters([
      'privRouters',
      'sidebar'
    ]),
   
  }
}
</script>

<style>
.scrollbar-wrapper.el-scrollbar__wrap{
  height: 90% !important;
  text-align: left;
}
</style>
