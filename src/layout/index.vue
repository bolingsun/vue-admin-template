<template>
  <div>
    Layout
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Layout",
  components: {},
  data() {
    return {
      drawer: false,
      defaultAvatar: require("../assets/avatar.png")
    };
  },
  filters: {
    roleFilter(role) {
      if (role === "admin") {
        return "管理员";
      } else {
        return "普通用户";
      }
    }
  },
  computed: {
    ...mapGetters(["avatar", "name", "role", "permission_routes"]),
    key() {
      return this.$route.path;
    },
    infoShow() {
      if (this.name) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    // console.log(this.permission_routes);
  },
  methods: {
    // 退出登录
    async handleLogOut() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      this.$message({
        type: "success",
        message: "退出成功"
      });
    }
  }
  // activated() {
  // },
  // deactivated() {
  // }
};
</script>
<style lang="scss">
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
