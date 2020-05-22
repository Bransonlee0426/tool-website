import Vue from 'vue';
import _ from 'lodash';

Vue.prototype._ = _;

const EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
  $bus: {
    get() {
      return EventBus;
    },
  },
});
