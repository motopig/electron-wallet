import Vue from 'vue';
import axios from 'axios';
import Vuetify from 'vuetify';
import VueQriously from 'vue-qriously';
import VueClipboard from 'vue-clipboard2';
import Toast from 'vue-easy-toast';
import * as VueLoaders from 'vue-loaders';
import 'vuetify/dist/vuetify.min.css';
import 'vue-easy-toast/dist/vue-easy-toast.css';
import 'vue-loaders/dist/vue-loaders.css';
import './assets/styles/wallet.less';
import './assets/styles/animation.css';

import App from './App';
import router from './router';
import store from './store';
import './assets/styles/reset.css';
import socketApi from './libs/websocket';


Vue.use(Vuetify);
Vue.use(VueQriously);
Vue.use(VueClipboard);
Vue.use(Toast);
Vue.use(VueLoaders);
Vue.prototype.$socketApi = socketApi;

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
