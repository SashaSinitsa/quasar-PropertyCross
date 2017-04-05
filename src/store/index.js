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

  addToFavourites (state, self) {
    let arr = self.$localStorage.get('favourites')
    arr.push(state.property)
    self.$localStorage.set('favourites', arr) 
  },

  removeFromFavourites (state, self) {  
    let arr = self.$localStorage.get('favourites')
    let index = arr.findIndex(fav => fav.lister_url === state.property.lister_url)
    if (index !== -1) {
      arr.splice(index, 1)
    }
    self.$localStorage.set('favourites', arr)
  },

  isFavourite (state, self) {
    let arr = self.$localStorage.get('favourites')
    let index = arr.findIndex(fav => fav.lister_url === state.property.lister_url)
    state.isFavourite = (index !== -1)
  }
}


export default new Vuex.Store({
  state,
  mutations
})
