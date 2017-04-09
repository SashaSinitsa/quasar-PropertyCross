<template>
  <q-layout>
    <div slot="header" class="toolbar">
      
      <button
        class="hide-on-drawer-visible"
        @click="goTo(-1)"
        >
        <i class="arrow_left">keyboard_arrow_left</i>
      </button>

      <!-- Show title in NavigationWindow's toolbar -->
      <q-toolbar-title>
        Favourites
      </q-toolbar-title>

    </div>

    <div v-if="listProperties.length===0" class="layout-padding">
      <p  lass="caption">
        You have not added any properties to your favourites.
      </p>
    </div>

    <div v-else class="list item-delimiter list-property">
      <div
        class="item multiple-lines item-height"
        v-for="(item, index) in listProperties"
        ref="itemLocs"
        @click="goTo('detail'); rememberProperty(item)"
        >
        <img 
          class="item-primary thumbnail"
          :src="item.thumb_url"
          >
        <div class="item-content has-secondary item-height">

          <div>
            {{ item.price_formatted }}
          </div>

          <div class="item-label item-smaller">
            {{ item.title }}
          </div>

        </div> 
        <i class="item-secondary arrow-right">keyboard_arrow_right</i>   
      </div>
      
    </div>

  </q-layout>
</template>



<script>
import router from '../router'
import store from '../store'


export default {
  name: 'favourites',

  data () {
    return {
      listProperties: 0
    }
  },


  created: function () {
    this.listProperties = this.$localStorage.get('favourites')
  },


  
  methods: {
    goTo (url) {
      typeof url === 'number' ? router.go(url) : router.push(url)
    },

    rememberProperty (property) {
      store.commit('rememberProperty', property)
    }
  }

}
</script>




<style lang="styl">

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

  .item-height 
    height 80px   
    max-height 80px
    overflow hide
    .item-smaller
      height 32px
      max-height 32px
      overflow hidden
      text-overflow clip
    .arrow-right
      height 56px
      line-height 56px
    
</style>
