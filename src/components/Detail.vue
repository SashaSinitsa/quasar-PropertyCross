<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button
        class="hide-on-drawer-visible"
        @click="goTo()"
        >
        <i class="arrow_left">keyboard_arrow_left</i>
      </button>

      <!-- Show title in NavigationWindow's toolbar -->
      <q-toolbar-title>
        Property details
      </q-toolbar-title>

      <!-- Add button to add an item to the favourites -->
      <div
        v-if="!isFavourite"
        @click="addToFavourites()"
        >
        <i>star_border</i>
      </div>

      <!-- Add button to remove an item from the Favorites -->
      <div
        v-if="isFavourite"
        @click="removeFromFavourites()"
        >
        <i>star</i>
      </div>

    </div>

    <!-- Wrap rest of view, adding padding using global classes -->
    <div class="layout-padding">

      <h5>{{ property.price_formatted }}</h5>
  
      <div class="second-title">
        {{ property.title | untilSecondSine }}
      </div>
      <p>
        <img :src="property.img_url" alt=""> 
      </p>
      <p>
        {{ property.bedroom_number }} 
        <span v-if="property.bedroom_number>1">bedrooms,</span>
        <span v-else>bedroom,</span>
        {{ property.bathroom_number }}
        <span v-if="property.bathroom_number>1"> bathrooms</span>
        <span v-else>bathroom</span>
      </p>

      <p>
        {{ property.summary }} 
      </p>

    </div>
     
  </q-layout>
</template>



<script>
import router from '../router'
import store from '../store'


export default {
  name: 'detail',

  data () {
    return {
      property: {}
    }
  },


  created: function () {  
    // Get the current active property
    this.property = this.$store.state.property
    store.commit('isFavourite')
  },


  computed: {
    // Check if the property is in the favorites list
    isFavourite () {
      return this.$store.state.isFavourite
    }
  },
  
  methods: {
    goTo (url) {
      // router.push(url)
      router.go(-1)
    },

    // Add the property in the favorites list
    addToFavourites () {
      store.commit('addToFavourites')
      store.commit('isFavourite')
    },

    // Remove the property from the favorites list
    removeFromFavourites () {
      store.commit('removeFromFavourites')
      store.commit('isFavourite')
    }

  },

  // Truncates a string to the second comma
  filters: {
    untilSecondSine: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.split(',').slice(0, 2).join(',')
    }
  }

}
</script>




<style lang="styl">

  .second-title 
    padding-bottom 14px
    font-weight 500
    font-size 150%

  i
    font-size 200%

  img
    display block
    max-width 100%
    margin 0 auto

</style>
