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
  async submitTalk({rootState}, payload) {

    try {
      await db
        .collection('talks')
        .add({
          ...payload,
          authorUID: rootState.user.uid,
          authorDisplayName: rootState.user.displayName,
          authorPhotoURL: rootState.user.photoURL,
          submittedAt: new Date(),
          status: 'pending'
        })
    } catch (error) {
      console.log(error)
    }
  },

  async realTimeListener ({state, commit, rootState}) {
    const ref = await db.collection("talks").where("authorUID", "==", rootState.user.uid)

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if(change.type === 'added' && !state.list.some(e => e.id === change.doc.id)) {
          commit('addTalk', {id: change.doc.id, ...change.doc.data() })
        }
        if(change.type === 'modified') {
          console.log("updated talk: ", change.doc.data());
        }
        if(change.type === 'removed') {
          console.log("removed talk: ", change.doc.data());
        }
      })
    })
  },

  async getTalksByUser({commit, rootState}) {
    try {
      const snapshot = await db
        .collection("talks")
        .where("authorUID", "==", rootState.user.uid)
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
  },
  addTalk(state, payload) {
    state.list.push(payload)
  }
}
