import Vue from 'vue';
import Vuex from 'vuex';
import status from './modules/status';

Vue.use(Vuex);

function islogin(mutation, user) {
  if (mutation.type === 'userInfo/setLoginState' || mutation.type === 'userInfo/setAccount') {
    window.localStorage.setItem('userInfo', JSON.stringify(user));
    if (!user.account && mutation.type === 'userInfo/setAccount') {
      window.localStorage.removeItem('userInfo');
      window.localStorage.removeItem('productIds');
    }
  }
}

const localStoragePlugin = (store) => {
  store.subscribe((mutation, user) => {
    islogin(mutation, user.userInfo);
  });
};

export default new Vuex.Store({
  modules: {
    status,
  },
  plugins: [localStoragePlugin],
});
