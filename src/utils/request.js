import axios from "axios";
import store from "@/store";
import { getToken } from "@/utils/auth";
import router from "../router";
import { Message } from "element-ui";
// 创建axios实例
const service = axios.create({
  // baseURL: "http://localhost:3000",
  // baseURL: process.env.url_api, // 生成环境正式的服务器地址(build时候打开)
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60 * 1000 // 请求超时时间设置
});

// request 拦截器
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   // 让每个请求携带token
    //   // ['X-Token'] 未自定义key
    //   config.headers["token"] = getToken();
    // }
    config.headers["x-token"] = getToken();
    return config;
  },
  error => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  // response => response, // 如果需要返回http信息譬如头部信息或状态，就使用该方式
  response => {
    const res = response.data;
    // 如果返回后端定义的code不是 1 ，就视为一个错误返回.
    if (res.status !== 1) {
      console.log(res.errMsg || "Error");
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 token超时、过期, 清除token信息并跳转到登录页面
          store.dispatch("user/resetToken").then(() => {
            // location.reload();
            router.replace({
              path: "/login"
            });
          });
      }
    }
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);

export default service;
