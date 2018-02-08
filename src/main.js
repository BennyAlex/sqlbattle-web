import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'

Vue.use(Vuetify, {
  theme: {
    primary: '#3f51b5',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
})

import('../node_modules/vuetify/dist/vuetify.min.css')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
