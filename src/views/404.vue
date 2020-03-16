<template>
  <v-container fluid>
    <h1 class="error-title">404</h1>
    <h3>{{ message }}</h3>
    <a href class="btn-rounded">返回首页</a>
  </v-container>
</template>

<script>
export default {
  name: "Page404",
  computed: {
    message() {
      return "抱歉，您访问的页面地址有误或者该页面不存在...";
    }
  },
  methods: {
    handle() {}
  }
};
</script>

<style lang="scss" scoped></style>
