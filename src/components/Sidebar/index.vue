<template>
  <div class="sidebar-wrapper">
    <el-menu mode="vertical" router :default-active="this.$route.path">
      <menu-item
        v-for="route in permission_routes"
        :key="route.path"
        :item="route"
      ></menu-item>
    </el-menu>
    <!-- <el-menu mode="vertical" router>
      <el-menu-item index="/home">
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <span slot="title">系统设置</span>
        </template>
        <el-menu-item index="/set/password-set">
          <span slot="title">密码设置</span>
        </el-menu-item>
      </el-submenu>
    </el-menu> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MenuItem from "./menu-item";
export default {
  name: "Sidebar",
  components: {
    MenuItem
  },
  computed: {
    ...mapGetters(["permission_routes"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    }
  },
  created() {
    console.log(this.permission_routes);
  }
};
</script>
