import { login, getInfo, getUserMenuData } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  role: ""
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLE: (state, role) => {
    state.role = role;
  }
};

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username, password: password })
        .then(response => {
          commit("SET_TOKEN", response.data.token);
          setToken(response.data.token);
          resetRouter();
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // 获取用户菜单
  GetUserMenu({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserMenuData(state.token)
        .then(res => {
          // 拿到菜单数据,这是只是异步获取的菜单数据
          resolve(res.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          const { data } = response;
          if (!data) {
            reject("验证失败，请重新登录");
          }
          let name = "";
          if (data.nickname) {
            name = data.nickname;
          } else if (data.username) {
            name = data.username;
          } else {
            name = data.email;
          }
          // const { roles, name, avatar, introduction } = data
          let role = data.role;
          let avatar = data.avatar ? data.avatar : "";
          commit("SET_ROLE", role);
          commit("SET_NAME", name);
          commit("SET_AVATAR", avatar);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // 用户退出登录
  logout({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_NAME", "");
      commit("SET_AVATAR", "");
      commit("SET_ROLE", "");
      commit("permission/SET_ADDROUTES", [], { root: true }); // 退出时清空动态菜单字段缓存,这里调用了permission模块的mutaction方法
      removeToken();
      resolve();
    });
  },

  // 移除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("permission/SET_ADDROUTES", [], { root: true }); // 退出时清空动态菜单字段缓存,这里调用了permission模块的mutaction方法
      removeToken();
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
