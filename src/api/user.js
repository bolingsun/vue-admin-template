import request from "@/utils/request";
// 用户登录
export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data
  });
}
// 向后台获取用户访问的菜单信息
export function getUserMenuData(token) {
  return request({
    url: "/user/getUserMenus",
    method: "post",
    params: { token }
  });
}
// 获取用户信息详情
export function getInfo(query) {
  return request({
    url: "/user/getInfo",
    method: "get",
    params: query
  });
}
// 普通用户注册
export function register(data) {
  return request({
    url: "/user/register",
    method: "post",
    data
  });
}
// export function logout(data) {
//   return request({
//     url: "/auth/local/logout",
//     method: "post",
//     data
//   });
// }
