import {db, timestamp} from '../../services/firebase/client-init.js';
import Vue from 'vue';
import {isAllowed} from '@/utils'

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
  },
  can(state, getters, rootState, rootGetters) {
    const can = (roles) => (isAllowed(roles, rootGetters.userRoles))
    return {
      list: can(['admin']),
      get: can(['admin']),
      set: can(['admin']),
      update: can(['admin']),
      delete: can(['admin']),
    }
  }
}

export const actions = {
  async sync ({state, commit, getters, rootState}) {
    const ref = await db.collection("talks")

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if ( change.type === 'added'
          && getters.can.set
          && !state.list.some(e => e.id === change.doc.id)) {
          commit('set', {id: change.doc.id, ...change.doc.data() })
        }
        if (change.type === 'modified'
          && getters.can.update) {
          commit('update', {id: change.doc.id, ...change.doc.data() })
        }
        if (change.type === 'removed'
          && getters.can.delete) {
          commit('destroy', change.doc.id)
        }
      })
    })
  },


  async list({commit, getters}) {
    try {
      if (!getters.can.list) {
        console.log(getters.can.list)
        throw new Error(`You don't have the rights to list this ressource`)
      }
      const snapshot = await db
        .collection("talks")
        .orderBy("submittedAt", "asc")
        .get()

      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))

      commit('list', docs)
    } catch (error) {
      console.error(error)
    }
  },

  async get ({commit, getters}, id) {
    try {
      if (!getters.can.get) throw new Error(`You don't have the rights to get this ressource`)

      const docRef = db.collection("talks").doc(id);
      const doc = await docRef.get()

      if (doc.exists) {
        commit('get',  {id: doc.id, ...doc.data() })
      }
    } catch (error) {
      console.log(error)
    }
  },


  async set({getters}, payload) {
    try {
      if (!getters.can.set) throw new Error(`You don't have the rights to set this ressource`)

      await db
        .collection('talks')
        .add({
          ...payload,
          status: 'approved'
        })

    } catch (error) {
      console.log(error)
    }
  },


  async update({state, getters}, payload) {
    try {
      if (!getters.can.update) throw new Error(`You don't have the rights to update this ressource`)

      const docRef = db.collection("talks").doc(state.current.id);
      const doc = await docRef.get()
      if (doc.exists) {
        docRef.update(payload)
      }
    } catch (error) {
      console.log(error)
    }
  },

  async destroy ({getters}, id) {
    if (!getters.can.update) throw new Error(`You don't have the rights to update this ressource`)

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
