/**
 * 异步路由表
 */
export const asyncRouterMap = [
  {
    path: "/layout",
    component: resolve => require(["../layout"], resolve),
    name: "Layout",
    children: [
      {
        path: "/set",
        component: resolve => require(["../views/set"], resolve)
      },
      {
        path: "/test",
        component: resolve => require(["../views/test"], resolve)
      }
    ]
  },
  {
    path: "/register",
    component: resolve => require(["../views/register"], resolve)
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true
  }
];
