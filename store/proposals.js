import {db, timestamp} from '../services/firebase/client-init.js';
import Vue from 'vue';

export const state = () => ({
  list: [],
  current: '',
})

export const getters = {
  count(state) {
    return state.list.length
  },
  list(state) {
    return state.list
  }
}

export const actions = {

  async list({commit, rootState}) {

    console.log('asd')

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

      console.log(docs)

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
