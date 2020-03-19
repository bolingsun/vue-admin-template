<template>
  <div class="sidebar-wrapper">
    <div class="hamburger">
      <el-divider>
        <i class="iconfont" :class="styleObj" @click="toggleClick"></i>
      </el-divider>
    </div>
    <!-- 方案一 -->
    <!-- <el-menu
      mode="vertical"
      router
      :default-active="this.$route.path"
      :collapse="isCollapse"
    >
      <menu-item
        v-for="route in permission_routes"
        :key="route.path"
        :item="route"
      ></menu-item>
    </el-menu>-->

    <!-- 方案二 -->
    <el-menu
      mode="vertical"
      router
      :default-active="this.$route.path"
      :collapse="!sidebar.opened"
      :collapse-transition="false"
    >
      <sidebar-item
        v-for="route in permission_routes"
        :key="route.path"
        :item="route"
      ></sidebar-item>
    </el-menu>

    <!-- 写死的数据测试 -->
    <!-- <el-menu mode="vertical" router :collapse="isCollapse">
      <el-menu-item index="/home">
        <i class="iconfont icon-my-home" style="margin-right:8px;"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="iconfont icon-my-setting" style="margin-right:8px;"></i>
          <span slot="title">系统设置</span>
        </template>
        <el-menu-item index="/set/password-set">
          <span slot="title">密码设置</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import MenuItem from "./menu-item";
import SidebarItem from "./SidebarItem";
export default {
  name: "Sidebar",
  components: {
    SidebarItem
  },
  data() {
    return {
      isCollapse: false
    };
  },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    styleObj() {
      if (!this.sidebar.opened) {
        return "icon-my-doubleright";
      } else {
        return "icon-my-doubleleft";
      }
    }
  },
  created() {
    // console.log(this.permission_routes);
  },
  methods: {
    toggleClick() {
      // this.isCollapse = !this.isCollapse;
      this.$store.dispatch("app/toggleSideBar");
    }
  }
};
</script>
<style lang="scss" scoped>
.sidebar-wrapper {
  .hamburger {
    cursor: pointer;
  }
}
</style>
