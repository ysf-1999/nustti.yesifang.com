import Vue from 'vue';
import App from './App.vue';
import Vant from 'vant';
import './assets/css/reset.css';
import 'vant/lib/index.css';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Vant);

new Vue({
	store,
	render: h => h(App),
}).$mount('#app')
