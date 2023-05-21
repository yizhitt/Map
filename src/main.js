import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './assets/common.css'
Vue.config.productionTip = false

import { Select, Icon, Radio } from "ant-design-vue";
Vue.use(Select).use(Icon).use(Radio)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
