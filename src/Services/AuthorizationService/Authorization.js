import store from '../../store'

class Authorization {
  constructor () {
    this._defineToken()
  }

  getToken () {
    return this.token
  }

  async _defineToken () {
    if (!store.getters['auth/token'] && localStorage.getItem('token')) {
      await store.dispatch('auth/setToken', localStorage.getItem('token'))
    }
    this.token = store.getters['auth/token']
    return this.token
  }

  getHeaders () {
    if (this.token) {
      return {
        'Authorization': `Bearer ${this.token}`
      }
    }
    return {}
  }

  reset () {
    localStorage.setItem('token', null)
    return store.dispatch('auth/setToken', null).then(() => {
      location.reload()
    })
  }
}

export default Authorization
