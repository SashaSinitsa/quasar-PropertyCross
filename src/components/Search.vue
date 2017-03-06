<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="0">
        PropertyCross!!!  
      </q-toolbar-title>
    <button
      class="hide-on-drawer-visible"
      @click="openFavorites"
    >
      Favorites
    </button>
    </div>

    <!--
      Replace following "div" with
      "<router-view class="layout-view">" component
      if using subRoutes
    -->
    <div id="geolocation" class="layout-view">
      <!--<div class="animate-spin">fg</div>-->

      <input v-model="s" placeholder="Type something">
      <i  v-show=true class="fa fa-spinner fa-spin"></i>
      <div class="logo-container non-selectable no-pointer-events">
        <div class="logo" >
          <img src="~assets/quasar-logo.png">
          <p class="caption text-center">
            <span class="desktop-only">Move your mouse</span>
            <span class="touch-only">Touch screen and move!</span>
          </p>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>
// let prod = (process.env.NODE_ENV === 'development')
// var prod = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

export default {
  data () {
    return {
      s: ''
    }
  },

  /* eslint-disable no-undef */
  created: function () {
    // setTimeout(() => {
    if (window.device) {
      this.s = window.device.model
      // this.s = device.model
    }

    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position)
    }, function (positionError) {
      console.log(positionError)
    })
    // }, 3000)

    // setTimeout(() => {
    //   if (window.SpinnerDialog) {
    //     this.s = this.cordova
    //     SpinnerDialog.show(window.device.model)
    //   }
    // }, 6000)
  },

  methods: {
    openFavorites () {}
  }
}
</script>

<style lang="styl">
</style>
