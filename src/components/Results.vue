<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button
        class="hide-on-drawer-visible"
        @click="goTo('/')"
        >
        <i class="arrow_left">keyboard_arrow_left</i>
      </button>

      <!-- Show title in NavigationWindow's toolbar -->
      <q-toolbar-title>
        PropertyCross
      </q-toolbar-title>

      <!-- Add rightNavButton to open favorites -->
      <button
        class="hide-on-drawer-visible"
        @click="goTo('/')"
        >
        Favorites
      </button>
    </div>


    <div class="list item-delimiter list-property">
      <div
        class="item multiple-lines"
        v-for="(item, index) in listProperties"
        ref="itemLocs"
        v-if="index < 10"
        >
        <img 
          class="item-primary thumbnail"
          :src="item.thumb_url"
          >
        <div class="item-content has-secondary">
          <div>
            {{ item.price_formatted }}
          </div>
          <div>Multiple lines item</div>
          <div class="item-label item-smaller">Second line</div>
        </div>    

        
      </div>
    </div>

  </q-layout>
</template>



<script>
import router from '../router'
import store from '../store'
console.dir(store)

export default {
  name: 'results',

  data () {
    return {
      // list: 'list'
    }
  },


  created: function () {
    console.log(this)
  },


  computed: {
    count () {
      return this.$store.state.count
    },
    listProperties () {
      return this.$store.state.listProperties
    }
  },
  
  methods: {
    goTo (url) {
      router.push(url)
    },

    inc () {
      store.commit('increment', 10)
    }
  },

  mounted () {
    console.log(this)
  }
}
</script>




<style lang="styl">

  .arrow_left 
    font-size: 2.275rem
  

  img.item-primary.thumbnail 
    width: 80px
    height: 60px
    top: 10px
    border-radius: 3px
    ~.item-content
      margin-left: 110px
  
  .list-property
     width:100%
     overflow:auto
     border: none 
    
</style>
