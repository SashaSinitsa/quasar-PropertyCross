// import jsonp from 'src/service/jsonp'
import jsonp from 'src/service/axios'

const searchService = {
  search: function (q) {
    return jsonp.search(q)
      .then((res) => {
        let code = res.application_response_code
        if (code) {
          return res
          // console.log('res: ', res)
          // if (code === '200' || code === '202') {
          //   self.locations = res.locations
          //   console.log('unknown location')
          // }
          // else if (code === '100' || code === '101' || code === '110') {
          //   self.locations = res.listings
          // }
          // else { console.log('Error, status code: ' + code) }
        }
        // this.ref()
      })
      .catch((error) => {
        console.log('errorSearch ', error)
        throw error
      })
  },


  searchByLocation: function (location) {
    return jsonp.getList(location)
      .then((res) => {
        let code = res.application_response_code
        if (code) {
          return res

          // console.log('res: ', res)
          // if (code === '200' || code === '202') {
          //   self.locations = res.locations
          //   console.log('unknown location')
          // }
          // else if (code === '100' || code === '101' || code === '110') {
          //   self.locations = res.listings
          // }
          // else { console.log('Error, status code: ' + code) }
        }
        // this.ref()
      })
      .catch(error => {
        console.log('errorSearch ', error)
        throw error
      })
  }
}


export default searchService
