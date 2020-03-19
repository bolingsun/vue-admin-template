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
          console.log(accessRoutes);
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
/**
 * 添加路由
 * @param to
 * @param next
 */
function routerGo(to, next) {
  // 获取sessionStorage中的router字段，并序列化
  const routerData = JSON.parse(sessionStorage.getItem("router"));

  // 如果前线列表是空的，返回提示
  if (!routerData.length) {
    return Message.error("当前权限列表为空！");
  }

  // layout组件是主页布局文件，需要手动引入
  const asyncRouter = [
    {
      name: "Layout",
      path: "/layout",
      component: () => import("@/layout/index.vue"),
      children: []
    }
  ];

  // 通过componentPath创建component组件
  asyncRouter[0].children = transformVueRouterDataToVueRouterComponent(
    routerData
  );

  // 在路由末尾添加404
  asyncRouter.push({
    path: "*",
    name: "notFount",
    component: () => import("@/views/404.vue")
  });

  // 添加动态路由
  router.addRoutes(asyncRouter);

  next({ ...to, replace: true });
}
/**
 * 接口列表格式转换成满足vue-router的对应字段
 * @param data
 * @param array
 * @param str
 * @returns {Array}
 */
function transformHttpDataToVueRouterData(data, array = [], str = "/") {
  data.forEach((item, index) => {
    array.push({
      menuId: item.menuId,
      label: item.menuName,
      path: item.menuUrl,
      name: toCamel(item.menuUrl),
      icon: item.menuIcon,
      // 这个字段是用来做浏览器地址链接有用的
      componentPath: `${str}${item.menuUrl}`,
      children: []
    });
    if (item.subMenuList && item.subMenuList.length) {
      array[index].redirect = {
        name: toCamel(item.subMenuList[0].menuUrl)
      };
      transformHttpDataToVueRouterData(
        item.subMenuList,
        array[index].children,
        `${array[index].componentPath}/`
      );
    } else {
      array[index].redirect = null;
    }
  });
  return array;
}
/**
 * 将component字段转成component组件
 * @param root
 * @returns {*}
 */
function transformVueRouterDataToVueRouterComponent(root) {
  root.forEach(item => {
    let path = item.componentPath;
    path = path + "/" + toCamel(path.substring(path.lastIndexOf("/") + 1));

    // 因为webpack引入import机制的问题。全部转成变量不能解析
    item.component = () => import(`./view${path}.vue`);
    if (item.children && item.children.length) {
      transformVueRouterDataToVueRouterComponent(item.children);
    }
  });

  return root;
}
/**
 * 中划线命名转大驼峰命名
 * @param str
 * @returns {*}
 */
function toCamel(str) {
  str = str.replace(/(\w)/, (match, $1) => `${$1.toUpperCase()}`);
  while (str.match(/\w-\w/)) {
    str = str.replace(
      /(\w)(-)(\w)/,
      (match, $1, $2, $3) => `${$1}${$3.toUpperCase()}`
    );
  }
  return str;
}
// +++++++++++++++++++++++++++++++
// router.beforeEach(async (to, from, next) => {
//   const hasToken = getToken();
//   if (hasToken) {
//     /* 有token */
//     if (to.path === "/login/index") {
//       // 有token,请求的是登录页面,直接返回首页
//       next({ path: "/home" });
//     } else {
//       const hasRole = store.getters.role;
//       if (hasRole) {
//         next();
//       } else {
//         try {
//           const { role } = await store.dispatch("user/getInfo");
//           const accessRoutes = await store.dispatch(
//             "permission/generateRoutes",
//             [role]
//           );
//           router.addRoutes(accessRoutes);
//           next({ ...to, replace: true });
//         } catch (error) {
//           // 移除 token，跳转登录页重新登录
//           await store.dispatch("user/resetToken");
//           Message.message({
//             type: "error",
//             message: "获取用户信息失败，请重新登录"
//           });
//           console.log(error);
//           next({ path: "/login" });
//         }
//       }
//     }
//   } else {
//     /* 无token */
//     // 没有token,意味没有登录。如果vuex中的路由表为空，就需要调用设置默认路由，这样路由菜单才有东西可以渲染展示。
//     if (store.state.permission.routes.length === 0) {
//       store.dispatch("permission/generateDefaulRotes");
//     }
//     if (to.meta.requireAuth) {
//       // 该路由需要登录权限
//       if (store.state.user.token) {
//         // vuex state中获取到当前的token是否存在
//         next();
//       } else {
//         next({
//           path: "/login"
//           // query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
//         });
//       }
//     } else {
//       // 该路由不需要登录权限
//       next();
//     }
//   }
// })
