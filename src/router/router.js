/**
 * 异步路由表
 */
import Layout from "@/layout";

// 渲染一个空<router-view></router-view>路由出口
const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}
// 前端路由表
export const constantRouterComponents = {
  Layout: Layout,
  RouteView: RouteView,
  'Home': () => import("@/views/Home.vue"),
  'Test': () => import("@/views/test/index.vue"),
  'PasswordSet': () => import("@/views/set/password-set/index.vue"),
  'Edit': () => import("@/views/it/asset/edit/index.vue"),
  'Time': () => import("@/views/it/asset/time/index.vue")
};
