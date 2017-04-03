import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

const ax = {
  getList: function (location) {
    return axios.get(
      'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&centre_point=' + location)
    .then(res => res.data.response)
    .catch((error) => {
      console.log(error)
    })
  },
  search: function (term) {
    return axios.get(
      'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&place_name=' + term)
    .then(res => res.data.response)
    .catch((err) => {
      console.log('errJsonp ', err)
      throw err
    })
  }
}

export default ax
