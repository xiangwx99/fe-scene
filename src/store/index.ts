import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      message: 'hello vuex!'
    }
  }
})

export default store
