// import jsonp from 'src/service/jsonp'
import axios from 'axios'


const searchService = {
  search: function (term, page = 1) {
    return axios.get(
      // 'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&place_name=' + term,
      'http://api.nestoria.co.uk/api',
      {
        params: {
          country: 'uk',
          pretty: 1,
          action: 'search_listings',
          encoding: 'json',
          listing_type: 'buy',
          page: page,
          place_name: term
        }
      })
      .then(res => res.data.response)
      .catch((error) => {
        console.log('errorSearch ', error)
        throw error
      })
  },


  searchByLocation: function (location, page = 1) {
    return axios.get(
      // 'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&centre_point=' + location,
      'http://api.nestoria.co.uk/api',
      {
        params: {
          country: 'uk',
          pretty: 1,
          action: 'search_listings',
          encoding: 'json',
          listing_type: 'buy',
          page: page,
          centre_point: location
        }
      })
      .then(res => res.data.response)
      .catch(error => {
        console.log('errorSearch ', error)
        throw error
      })
  }
}


export default searchService
