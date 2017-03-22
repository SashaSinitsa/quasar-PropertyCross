// example  
// https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart

import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const state = {
  count: 0,
  listProperties: []
}

const mutations = {
  increment (state, n) {
    state.count += n
  },

  saveListProperties (state, obj) {
    state.listProperties = obj
  }
}


export default new Vuex.Store({
  state,
  mutations
})
