import Vue from 'vue';
import './toolbox/prototype';
import 'babel-polyfill';
import './components/index';
import './assets/style/cssreset.scss';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/base.css';
import './assets/style/element-variables.scss';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import lang from 'element-ui/lib/locale/lang/zh-TW';
import locale from 'element-ui/lib/locale';
import { createProvider } from './vue-apollo';
import App from './App.vue';
import api from './graphql/index';
import router from './router/index';
import store from './store/index';
import Utilities from './mixin/utilities';
import graphql from './mixin/graphql';

Vue.config.productionTip = false;
Vue.use(require('vue-moment'));

Vue.use(api);
Vue.mixin(Utilities);
Vue.mixin(graphql);
Vue.use(ElementUI);
Vue.component(CollapseTransition.name, CollapseTransition);
locale.use(lang);

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App),
}).$mount('#app');
