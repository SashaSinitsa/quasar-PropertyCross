import Vue from 'vue'

const jsonp = {
  getList: function (location) {
    console.log(location)
    return Vue.jsonp(
      'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&centre_point=' + location)
    .then(res => res.response)
    .catch((err) => {
      console.log('err: ', err)
    })
  },
  search: function (term) {
    console.log(term)
    return Vue.jsonp(
      'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&place_name=' + term)
    .then(res => res.response)
    .catch((err) => {
      console.log('err: ', err)
    })
  }
}

export default jsonp
