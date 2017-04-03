// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
// require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import store from './store'
import VueLocalStorage from 'vue-localstorage'

Vue.use(Quasar) // Install Quasar Framework
Vue.use(VueLocalStorage)

Quasar.start(() => {
  /* eslint-disable no-new */
  let vm = new Vue({
    el: '#q-app',
    router,
    store: store,
    localStorage: {
      recentSearches: {
        type: Array,
        default: []
      }
    },
    
    render: h => h(require('./App'))
  })

  console.dir(vm)
})
