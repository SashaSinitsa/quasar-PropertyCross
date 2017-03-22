import Vue from 'vue'
import VueJsonp from 'vue-jsonp'

Vue.use(VueJsonp, 5000)

const jsonp = {
  getList: function (location) {
    return Vue.jsonp(
      'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&centre_point=' + location)
    .then(res => res.response)
    .catch((err) => {
      console.log('errJsonp ', err)
      throw err
    })
  },
  search: function (term) {
    return Vue.jsonp(
      'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&place_name=' + term)
    .then(res => res.response)
    .catch((err) => {
      console.log('errJsonp ', err)
      throw err
    })
  }
}

export default jsonp
