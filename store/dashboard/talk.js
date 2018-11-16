import {db, timestamp} from '../../services/firebase/client-init.js';
import Vue from 'vue';
import {isAllowed} from '@/utils'

export const state = () => ({
  list: [],
  current: '',
})

export const getters = {
  count(state) {
    if (!state.list) return 0
    return state.list.length
  },
  list(state) {
    if (!state.list) return []
    return state.list
  },
  can(state, getters, rootState, rootGetters) {
    const can = (roles) => (isAllowed(roles, rootGetters.userRoles))
    return {
      list: can(['admin', 'guest']),
      get: can(['admin', 'guest']),
      set: can(['admin', 'guest']),
      update: can(['admin', 'guest']),
      delete: can(['admin']),
    }
  }
}

export const actions = {

  async sync ({state, commit, rootState}) {
    const ref = await db.collection("talks")

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if(change.type === 'added' && !state.list.some(e => e.id === change.doc.id)) {
          commit('set', {id: change.doc.id, ...change.doc.data() })
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

      const docs = snapshot.docs.map( doc => ({ id: doc.id, ...doc.data() }))
      commit('list', docs)

    } catch (error) {
      console.log(error)
    }
  },

  async get ({commit}, id) {
    try {
      const docRef = db.collection("talks").doc(id);
      const doc = await docRef.get()
      if (doc.exists) {
        commit('get',  {id: doc.id, ...doc.data() })
      }
    } catch (error) {
      console.log(error)
    }
  },

  async set({rootState}, payload) {
    try {
      await db
        .collection('talks')
        .add({
          ...payload,
          authorUID: rootState.user.uid,
          authorDisplayName: rootState.user.displayName,
          authorPhotoURL: rootState.user.photoURL,
          submittedAt: timestamp(),
          status: 'draft'
        })

    } catch (error) {
      console.log(error)
    }
  },

  async update ({state, commit}, payload) {

    try {
      const docRef = db.collection("talks").doc(payload.id);
      const doc = await docRef.get()
      if (doc.exists) {
        docRef.update(payload)
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

  get(state, payload) {
    state.current = payload
  },

  set(state, payload) {
    state.list.push(payload)
  },

  update(state, payload) {
    const index = state.list.findIndex(x => x.id === payload.id)
    Vue.set(state.list, index, payload)
  },

  destroy(state, id) {
    state.list = state.list.filter(item => item.id != id);
  }
}
