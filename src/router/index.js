import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layout";
// import Home from "../views/Home.vue";

Vue.use(VueRouter);


/**
 * 常规路由，不需要权限角色判断
 * icon: 菜单栏图表
 * title： 菜单栏标题
 * hidden:true设置来显示隐藏菜单（设置为true，改路由不会显示在左侧菜单中）
 */
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import("@/views/Home.vue"),
        meta: {
          icon: "icon-my-home",
          title: "首页"
        }
      },
      {
        path: "/test",
        component: () => import("@/views/test/index.vue"),
        meta: {
          icon: "icon-my-android-fill",
          title: "测试"
        }
      }
      // 未来其他的属于layout布局下的静态路由，都放在这里
    ]
  },
  {
    path: "/login",
    hidden: true,
    component: () => import("@/views/Login.vue"),
    meta: {
      icon: "icon-my-home",
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
