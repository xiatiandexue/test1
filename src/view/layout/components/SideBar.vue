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
            <!-- <svg-icon :icon-class="item.meta.icon"/> -->
            <span slot="title">密码管理</span>
          </template>

          <template>
            <router-link to="/updatePSW" >
              <el-menu-item index="/updatePSW">
                <!-- <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"/> -->
                <span slot="title">修改密码</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>

      </div>
      <div class="menu-wrapper">
        <el-submenu index="2">
          <template slot="title">
            <!-- <svg-icon :icon-class="item.meta.icon"/> -->
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
            <!-- <svg-icon :icon-class="item.meta.icon"/> -->
            <span slot="title">试卷管理</span>
          </template>

          <template>
            <router-link to="/examinationPaper/autoGeneration" >
              <el-menu-item index="/examinationPaper/autoGeneration">
                <!-- <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"/> -->
                <span slot="title">自动组卷</span>
              </el-menu-item>
            </router-link>
          </template>
          <template>
            <router-link to="/examinationPaper" >
              <el-menu-item index="/examinationPaper">
                <!-- <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"/> -->
                <span slot="title">试卷管理</span>
              </el-menu-item>
            </router-link>
          </template>
          <template>
            <router-link to="/examinationPaper/updatePaper" >
              <el-menu-item index="/examinationPaper/updatePaper">
                <!-- <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"/> -->
                <span slot="title">更新试卷</span>
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
