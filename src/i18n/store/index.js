import i18n from '../../i18n'

export default {
  state: {
    langDefault: 'en',
    langFallback: 'en',
    langSupport: ['en', 'ru']
  },
  getters: {
    langDefault: state => {
      if (state.langSupport.indexOf(state.langDefault) === -1) {
        return state.langFallback
      }
      return state.langDefault
    },
    langSupport: state => state.langSupport
  },
  actions: {
    changeLang ({commit}, lang) {
      commit('LANG_CHANGE', {lang})
    }
  },
  mutations: {
    LANG_CHANGE (state, { lang }) {
      state.langDefault = lang
      // localStorage.setItem('lang', lang)
      i18n.locale = lang
    }
  }
}
