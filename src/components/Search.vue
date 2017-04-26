<!--удаление ошибок-->

<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <!-- Show title in NavigationWindow's toolbar -->
      <q-toolbar-title>
        <div id="title">PropertyCross!</div>  
      </q-toolbar-title>

      <!-- Add rightNavButton to open favourites -->
      <button
        class="hide-on-drawer-visible"
        @click="goTo('/favourites')"
        >
        Favourites
      </button>
    </div>

    <!-- Wrap rest of view, adding padding using global classes -->
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

        <!-- Add activityIndicator to q-search to show while searching -->  
        <spinner v-show="statusLoad" class="spinner" color="#888" :size="25" name="ios"></spinner>
      </p>


      <button class="primary" @click="search(term)">
        Go
      </button>
      <button class="primary" @click="searchByLocation()">
        My Location
      </button>

      <!-- Wrap list of  recent locations -->
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


      <!-- Show errors -->
      <template v-if="errorMessage">
        <p class="caption">
          {{ errorMessage }}
        </p>
      </template>
      
      <!-- Wrap list of ambiguous locations -->
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
      hideItems: false
    }
  },

  /* eslint-disable no-undef */
  created: function () {
    // if (window.device) {
    //   this.term = window.device.model
    // }

    // Get a length of the list of recent searches from local store
    this.localStoreLength = this.$localStorage.get('recentSearches').length
    store.commit('initLocalStorage', this)
  },

  computed: {

    showIcon: function () {
      return this.statusLoad ? '' : 'search'
    },

    // Get a list of recent searches from local store
    getRecentSearches: function () {
      return this.$localStorage.get('recentSearches')
    }
  
  },

  methods: {

    goTo (url) {
      router.push(url)
    },


    search (term) {
      let self = this
      let string = term
      this.errorMessage = ''

      // If the search string is empty, exit the function
      if (!string) return

      // Called when user taps on a ambiguous/recent location
      // An object is passed to the function, then we extract the string to search from the object
      if (typeof term === 'object') {
        this.location.key = term.place_name
        this.location.name = term.title
        string = term.place_name
        this.term = term.title
        store.commit('saveSearchTerm', term.title)
      } 
      // If the value of the field term is equal to the name of the last location,
      // make a query with the key of this location
      else if (term === this.location.name) {
        string = this.location.key
        store.commit('saveSearchTerm', term)
      }
      
      this.statusLoad = true
      let response = searchService.search(string)    
      self._processSearchResponse(response)
    },


    searchByLocation () {      
      let self = this
      this.term = ''
      this.errorMessage = ''
      this.statusLoad = true

      // Start your search by geo
      this._getMyLocation(function (latitude, longitude) {
        let response = searchService.searchByLocation(latitude + ',' + longitude)
        self._processSearchResponse(response)
      })
    },

    // Get the coordinates and run the callback if the coordinates are received
    _getMyLocation (callback) {
      let self = this
      const options = { timeout: 4000 }
      if (!navigator.geolocation) {
        self.errorMessage = 'The use of location is currently disabled.'
        self.statusLoad = false
        console.log('Geolocation is not supported')
        return
      }

      // If the coordinates are received, run the callback
      let success = function (position) { 
        callback(position.coords.latitude, position.coords.longitude)
      }

      // If the coordinates are not received, show an error
      let error = function () {
        self.errorMessage = `Unable to detect current location. Please ensure
           location is turned on in your phone settings and try again.`
        self.statusLoad = false
        console.log('Unable to retrieve your location')
      }

      navigator.geolocation.getCurrentPosition(success, error, options)
    },

    // Subscribe to the promises and process the response code
    _processSearchResponse (response) {
      let self = this

      response      
        .then((res) => {          
          let resCode = res.application_response_code
          self.proposedLocations = res.locations
          self.statusLoad = false

          switch (resCode) {
            case '100': // listings returned for one unambiguous location
            case '110': // listings returned, location very large
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

            
            case '101': // listings returned for best guess of ambiguous location 
              // self.proposedLocations = res.locations
              self._getClientHeightTable()
              break

            
            case '200': // ambiguous location
            case '201': // unknown location
            case '202': // misspelled location
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

        // Show the error to the user
        .catch((err) => {
          // if (err.status === 408) {  // timeout
          self.errorMessage = `An error occurred while searching.
            Please check your network connection and try again.`
          // }
          self.statusLoad = false
          console.log('error: ', err)
        })
    },


    // Save search history
    _changeLocalStorage (obj, amount) {
      // this.$localStorage.remove('recentSearches')
      let i = 0
      let recentSearches = this.$localStorage.get('recentSearches')

      // Set the length of the story
      for (i; i < recentSearches.length; i++) {
        if (recentSearches[i].title === obj.title || i > 3) {
          recentSearches.splice(i, 1)
        }
      }
      obj.amount = amount
      recentSearches.unshift(obj)
      this.$localStorage.set('recentSearches', recentSearches)
    },


    // Calculate the maximum number of elements that can be displayed on the user's screen
    _getClientHeightTable () {
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
    }

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
