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
        @click="router.push('home')"
        >
        Favorites
      </button>
    </div>

    <div class="layout-padding">
      <p class="caption" @click="goTo('results')">Use the form below to search for houses to buy.
        You can search by place-name, postcode, or click 'My location',
        to search in your current location!
      </p>

      <p 
        class="search"
        @keyup.enter="search(q)"
        >
        <q-search 
          v-model="q" 
          placeholder="Search"
          :icon="showIcon"
          class="p-search"
          />

        <!-- Add activityIndicator -->  
        <spinner v-show="statusLoad" class="spinner" color="#888" :size="25" name="ios"></spinner>
      </p>


      <button class="primary" @click="search(q)">
        Go
      </button>
      <button class="primary" @click="searchByLocation()">
        My Location
      </button>

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
      q: 'va',
      proposedLocations: [],
      statusLoad: false,
      location: {key: '', name: ''},
      // error: false,
      errorMessage: '',
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
      this.q = window.device.model
      // this.s = device.model
    }

    // setTimeout(() => {
    //   if (window.SpinnerDialog) {
    //     this.s = this.cordova
    //     SpinnerDialog.show(window.device.model)
    //   }
    // }, 6000)
  },

  computed: {

    showIcon: function () {
      return this.statusLoad ? '' : 'search'
    },
    

    hideItems: function () {
      // return {
      //   background: 'white'
      // }
    },

    // геттер вычисляемого значения
    reversedMessage: function () {
      // `this` указывает на экземпляр vm
      // return this.message.split('').reverse().join('')
    }
  },

  methods: {

    goTo (url) {
      router.push(url)
    },


    search (q) {
      console.log('search()')
      let self = this
      let string = q
      this.errorMessage = ''

      if (!string) return

      if ((typeof q === 'object') && (q !== null)) {
        this.location.key = q.place_name
        this.location.name = q.title
        string = q.place_name
        this.q = q.title
      } 
      else if (q === this.location.name) {
        string = this.location.key
      }
      // console.log('string: ', string)

      this.statusLoad = true
      let response = searchService.search(string)
      self._processSearchResponse(response)
    },


    searchByLocation () {
      console.log('searchByLocation()')
      
      let self = this
      this.q = ''
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
      console.log(localStorage.getItem('id'))
      localStorage.setItem('id', '11')
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

      navigator.geolocation.getCurrentPosition(success, error)
    },

    _processSearchResponse (response) {
      console.log('processSearchResponse')
      let self = this

      response      
        .then((res) => {
          console.log('resVue', res)
          let resCode = res.application_response_code
          self.proposedLocations = res.locations

          switch (resCode) {
            case '100':
            case '110':
              store.commit('saveListProperties', res.listings)
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
          self.statusLoad = false
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


    _getClientHeightTable () {
      console.log('_ref()')
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
  @import 'search.styl';
</style>
