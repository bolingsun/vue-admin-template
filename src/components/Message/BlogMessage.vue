<template>
  <div>
    <v-snackbar v-model="visible" :timeout="duration" top :color="color">
      {{ message }}
      <v-btn color="blue" text @click="visible = false">
        关闭
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
// 定义每一个 type 对应的 class 类名
const typeClass = {
  success: "#4caf50",
  error: "#ff5252",
  info: "#2196f3",
  default: "info"
};
export default {
  name: "messageMain",
  // 定义的是默认数据, 默认值
  data() {
    return {
      visible: false, // 控制 DOM 显示隐藏
      type: "success", // 默认 type 值为 default
      message: "default", // 默认的 message 为空, 由外部传入
      duration: 2000 // 默认显示时间为 2000ms
    };
  },
  computed: {
    // 如果外部传入 icon 则使用外部的 icon, 如果没有. 则使用 type 值对应的 icon
    color() {
      return typeClass[this.type];
    }
  }
};
</script>
