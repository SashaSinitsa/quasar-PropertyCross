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
        @click="goTo('/favourites')"
        >
        Favourites
      </button>
    </div>


    <div class="list item-delimiter list-property">
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


      <div
        v-if="listProperties.length"
        class="item multiple-lines moreItems">
        <div class="item-content ">
          <button 
            v-if="listProperties.length !== totalResults"
            class="primary"
            @click="loadMoreProperties()"
          > {{ titleButton }}
          </button>
        </div>
        
        <div 
          class="item-label item-smaller"
          >Results for <b> &#8221;{{ searchTerm }}&#8221; </b> <br>
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
      page: 1,
      titleButton: 'Load more...'
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

    loadMoreProperties () {
      this.titleButton = 'Loading ...'
      this.page = this.page + 1
      searchService.search(this.searchTerm, this.page) 
        .then(res => {
          this.listProperties = this.listProperties.concat(res.listings)
          this.titleButton = 'Load more...'
          store.commit('saveListProperties', this.listProperties)
        })
        .catch(error => {
          console.log(error)
        })
    },

    rememberProperty (property) {
      store.commit('rememberProperty', property)
    }
  },

  mounted () {
    // console.log(this)
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

  .moreItems
    text-align: center  
    >div
       text-align: center  
    
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
