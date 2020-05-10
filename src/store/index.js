import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import auth from '../Services/AuthorizationService/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    auth
  }
})
