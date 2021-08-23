export const state = () => ({
  current: {},
})

export const getters = {
  currentProject(state) {
    console.log(state.current)
    return state.current
  },
  getCurrentUserRole(state) {
    console.log(state.current.current_users_role)
    return state.current.current_users_role || {}
  },
  canViewApproveButton(state) {
    const role = state.current.current_users_role
    return role && !role.is_annotator
  },
  getLink(state) {
    console.log(state.current.pageLink)
    return state.current.pageLink
  },
}

export const mutations = {
  setCurrent(state, payload) {
    state.current = payload
  }
}

export const actions = {
  async setCurrentProject({ commit }, projectId) {
    try {
      console.log(projectId)
      const response = await this.$services.project.findById(projectId)
      console.log(response)
      commit('setCurrent', response)
    } catch(error) {
      throw new Error(error)
    }
  }
}
