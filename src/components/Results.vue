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
        {{ listProperties.length }}  of {{ totalResults }} matches
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


      <div
        v-if="listProperties.length"
        class="item multiple-lines moreItems">
        <div class="item-content ">
          <button 
            v-if="listProperties.length !== totalResults"
            class="primary"
            @click="loadMoreProperties()">Load more...</button>
        </div>
        
        <div 
          class="item-label item-smaller"
          >Results for <b>{{ searchTerm }}</b> <br>
          showing {{ listProperties.length }} of {{ totalResults }} properties</div>
      </div> 
      
    </div>

  </q-layout>
</template>



<script>
import router from '../router'
import store from '../store'
import searchService from 'src/service/search'


export default {
  name: 'results',

  data () {
    return {
      totalResults: 0,
      listProperties: 0,
      searchTerm: '',
      page: 1
    }
  },


  created: function () {
    this.totalResults = this.$store.state.totalResults
    this.listProperties = this.$store.state.listProperties
    this.searchTerm = this.$store.state.searchTerm
  },


  computed: {

  },
  
  methods: {
    goTo (url) {
      router.push(url)
    },

    inc () {
      store.commit('increment', 10)
    },

    loadMoreProperties () {
      this.page = this.page + 1
      searchService.search(this.searchTerm, this.page) 
        .then(res => {
          this.listProperties = this.listProperties.concat(res.listings)
        })
        .catch(error => {
          console.log(error)
        })
    }
  },

  mounted () {
    // console.log(this)
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

  .moreItems
    text-align: center  
    >div
       text-align: center  
    
</style>
