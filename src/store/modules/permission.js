import { constantRoutes } from "@/router";
import { asyncRouterMap } from "@/router/router.js";

// Layout 是架构组件，不在后台返回，在文件里单独引入
import Layout from "@/layout";

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

export function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      // if (tmp.children) {
      //   tmp.children = filterAsyncRoutes(tmp.children, roles);
      // }
      res.push(tmp);
    }
  });

  return res;
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
//定义一个递归方法, 处理子路由菜单
function handleChildrenMenu(menuRouters, menuList) {
  menuRouters.forEach(r => {
    menuList.forEach(m => {
      if (m.parent_id && m.parent_id == r.meta.id) {
        if (!r.children) {
          r.children = [];
        }
        // 如果root根路由中有其他的子路由菜单，就将上一步添加的path为index的路由，删掉。
        if (r.children && r.children[0] && r.children[0].path === "index") {
          // 根路由有子路由的话，就需要重写根路由的meta标签内的fullpath属性,上一步的fallpath为xxx/index, 现在需要修改回xxx,去掉index
          r.meta.fullPath = r.path;
          r.children.shift();
          // 修改root路由的redirect为第一个子菜单路径
          r.redirect = r.path + "/" + m.path;
        } else {
          // 这是submenu,如果redirect没有设置的话，就讲redirect重定向到它的第一个子菜单
          if (!r.redirect) {
            r.redirect = r.path + "/" + m.path;
          }
        }
        m.fullPath = r.meta.fullPath + "/" + m.path;
        let menu = {
          path: m.path,
          name: toCamel(m.path),
          component: () => import("@/views" + r.meta.fullPath + "/" + m.path),
          meta: {
            id: m.id,
            title: m.title,
            fullPath: r.meta.fullPath + "/" + m.path
          }
        };
        r.children.push(menu);
      }
    });
    if (r.children) {
      handleChildrenMenu(r.children, menuList);
    }
  });
  return menuRouters;
}

function filterAsyncRouter(menuList) {
  let menuRouters = [];
  // 先找出所有的根菜单并完成设置
  menuList.forEach((m, i) => {
    if (m.parent_id == null) {
      m.fullPath = "/" + m.path;
      let root = {
        path: "/" + m.path,
        name: toCamel(m.path),
        component: Layout,
        redirect: "/" + m.path + "/index",
        meta: {
          id: m.id,
          title: m.title,
          fullPath: "/" + m.path + "/index",
          icon: m.icon
        },
        children: [
          {
            path: "index",
            hidden: true,
            component: () => import("@/views/" + m.path + "/index"),
            meta: {
              title: m.title
            }
          }
        ]
      };
      menuRouters.push(root);
    }
  });
  let res = handleChildrenMenu(menuRouters, menuList);
  return res;
}
/**
 * 根据路由列表及菜单数据生成最终的路由信息
 * @param {Array} asyncRouterMap    -路由列表
 * @param {Array} menuData          -菜单数据
 */
function generateRoutes(asyncRouterMap, menuData) {
  // console.log(asyncRouterMap);
  // console.log(menuData);
  const accessedRouters = asyncRouterMap.filter(route => {
    addRouterMeta(route, menuData);
    if (route.children && route.children.length) {
      route.children = generateRoutes(route.children, menuData);
    }
    return true;
  });
  return accessedRouters;
}

/**
 * 如果与当前用户菜单匹配，则添加 route.meta元数据对象。
 * @param {Array} route            -路由对象
 * @param {Array} menuData         -菜单数据
 */
function addRouterMeta(route, menuData) {
  menuData.find((menu, index, arr) => {
    let isExist = menu.menuUrl.indexOf(route.path) > -1;
    if (!isExist) {
      if (menu.children && menu.children.length) {
        isExist = addRouterMeta(route, menu.children);
      }
    } else {
      if (!route.meta) {
        route.meta = {};
      }
      route.meta.title = menu.menuName;
      // route.meta.buttonList = menu.buttonList;
      route.meta.id = menu.id;
      if (menu.menuUrl.indexOf("?") > -1) {
        route.meta.useFullPath = true;
      } else {
        route.meta.useFullPath = false;
      }
    }
    return isExist;
  });
}

const state = {
  routes: [],
  addRoutes: []
};

const mutations = {
  SET_ADDROUTES: (state, accessedRoutes) => {
    // 保存异步路由可访问的name值
    state.addRoutes = accessedRoutes;
  },
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes);
  }
};

// const actions = {
//   // 登录后计算路由菜单（静态路由+动态路由筛选）
// //   GetRouters({ commit }, MenuData) {
// //     return new Promise(resolve => {
// //       const accessedRoutes = generateRoutes(asyncRouterMap, MenuData);
// //       let temp404 = {
// //         path: "*",
// //         redirect: "/404",
// //         hidden: true
// //       };
// //       accessedRoutes.push(temp404);
// //       console.log("aaa", accessedRoutes);
// //       commit("SET_ROUTES", accessedRoutes);
// //       resolve(accessedRoutes);
// //     });
// //   }
// // };
const actions = {
  // 登录后计算路由菜单（静态路由+动态路由筛选）
  GetRouters({ commit }, asyncRouterMap) {
    return new Promise(resolve => {
      const temp404 = {
        path: "*",
        redirect: "/404",
        hidden: true
      };
      const accessedRoutes = filterAsyncRouter(asyncRouterMap);
      accessedRoutes.push(temp404); // 路由最后添加匹配404
      commit("SET_ROUTES", accessedRoutes);
      commit("SET_ADDROUTES", accessedRoutes); // vuex中保存异步获取的路由表
      resolve(accessedRoutes);
    });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
