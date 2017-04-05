<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button
        class="hide-on-drawer-visible"
        @click="goTo('/results')"
        >
        <i class="arrow_left">keyboard_arrow_left</i>
      </button>

      <!-- Show title in NavigationWindow's toolbar -->
      <q-toolbar-title>
        Property details
      </q-toolbar-title>

      <!-- Add rightNavButton to open favorites -->
      <div
        v-if="!isFavourite"
        @click="addToFavourites()"
        >
        <i>star_border</i>
      </div>

      <div
        v-if="isFavourite"
        @click="removeFromFavourites()"
        >
        <i>star</i>
      </div>

    </div>

    <div class="layout-padding">

      <h5>{{ property.price_formatted }}</h5>
  
      <div class="second-title">
        {{ property.title }}
      </div>
      <p>
        <img
          :src="property.img_url" alt=""
          height="100%"> 
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
    this.property = this.$store.state.property
    store.commit('isFavourite', this)
  },


  computed: {
    isFavourite () {
      return this.$store.state.isFavourite
    }
  },
  
  methods: {
    goTo (url) {
      router.push(url)
    },

    addToFavourites () {
      store.commit('addToFavourites', this)
      store.commit('isFavourite', this)
    },

    removeFromFavourites () {
      store.commit('removeFromFavourites', this)
      store.commit('isFavourite', this)
    }

  },

  mounted () {
    // console.log(this)
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

</style>
