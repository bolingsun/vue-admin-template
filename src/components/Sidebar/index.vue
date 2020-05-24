<template>
  <div class="sidebar-wrapper">
    <div class="hamburger">
      <el-divider>
        <i class="iconfont" :class="styleObj" @click="toggleClick"></i>
      </el-divider>
    </div>
    <el-menu
      mode="vertical"
      router
      :default-active="this.$route.path"
      :collapse="!sidebar.opened"
      :collapse-transition="false"
    >
      <sidebar-item v-for="route in menus" :key="route.path" :item="route"></sidebar-item>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
export default {
  name: "Sidebar",
  components: {
    SidebarItem
  },
  data() {
    return {
      isCollapse: false,
      menus: [] // base map 对应baiseLayout的路由表
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
    const routes = this.permission_routes.find(item => item.path === "/");
    this.menus = (routes && routes.children) || [];
    console.log("menus", this.menus);
  },
  methods: {
    toggleClick() {
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
