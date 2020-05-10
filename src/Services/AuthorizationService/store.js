const auth = {
  namespaced: true,
  state: {
    token: null
  },
  getters: {
    token: state => state.token
  },
  actions: {
    setToken ({commit}, token) {
      commit('SET_TOKEN', token)
    }
  },
  mutations: {
    'SET_TOKEN' (state, token) {
      state.token = token
    }
  }
}
export default auth
