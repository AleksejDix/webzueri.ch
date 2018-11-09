import {db} from '@/services/firebase/client-init.js';

export const state = () => ({
  list: []
})

export const getters = {
  list(state) {
    if (!state.list) return []
    return state.list
  }
}

export const actions = {
  async list({commit}) {
    console.log('list me')
    try {
      const snapshot = await db
        .collection("stories")
        .orderBy("submittedAt", "desc")
        .get()


      const docs = snapshot.docs.map( doc => ({ id: doc.id, ...doc.data() }))
      commit('list', docs)

    } catch (error) {
      console.log(error)
    }
  },
}

export const mutations = {
  list(state, payload) {
    state.list = payload
  }

}
