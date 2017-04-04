// example  
// https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart

import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const state = {
  totalResults: 0,
  listProperties: [],
  searchTerm: ''
}

const mutations = {
  saveTotalResults (state, n) {
    state.totalResults = n
  },

  saveListProperties (state, obj) {
    state.listProperties = obj
  },

  saveSearchTerm (state, q) {
    state.searchTerm = q
  }
}


export default new Vuex.Store({
  state,
  mutations
})
