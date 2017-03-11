<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title>
        <div id="title">PropertyCross!!!</div>  
      </q-toolbar-title>

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

      <div id="geolocation">
      </div>

      <p class="search">
        <q-search 
          v-model="q" 
          placeholder="Search"
          :icon="iconStatus"
          class="p-search"
          />
        <spinner v-show="statusLoad" class="spinner" color="#888" :size="25" name="ios"></spinner>
      </p>


      <button class="primary" @click="clickMethod()">
        Go
      </button>
      <button class="primary" @click="clickMethod()">
        My Location
      </button>

      <p class="caption">
        <div class="list" style="max-width: 600px;">
          <div
            class="item item-link"
            v-for="item in items"
            @click="item.handler()"
            >
            <div class="item-content has-secondary">
              <div>{{item.label}}</div>
            </div>
            <i class="item-secondary">keyboard_arrow_right</i>
          </div>
        </div>
      </p>

    </div>
  </q-layout>
</template>


<script>
// let prod = (process.env.NODE_ENV === 'development')

export default {
  data () {
    return {
      q: '',
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

    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position)
    }, function (positionError) {
      console.log(positionError)
    })

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
    openFavorites () {},
    search () {},
    clickedOnItem () {}
  }
}
</script>

<style lang="styl">
  @import 'search.styl';
</style>
