import request from "@/utils/request";
// 博客文章新增
export function articleAdd(data) {
  return request({
    url: "/article/addArticle",
    method: "post",
    data
  });
}
// 博客文章获取列表（前台展示）
export function articleList(query) {
  return request({
    url: "/article/articleList",
    method: "get",
    params: query
  });
}
// 博客文章获取详情（前台展示）
export function articleDetail(query) {
  return request({
    url: "/article/articleDetial",
    method: "get",
    params: query
  });
}
// 博客文章获取评论列表（前台展示）
export function commentList(query) {
  return request({
    url: "/comment/commentList",
    method: "get",
    params: query
  });
}
// 博客文章添加评论（前台展示）
export function addComment(data) {
  return request({
    url: "/comment/addComment",
    method: "post",
    data
  });
}
// 博客文章添加评论回复（前台展示）
export function addReply(data) {
  return request({
    url: "/comment/addReply",
    method: "post",
    data
  });
}
// 上传图片
export function upload(data) {
  return request({
    url: "/upload",
    method: "post",
    data
  });
}
