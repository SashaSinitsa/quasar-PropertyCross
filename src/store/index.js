// example  
// https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart

import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const state = {
  self: {},
  totalResults: 0,
  listProperties: [],
  searchTerm: '',
  property: {},
  isFavourite: false
}

const mutations = {
  initLocalStorage (state, self) {
    state.self = self
  },

  saveTotalResults (state, n) {
    state.totalResults = n
  },

  saveListProperties (state, obj) {
    state.listProperties = obj
  },

  saveSearchTerm (state, q) {
    state.searchTerm = q
  },

  rememberProperty (state, property) {
    state.property = property
  },

  addToFavourites (state) {
    let arr = state.self.$localStorage.get('favourites')
    arr.push(state.property)
    state.self.$localStorage.set('favourites', arr) 
  },

  removeFromFavourites (state) {  
    let arr = state.self.$localStorage.get('favourites')
    let index = arr.findIndex(fav => fav.lister_url === state.property.lister_url)
    if (index !== -1) {
      arr.splice(index, 1)
    }
    state.self.$localStorage.set('favourites', arr)
  },

  isFavourite (state) {
    let arr = state.self.$localStorage.get('favourites')
    let index = arr.findIndex(fav => fav.lister_url === state.property.lister_url)
    state.isFavourite = (index !== -1)
  }
}


export default new Vuex.Store({
  state,
  mutations
})
