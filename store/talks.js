import {db} from '../services/firebase/client-init.js';


export const state = () => ({
  list: []
})

export const getters = {
  list(state) {
    return state.list
  }
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
