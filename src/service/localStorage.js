

let localStorage = {
      someObject: {
        type: Object,
        default: {
          hello: 'world'
        }
      },
      someNumber: {
        type: Number,
      },
      someBoolean: {
        type: Boolean
      },
      stringOne: '',
      stringTwo: {
        type: String,
        default: 'helloworld!'
      },
      stringThree: {
        default: 'hello'
      }
    },
    // methods: {
    //   someMethod () {
    //     let lsValue = this.$localStorage.get('someObject')
    //     this.$localStorage.set('someBoolean', true)
    //     this.$localStorage.remove('stringOne')
    //   }
    // }