<template>
  <div>
    <div class="header-top">
      <div class="title">在线考试系统</div>
      <div class="login">
        <!-- <div class="time">登录时间：{{logintime |format('yyyy-MM-dd hh:mm')}}</div> -->
        <div class="name">登录用户：{{name}}</div>

        <div class="right-menu">
          <el-dropdown class="avatar-container right-menu-item"
                       trigger="click">
            <div class="avatar-wrapper">
              <img src="@/assets/images/index_icon.png"
                   class="user-avatar">
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/">
                <el-dropdown-item>
                  首页
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item divided>
                <span style="display:block;"
                  @click="logout">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

    </div>
    <div class="app-wrapper">
      <div 
           class="drawer-bg"
           @click="handleClickOutside" />
      <sidebar class="sidebar-container" />
      <div class="main-container"
           style="position: static;top: 0;">
        <!-- <sticky :stickyTop="49">
          <navbar />
          <tags-view />
        </sticky> -->
        <div style="height: 70px;"></div>
        <app-main />
      </div>

    </div>
  </div>
</template>

<script>
import { Sidebar, AppMain} from "./components";
import { mapGetters } from "vuex";
import { getName } from "@/commons/utils/auth";
import { getTime } from "@/commons/utils/auth";
export default {
  name: "Layout",
  components: {
    Sidebar,
    AppMain,
  },
  data () {
    return {
      name: getName(),
      logintime: getTime(),
    };
  },
  mounted () {
    console.log(this.logintime)
  },
  // mixins: [ResizeMixin],
  computed: {
    
  },
  methods: {
    logout () {
      this.$store.dispatch("LogOut").then(() => {
        // location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        this.$store.dispatch("delAllViews");
        this.$router.push({ path: "/login" });
      });
    },
    handleClickOutside () {
      this.$store.dispatch("closeSideBar", { withoutAnimation: false });
    },
    // getBubble() {
    //   bubbleEmergencyEvent().then(res => {
    //     this.bubbleNum = res.data;
    //   });
    // }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/commons/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  /* background: #000; */
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.header-top {
  position: fixed;
  top: 0px;
  width: 100%;
  height: 3rem;
  z-index: 99;
  overflow: hidden;
  height: 65px;
  line-height: 65px;
  color: #005988;
  .title {
    font-size: 1.3rem;
    width: auto;
    font-weight: bold;
    text-align: left;
    float: left;
    margin-left: 30px;
  }
  .login {
    height: inherit;
    float: right;
    font-size: 14px;
    width: auto;
    text-align: center;
    .time {
      border-right: 1px solid #005988;
    }
    .time,
    .name {
      display: inline-block;
      padding: 0 30px;
    }
  }
}
.event-item {
  position: fixed;
  right: 2rem;
  bottom: 1rem;
  z-index: 1000;
}
.right-menu {
  float: right;
  height: 100%;
  &:focus {
    outline: none;
  }
  .right-menu-item {
    display: inline-block;
    margin: 0 8px;
  }
  .screenfull {
    height: 20px;
  }
  .international {
    vertical-align: top;
  }
  .theme-switch {
    vertical-align: 15px;
  }
  .avatar-container {
    height: 50px;
    margin-right: 30px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 12px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 18px;
        font-size: 12px;
      }
    }
  }
}
</style>