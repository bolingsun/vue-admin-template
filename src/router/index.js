import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";

Vue.use(VueRouter);

/* 布局 */
import Layout from "@/layout";

/**
 * 常规路由，不需要权限角色判断
 * icon: 菜单栏图表
 * title： 菜单栏标题
 * hidden:true设置来显示隐藏菜单（设置为true，改路由不会显示在左侧菜单中）
 */
export const constantRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    meta: {
      icon: "mdi-home",
      title: "首页"
    },
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/Home.vue")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/Login.vue"),
    meta: {
      icon: "mdi-home",
      title: "登录页"
    }
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404.vue"),
    hidden: true
  }
];
/**
 * 动态路由
 * 需要角色判断
 * icon: 菜单栏图表
 * title： 菜单栏标题
 * roles:[], 需要的角色权限类别，admin或是user
 */
export const asyncRoutes = [{ path: "*", redirect: "/404", hidden: true }];
const createRouter = () =>
  new VueRouter({
    // mode: 'history', // require service support
    routes: constantRoutes
  });
const router = createRouter();
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}
export default router;
