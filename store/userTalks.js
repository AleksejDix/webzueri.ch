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

  async sync ({state, commit, rootState}) {
    const ref = await db.collection("talks").where("authorUID", "==", rootState.user.uid)

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if(change.type === 'added' && !state.list.some(e => e.id === change.doc.id)) {
          commit('create', {id: change.doc.id, ...change.doc.data() })
        }
        if(change.type === 'modified') {
          commit('update', {id: change.doc.id, ...change.doc.data() })
        }
        if(change.type === 'removed') {
          commit('destroy', change.doc.id)
        }
      })
    })
  },

  async list({commit, rootState}) {

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

      commit('list', docs)

    } catch (error) {

      console.log(error)

    }
  },

  async edit ({commit}, id) {
    try {
      const docRef = db.collection("talks").doc(id);
      const doc = await docRef.get()
      if (doc.exists) {
        commit('edit',  {id: doc.id, ...doc.data() })
      }
    } catch (error) {
      console.log(error)
    }
  },

  async create({rootState}, payload) {

    try {

      await db
        .collection('talks')
        .add({
          ...payload,
          authorUID: rootState.user.uid,
          authorDisplayName: rootState.user.displayName,
          authorPhotoURL: rootState.user.photoURL,
          submittedAt: timestamp(),
          status: 'pending'
        })

    } catch (error) {
      console.log(error)
    }
  },

  async update({state, commit}) {
    try {
      const docRef = db.collection("talks").doc(state.current.id);
      const doc = await docRef.get()
      if (doc.exists) {
        docRef.update(state.current)
      }
    } catch (error) {
      console.log(error)
    }
  },

  async destroy ({commit}, id) {
    try {
      await db.collection("talks").doc(id).delete()
      console.log('Talk with ID', id, 'was successfully deleted!')
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  }
}

export const mutations = {
  list(state, payload) {
    state.list = payload
  },

  create(state, payload) {
    state.list.push(payload)
  },

  edit(state, payload) {
    state.current = payload
  },
  update(state, payload) {
    console.log(payload)
    const index = state.list.findIndex(x => x.id === payload.id)
    Vue.set(state.list, index, payload)
  },

  destroy(state, id) {
    state.list = state.list.filter(item => item.id != id);
  },

  updateTitle(state, payload) {
    state.current.title = payload
  },

  updateAbstract(state, payload) {
    state.current.abstract = payload
  }

}
