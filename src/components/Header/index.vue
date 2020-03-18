<template>
  <header class="header">
    <img :src="logoUrl" alt="logo" class="header__img" />
    {{ sysTitle }}
    <div class="fr">
      <el-button size="small" @click="handleLogout">退出</el-button>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    logoUrl: {
      type: String,
      default: "/images/logo.png"
    },
    sysTitle: {
      type: String,
      default: "后台管理系统"
    }
  },
  methods: {
    handleLogout() {
      this.$store.dispatch("user/logout").then(() => {
        this.$router.push("/login");
      });
    }
  }
};
</script>

<style></style>
