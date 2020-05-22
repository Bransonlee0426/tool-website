const state = {
  islogin: false,
  account: '',
};

const getters = {};

const mutations = {
  // eslint-disable-next-line no-shadow
  setAccount(state, value) {
    state.islogin = value.islogin;
    state.account = value.userInfo.account;
  },
};

const actions = {
  login(context, userInfo) {
    context.commit({
      type: 'setAccount',
      islogin: true,
      userInfo,
    });
  },
  logout(context) {
    context.commit({
      type: 'setAccount',
      islogin: false,
      userInfo: {
        account: '',
      },
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
