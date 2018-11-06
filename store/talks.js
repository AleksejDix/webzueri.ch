import {db} from '../services/firebase/client-init.js';

function isAllowed(allowedRoles = [], userRoles = []) {
  const hasEveryRule = x => userRoles.includes(x)
  return allowedRoles.some(hasEveryRule)
}

export const state = () => ({
  list: []
})

export const getters = {
  list(state) {
    return state.list
  },
  canCreate(state, getters, rootState, rootGetters) {
    return isAllowed(['admin', 'speaker'], rootGetters.userRoles)
  },
  canRead(state, getters, rootState, rootGetters) {
    return isAllowed(['admin', 'guest', 'speaker'], rootGetters.userRoles)
  },
  canUpdate(state, getters, rootState, rootGetters) {
    return isAllowed(['admin', 'speaker'], rootGetters.userRoles)
  },
  canDelete(state, getters, rootState, rootGetters) {
    return isAllowed(['admin'], rootGetters.userRoles)
  },
}

export const actions = {


  async getTalksByUser({commit, rootState}) {
    try {
      const snapshot = await db
        .collection("talks")
        .orderBy("submittedAt", "asc")
        .get()

      const docs = snapshot.docs.map( doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
      commit('setTalks', docs)
    } catch (error) {
      console.log(error)
    }
  }
}

export const mutations = {
  setTalks(state, payload) {
    state.list = payload
  }
}
