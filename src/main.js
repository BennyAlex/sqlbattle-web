import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons/iconfont/material-icons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'

Vue.use(Vuetify, {
  theme: {
    primary: '#1769aa',
    secondary: '#1769aa',
    accent: '#1769aa',
    error: '#f44336',
    warning: '#ffeb3b',
    info: '#2196f3',
    success: '#4caf50'
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
