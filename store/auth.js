export const state = () => ({
  username: null,
  id: null,
  isAuthenticated: false,
  isAdmin: false
})

export const mutations = {
  setUsername(state, username) {
    state.username = username
  },
  setUserId(state, userId) {
    state.id = userId
  },
  clearUsername(state) {
    state.username = null
  },
  setAuthenticated(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated
  },
  isAdmin(state, data){
    state.isAdmin = data
  }
}

export const getters = {
  isAuthenticated(state) {
    return state.isAuthenticated
  },
  getUsername(state) {
    return state.username
  },
  getUserId(state) {
    return state.id
  },
  judgeAdmin(state) {
    console.log(state)
    return state.isAdmin
  }
}

export const actions = {
  async authenticateUser({ commit }, authData) {
    try {
      await this.$services.auth.login(authData.username, authData.password)
      commit('setAuthenticated', true)
    } catch(error) {
      throw new Error('The credential is invalid')
    }
  },
  async initAuth({ commit }) {
    try {
      const user = await this.$services.user.getMyProfile()
      console.log(user)
      commit('setAuthenticated', true)
      commit('setUsername', user.username)
      commit('setUserId', user.id)
      commit('isAdmin', user.is_superuser)
    } catch {
      commit('setAuthenticated', false)
    }
  },
  async logout({ commit }) {
    await this.$services.auth.logout()
    commit('setAuthenticated', false)
    commit('clearUsername')
  }
}
