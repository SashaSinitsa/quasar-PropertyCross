<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <!-- Show title in NavigationWindow's toolbar -->
      <q-toolbar-title>
        <div id="title">PropertyCross!!!</div>  
      </q-toolbar-title>

      <!-- Add rightNavButton to open favorites -->
      <button
        class="hide-on-drawer-visible"
        @click="openFavorites"
        >
        Favorites
      </button>
    </div>

    <div class="layout-padding">
      <p class="caption">Use the form below to search for houses to buy.
        You can search by place-name, postcode, or click 'My location',
        to search in your current location!
      </p>

      <p 
        class="search"
        @keyup.enter="search()"
        >
        <q-search 
          v-model="q" 
          placeholder="Search"
          :icon="iconStatus"
          class="p-search"
          />

        <!-- Add activityIndicator -->  
        <spinner v-show="statusLoad" class="spinner" color="#888" :size="25" name="ios"></spinner>
      </p>


      <button class="primary" @click="search()">
        Go
      </button>
      <button class="primary" @click="getLocation()">
        My Location
      </button>

      <!-- Create list of items -->
      <template v-if="locations.length !== 0">
        <p class="caption">
          Please select a location below:
          <div class="list">
            <div
              class="item item-link"
              v-for="(item, index) in locations"
              v-if="index < 6"
              @click="item.handler()"
              >
              <div class="item-content has-secondary">
                <div>{{item.datasource_name}}</div>
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
import jsonp from 'src/service/jsonp'

export default {
  data () {
    return {
      q: '',
      locations: [],
      iconStatus: 'search',
      statusLoad: false,
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
    // геттер вычисляемого значения
    reversedMessage: function () {
      // `this` указывает на экземпляр vm
      // return this.message.split('').reverse().join('')
    }
  },

  methods: {
    getLocation () {
      var myLocation
      var self = this

      navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position)
        myLocation = position.coords.latitude + ',' + position.coords.longitude
        jsonp.getList(myLocation)
          .then((res) => {
            let code = res.application_response_code
            if (code) {
              console.log('res: ', res)
              if (code === '200' || code === '202') {
                self.locations = res.locations
                console.log('unknown location')
              }
              else if (code === '100' || code === '101' || code === '110') {
                self.locations = res.listings
                console.log(res.listings)
              }
              else { console.log('Error, status code: ' + code) }
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }, (positionError) => {
        console.log(positionError)
      })
      // axios.get('http://api.nestoria.co.uk/api?action=echo&encoding=json&foo=bar')
      //   .then(function (response) {
      //     console.log(response)
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
    },
    search () {
      var self = this
      jsonp.search(this.q)
        .then((res) => {
          let code = res.application_response_code
          if (code) {
            console.log('res: ', res)
            if (code === '200' || code === '202') {
              self.locations = res.locations
              console.log('unknown location')
            }
            else if (code === '100' || code === '101' || code === '110') {
              self.locations = res.listings
              console.log(res.listings)
            }
            else { console.log('Error, status code: ' + code) }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    openFavorites () {},
    clickedOnItem () {}
  }
}
</script>

<style lang="styl">
  @import 'search.styl';
</style>
