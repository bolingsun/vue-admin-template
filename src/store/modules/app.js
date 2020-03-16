const state = {
  scrollTop: 0
};

const mutations = {
  RECORD_SCROLL_TOP: (state, n) => {
    state.scrollTop = n;
  }
};

const actions = {
  changeScrollTop({ commit }, num) {
    commit("RECORD_SCROLL_TOP", num);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
