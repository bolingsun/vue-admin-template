import { asyncRoutes, constantRoutes } from "@/router";

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
//定义一个递归方法
function handleChildrenMenu(menuRouters, menuList) {
  menuRouters.forEach(r => {
    menuList.forEach(m => {
      if (m.parent_id && m.parent_id == r.meta.id) {
        if (!r.children) {
          r.children = [];
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
        meta: { id: m.id, title: m.title, fullPath: "/" + m.path },
        children: [
          {
            path: "",
            component: () => import("@/views/" + m.path + "/index"),
            meta: {
              menuHide: true,
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

const state = {
  routes: [],
  addRoutes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  }
};

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
