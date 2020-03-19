import Cookies from "js-cookie";
const state = {
  scrollTop: 0,
  sidebar: {
    opened: Cookies.get("sidebarStatus")
      ? !!+Cookies.get("sidebarStatus")
      : true
  }
};

const mutations = {
  RECORD_SCROLL_TOP: (state, n) => {
    state.scrollTop = n;
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  }
};

const actions = {
  changeScrollTop({ commit }, num) {
    commit("RECORD_SCROLL_TOP", num);
  },
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
