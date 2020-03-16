const getters = {
  token: state => state.user.token,
  name: state => state.user.name,
  avatar: state => state.user.avatar,
  role: state => state.user.role,
  scrollTop: state => state.app.scrollTop,
  permission_routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes // 异步获取转换保存的路由地址数组
};
export default getters;
