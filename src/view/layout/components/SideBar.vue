<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      
      <div class="menu-wrapper">
        <el-submenu index="1">
          <template slot="title">
            <svg-icon icon-class="update-psw"/>
            <span slot="title">密码管理</span>
          </template>

          <template>
            <router-link to="/updatePSW" >
              <el-menu-item index="/updatePSW">
                <span slot="title">修改密码</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>

      </div>
      <div class="menu-wrapper">
        <el-submenu index="2">
          <template slot="title">
            <svg-icon icon-class="score"/>
            <span slot="title">成绩管理</span>
          </template>

          <template>
            <router-link to="/score" >
              <el-menu-item index="/score">
                <!-- <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"/> -->
                <span slot="title">查看成绩</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>

      </div>
      <div v-if="role=='管理员'" class="menu-wrapper">
        <el-submenu index="3">
          <template slot="title">
            <svg-icon icon-class="user"/>
            <span slot="title">用户管理</span>
          </template>

          <template>
            <router-link to="/user" >
              <el-menu-item index="/user">
                <!-- <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"/> -->
                <span slot="title">用户管理</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>

      </div>
      <div v-if="role=='管理员'" class="menu-wrapper">
        <el-submenu index="4">
          <template slot="title">
            <svg-icon icon-class="class"/>
            <span slot="title">班级管理</span>
          </template>
          <template>
            <router-link to="/class" >
              <el-menu-item index="/class">
                <span slot="title">班级管理</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </div>
      <div v-if="role != '学生'" class="menu-wrapper">
        <el-submenu index="5">
          <template slot="title">
            <svg-icon icon-class="paper"/>
            <span slot="title">试卷管理</span>
          </template>

          <!-- <template>
            <router-link to="/examinationPaper/autoGeneration" >
              <el-menu-item index="/examinationPaper/autoGeneration">
                <span slot="title">自动组卷</span>
              </el-menu-item>
            </router-link>
          </template> -->
          <template>
            <router-link to="/examinationPaper" >
              <el-menu-item index="/examinationPaper">
                <span slot="title">试卷管理</span>
              </el-menu-item>
            </router-link>
          </template>
          <template>
            <router-link to="/paperAnalysis" >
              <el-menu-item index="/paperAnalysis">
                <span slot="title">试卷分析</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>

      </div>
      <div v-if="role != '学生'" class="menu-wrapper">
        <el-submenu index="6">
          <template slot="title">
            <svg-icon icon-class="itemBank"/>
            <span slot="title">题库管理</span>
          </template>

          <template>
            <router-link to="/itemBank/singleSelect" >
              <el-menu-item index="/itemBank/singleSelect">
                <span slot="title">单选题管理</span>
              </el-menu-item>
            </router-link>
          </template>
          <template>
            <router-link to="/itemBank/SAQ" >
              <el-menu-item index="/itemBank/SAQ">
                <span slot="title">判断题管理</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </div>
      <div class="menu-wrapper">
        <el-submenu index="7">
          <template slot="title">
            <svg-icon icon-class="examlist"/>
            <span slot="title">考试管理</span>
          </template>

          <template v-if="role == '学生'" >
            <router-link to="/examList" >
              <el-menu-item index="/examList">
                <span slot="title">考试列表</span>
              </el-menu-item>
            </router-link>
          </template>
          <template v-else >
            <router-link to="/examArrange" >
              <el-menu-item index="/examArrange">
                <span slot="title">考试安排</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </div>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRole } from "@/commons/utils/auth";
// import SidebarItem from './SidebarItem'
export default {
  // components: { SidebarItem },
  data(){
    return{
      role: getRole(),
    }
  },
  computed: {
    ...mapGetters([
      'privRouters',
      // 'permission_routers',
      'sidebar'
    ]),
    // isCollapse() {
    //   // console.log("privRouters",this.privRouters)
    //   return !this.sidebar.opened
    // }
  }
}
</script>

<style>
.scrollbar-wrapper.el-scrollbar__wrap{
  height: 90% !important;
  text-align: left;
}
</style>
