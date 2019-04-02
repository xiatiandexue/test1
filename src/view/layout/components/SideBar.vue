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
      <div class="menu-wrapper">
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
      <div class="menu-wrapper">
        <el-submenu index="4">
          <template slot="title">
            <svg-icon icon-class="paper"/>
            <span slot="title">试卷管理</span>
          </template>

          <template>
            <router-link to="/examinationPaper/autoGeneration" >
              <el-menu-item index="/examinationPaper/autoGeneration">
                <span slot="title">自动组卷</span>
              </el-menu-item>
            </router-link>
          </template>
          <template>
            <router-link to="/examinationPaper" >
              <el-menu-item index="/examinationPaper">
                <span slot="title">试卷管理</span>
              </el-menu-item>
            </router-link>
          </template>
          <template>
            <router-link to="/examinationPaper/updatePaper" >
              <el-menu-item index="/examinationPaper/updatePaper">
                <span slot="title">更新试卷</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>

      </div>
      <div class="menu-wrapper">
        <el-submenu index="5">
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
                <span slot="title">简单题管理</span>
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
// import SidebarItem from './SidebarItem'
export default {
  // components: { SidebarItem },
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
