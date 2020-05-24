import router from "./router";
import store from "./store";
import { getToken } from "@/utils/auth"; // 从cookie中拿去token
import { Message } from "element-ui";

const whiteList = ["/login"]; // 不重定向白名单
router.beforeEach(async (to, from, next) => {
  const hasToken = getToken();
  if (hasToken) {
    // 有token且进入的是登入页面，则直接进入首页
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      /* 有token不是login页面的情况（正常的路由切换），每次页面刷新清空vuex的roleMenu后都会重新去拉取权限数据，保证是最新的权限数据*/
      const hasMenus =
        store.getters.addRoutes && store.getters.addRoutes.length > 0;
      if (hasMenus) {
        next();
      } else {
        try {
          // 获取用户权限菜单数据
          const asyncRouterMap = await store.dispatch("user/GetUserMenu");
          // 根据权限生成的动态路由表
          const accessRoutes = await store.dispatch(
            "permission/GetRouters",
            asyncRouterMap
          );
          // console.log(accessRoutes);
          // 动态添加可访问路由表
          router.addRoutes(accessRoutes);
          // hack方法 确保addRoutes已完成
          next({ ...to, replace: true });
        } catch (error) {
          // 移除 token，跳转登录页重新登录
          await store.dispatch("user/resetToken");
          Message.error(error || "获取用户信息失败，请重新登录");
          next({ path: "/login" });
        }
      }
    }
  } else {
    /* cookie中没有token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 当前页面为值得信任的页面免验证的页面则直接进入（要进入的页面能够在白名单中找到）
      next();
    } else {
      // 否则全部重定向到登录页
      next("/login");
    }
  }
});
