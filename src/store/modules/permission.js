import { constantRoutes } from "@/router";
import { constantRouterComponents } from "@/router/router.js";


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
export function toCamel(str) {
  str = str.replace(/(\w)/, (match, $1) => `${$1.toUpperCase()}`);
  while (str.match(/\w-\w/)) {
    str = str.replace(
      /(\w)(-)(\w)/,
      (match, $1, $2, $3) => `${$1}${$3.toUpperCase()}`
    );
  }
  return str;
}
/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, hidden, target, icon } = item || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: (constantRouterComponents[item.component || item.key]) || (() => import(`@/views/${item.component}`)),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        target: target,
        permission: item.name
      }
    }
    // 是否设置了隐藏菜单
    if (hidden === true) {
      currentRouter.hidden = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      if (currentRouter.path !== '/') {
        currentRouter.component = constantRouterComponents['RouteView'] // 当不是layout路由，并且有子菜单，这个路由的需要子路由出口
      }
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parent_id === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}


// 根级菜单
const rootRouter = {
  key: '',
  name: 'index',
  path: '',
  component: 'Layout',
  redirect: '/home',
  meta: {
    title: '首页'
  },
  children: []
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
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

const actions = {
  // 登录后计算路由菜单（静态路由+动态路由筛选）
  GetRouters({ commit }, result) {
    return new Promise(resolve => {
      const menuNav = []
      const childrenNav = []
      //      后端数据, 根级树数组,  根级 PID
      listToTree(result, childrenNav, 0)
      rootRouter.children = childrenNav
      menuNav.push(rootRouter)
      console.log('menuNav', menuNav)
      const routers = generator(menuNav)
      routers.push(notFoundRouter)
      console.log('routers', routers)
      commit("SET_ROUTES", routers);
      commit("SET_ADDROUTES", routers); // vuex中保存异步获取的路由表
      resolve(routers);
    });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
