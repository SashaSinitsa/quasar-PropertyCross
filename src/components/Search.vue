<!--удаление ошибок-->

<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <!-- Show title in NavigationWindow's toolbar -->
      <q-toolbar-title>
        <div id="title">PropertyCross!</div>  
      </q-toolbar-title>

      <!-- Add rightNavButton to open favorites -->
      <button
        class="hide-on-drawer-visible"
        @click="goTo('/favourites')"
        >
        Favourites
      </button>
    </div>

    <div class="layout-padding">
      <p class="caption">
        Use the form below to search for houses to buy.
        You can search by place-name, postcode, or click 'My location',
        to search in your current location!
      </p>

      <p 
        class="search"
        @keyup.enter="search(term)"
        >
        <q-search 
          v-model="term" 
          placeholder="Search"
          :icon="showIcon"
          class="p-search"
          />

        <!-- Add activityIndicator -->  
        <spinner v-show="statusLoad" class="spinner" color="#888" :size="25" name="ios"></spinner>
      </p>


      <button class="primary" @click="search(term)">
        Go
      </button>
      <button class="primary" @click="searchByLocation()">
        My Location
      </button>


      <template v-if="(!errorMessage)&&(proposedLocations.length == 0)&&(localStoreLength)">
        <p class="caption">
          <div class="list">
            <div
              class="item item-link"
              :style="hideItems"
              v-for="(item, index) in getRecentSearches"
              ref="itemLocs"
              v-if="index < 7"
              @click="search(item)"
              >
              <div class="item-content has-secondary">
                <div>{{ item.title }} ({{ item.amount }})</div>
              </div>
              <i class="item-secondary">keyboard_arrow_right</i>
            </div>
          </div>
        </p>
       </template>


      <!-- Create list of items -->
      <template v-if="errorMessage">
        <p class="caption">
          {{ errorMessage }}
        </p>
      </template>
      

      <template v-if="proposedLocations.length !== 0">
        <p class="caption">
          Please select a location below: 
          <div class="list">
            <div
              class="item item-link"
              :style="hideItems"
              v-for="(item, index) in proposedLocations"
              ref="itemLocs"
              v-if="index < 7"
              @click="search(item)"
              >
              <div class="item-content has-secondary">
                <div>{{item.title}}</div>
              </div>
              <i class="item-secondary">keyboard_arrow_right</i>
            </div>
          </div>
        </p>
      </template>


    </div>
  </q-layout>
</template>


<script>
// let prod = (process.env.NODE_ENV === 'development')
// import axios from 'axios'
import searchService from 'src/service/search'
import router from '../router'
import store from '../store'

export default {
  data () {
    return {
      term: '',
      proposedLocations: [],
      statusLoad: false,
      location: {key: '', name: ''},
      errorMessage: '',
      localStoreLength: 0,
      hideItems: false,
      items: [
        {
          label: 'kiev'
        },
        {
          label: 'kharkov'
        }
      ]
    }
  },

  /* eslint-disable no-undef */
  created: function () {
    if (window.device) {
      this.term = window.device.model
      // this.s = device.model
    }
    this.localStoreLength = this.$localStorage.get('recentSearches').length
    store.commit('initLocalStorage', this)
  },

  computed: {

    showIcon: function () {
      return this.statusLoad ? '' : 'search'
    },

    getRecentSearches: function () {
      return this.$localStorage.get('recentSearches')
    }
  
  },

  methods: {

    goTo (url) {
      router.push(url)
    },


    search (term) {
      console.log('search()')
      let self = this
      let string = term
      this.errorMessage = ''

      if (!string) return

      if (typeof term === 'object') {
        this.location.key = term.place_name
        this.location.name = term.title
        string = term.place_name
        this.term = term.title
        store.commit('saveSearchTerm', term.title)
      } 
      else if (term === this.location.name) {
        string = this.location.key
        store.commit('saveSearchTerm', term)
      }
      
      this.statusLoad = true
      let response = searchService.search(string)    
      self._processSearchResponse(response)
    },


    searchByLocation () {
      console.log('searchByLocation()')
      
      let self = this
      this.term = ''
      this.errorMessage = ''
      this.statusLoad = true

      this._getMyLocation(function (latitude, longitude) {
        let response = searchService.searchByLocation(latitude + ',' + longitude)
        self._processSearchResponse(response)
      })
    },


    _getMyLocation (callback) {
      console.log('getMyLocation()')
      let self = this
      const options = { timeout: 4000 }
      if (!navigator.geolocation) {
        self.errorMessage = 'The use of location is currently disabled.'
        self.statusLoad = false
        console.log('Geolocation is not supported')
        return
      }

      let success = function (position) { 
        callback(position.coords.latitude, position.coords.longitude)
      }

      let error = function () {
        self.errorMessage = `Unable to detect current location. Please ensure
           location is turned on in your phone settings and try again.`
        self.statusLoad = false
        console.log('Unable to retrieve your location')
      }

      navigator.geolocation.getCurrentPosition(success, error, options)
    },

    _processSearchResponse (response) {
      console.log('processSearchResponse')
      let self = this

      response      
        .then((res) => {          
          let resCode = res.application_response_code
          self.proposedLocations = res.locations
          self.statusLoad = false

          switch (resCode) {
            case '100':
            case '110':
              self._changeLocalStorage(self.proposedLocations[0], res.total_results)
              if (res.listings.length === 0) {
                self.proposedLocations = []
                self.errorMessage = 'There were no properties found for the given location.'
                break
              }
              store.commit('saveListProperties', res.listings)
              store.commit('saveTotalResults', res.total_results)
              self.goTo('/results')
              break
            case '101':
              // self.proposedLocations = res.locations
              self._getClientHeightTable()
              break
            case '200':
            case '201':
            case '202':
              if (res.application_response_text === 'unknown location') {
                self.errorMessage = 'The location given was not recognised.'
              }
              else if (!self.proposedLocations.length) {
                self.errorMessage = 'There were no properties found for the given location.'
              }
              break
            default:
              self.errorMessage = 'There was a problem with your search.'
              console.error('status_code: ', res.status_code, res.application_response_text)
          }
        })
        .catch((err) => {
          // if (err.status === 408) {
          self.errorMessage = `An error occurred while searching.
            Please check your network connection and try again.`
          // }
          self.statusLoad = false
          console.log('error: ', err)
        })
    },


    _changeLocalStorage (obj, amount) {
      // this.$localStorage.remove('recentSearches')
      let i = 0
      let recentSearches = this.$localStorage.get('recentSearches')

      for (i; i < recentSearches.length; i++) {
        if (recentSearches[i].title === obj.title || i > 3) {
          recentSearches.splice(i, 1)
        }
      }
      obj.amount = amount
      recentSearches.unshift(obj)
      this.$localStorage.set('recentSearches', recentSearches)
    },


    _getClientHeightTable () {
      console.log('_getClientHeightTable()')
      var self = this
      var height = document.documentElement.clientHeight
      if (self.$refs.itemLocs && self.$refs.itemLocs.length !== 0) {
        for (let i = 0; i < self.$refs.itemLocs.length; i++) {
          let rect = self.$refs.itemLocs[i].getBoundingClientRect()
          if ((height - rect.bottom) < 0) {
            self.$refs.itemLocs[i].style.display = 'none'
            self.hideItems
          }
        }
      }
      else {
        setTimeout(() => {
          self._getClientHeightTable()
        }, 100)
      }
    },

    openFavorites () {},
    clickedOnItem () {}
  }
}
</script>



<style lang="styl">
  @import '~src/themes/app.variables.styl';

  .layout
    .layout-padding
      width 100%
  .search
    position relative
    .p-search
      input
        height 40px
    .spinner
      position absolute
      top 4px
      left 4px
</style>
