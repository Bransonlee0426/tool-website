/* eslint-disable no-console */
import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/index';

Vue.use(store);
Vue.use(Router);

let routes = [];
const routerContext = require.context('.', true, /index\.js/);

routerContext.keys().forEach((routeName) => {
  if (routeName.startsWith('./index')) return;
  const routeModule = routerContext(routeName);
  routes = [...routes, ...(routeModule.default || routeModule)];
});

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
// 解決使用element-ui的子菜单项点击两下出现 NavigationDuplicated {_name: "NavigationDuplicated"的問題
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

// function checkUserInfo() {
//   const localUserInfo = JSON.parse(window.localStorage.getItem('userData'));
//   if (localUserInfo) {
//     store.dispatch('userInfo/login', {
//       account: localUserInfo.account,
//     });
//   } else {
//     store.dispatch('userInfo/logout');
//   }
// }

// checkUserInfo();

router.beforeEach((to, from, next) => {
  const islogin = localStorage.getItem('admin-token');
  if (islogin) {
    // 自動登入
    if (to.path === '/') {
      next({
        path: '/dish-data',
      });
    } else {
      next();
    }
  } else {
    // 在登出狀態進入requireAuth頁跳回Login頁
    if (to.matched.some(r => r.meta.requireAuth)) {
      next({
        path: '/',
      });
    }
    next();
  }
  next();
});


export default router;
