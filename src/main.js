import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/reset.css'
import './plugin/fly'
import './plugin/appback.js'
import moment from 'moment';
import clipboard from 'clipboard';
import VueMeta from 'vue-meta';

import Vant from 'vant';
import 'vant/lib/index.css';

// import Vconsole from 'vconsole'
// let vConsole = new Vconsole()

Vue.use(Vant);
Vue.use(VueMeta);
Vue.prototype.$moment = moment;
Vue.prototype.clipboard = clipboard;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
