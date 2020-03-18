import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./permission"; // permission control

// import Message from "./components/Message";
// Vue.use(Message); // 因为我们的对象上定义了 install 方法, 所以可以直接调用 Vue 的 use 方法

// mock模拟假数据api接口
import { mockXHR } from "../mock";
mockXHR();

// 引入element-ui框架
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI, {
  size: "medium"
});

import "@/styles/index.scss"; // global css

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
