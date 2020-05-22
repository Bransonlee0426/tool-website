/* eslint-disable no-shadow */
const state = {
  listCount: 1, // 新增菜餚的數量
};
const getters = {};
const mutations = {
  setListCount(state, data) {
    state.listCount = data.listCount;
  },
};
const actions = {
  changeListCount(context, listCount) {
    context.commit({
      type: 'setListCount',
      listCount,
    });
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
