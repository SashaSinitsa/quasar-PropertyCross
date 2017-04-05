// example  
// https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart

import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const state = {
  totalResults: 0,
  listProperties: [],
  searchTerm: '',
  property: {},
  favourites: [],
  isFavourite: false
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
  },

  saveProperty (state, property) {
    state.property = property
  },

  addToFavourites () {
    state.favourites.push(state.property)
  },

  removeFromFavourites (state) {
    const index = state.favourites.findIndex(fav => fav.lister_url === state.property.lister_url)
    if (index !== -1) {
      state.favourites.splice(index, 1)
    }
  },

  isFavourite (state) {
    const index = state.favourites.findIndex(fav => fav.lister_url === state.property.lister_url)   
    if (index !== -1) {
      state.isFavourite = true
    }
    else state.isFavourite = false
  }
}


export default new Vuex.Store({
  state,
  mutations
})
