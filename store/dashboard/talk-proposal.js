import {db, timestamp} from '../../services/firebase/client-init.js';
import Vue from 'vue';
import {isAllowed, isInTheList} from '@/utils'


function getTimeStamp (data) {
  if(!data.submittedAt) {
    return {
      updatedAt: timestamp(),
      submittedAt: timestamp()
    }
  }
}

const getQuery = (user) => {
  if(user.roles.admin) {
    return db
      .collection("talks")
      .where("status", "==", "proposal")
      .orderBy("submittedAt", "asc")
  } else {
    return db
      .collection("talks")
      .where("status", "==", "proposal")
      .orderBy("submittedAt", "asc")
      .where("authorUID", "==", user.uid)
  }
}

export const state = () => ({
  list: [],
})

export const getters = {
  can(state, getters, rootState, rootGetters) {
    const can = (roles) => (isAllowed(roles, rootGetters.userRoles))
    return {
      list: can(['admin', 'guest']),
      get: can(['admin','guest']),
      set: can(['admin', 'guest']),
      update: can(['admin', 'guest']),
      delete: can(['admin', 'guest']),
    }
  }
}

export const actions = {
  async sync ({state, commit, getters, rootState}) {
    const ref = await getQuery(rootState.user)

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if ( change.type === 'added') {
          if (isInTheList(state, change)) {
            commit('update', {id: change.doc.id, ...change.doc.data() })
            return
          }
          commit('set', {id: change.doc.id, ...change.doc.data() })
        }

        if (change.type === 'modified') {
          commit('update', {id: change.doc.id, ...change.doc.data() })
        }

        if (change.type === 'removed') {
          commit('destroy', change.doc.id)
        }
      })
    })
  },


  async list({commit, getters, rootState}) {
    try {
      if (!getters.can.list) {
        throw new Error(`You don't have the rights to list this ressource`)
      }
      const snapshot = await getQuery(rootState.user).get()

      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))

      commit('list', docs)
    } catch (error) {
      console.error(error)
    }
  },

  async set({rootState}, payload) {

    try {
      await  db.collection("talks")
        .add({
          ...payload,
          authorUID: rootState.user.uid,
          authorDisplayName: rootState.user.displayName,
          authorPhotoURL: rootState.user.photoURL,
          createdAt: timestamp(),
          updatedAt: timestamp(),
          submittedAt: timestamp(),
          status: 'proposal'
        })

    } catch (error) {
      console.log(error)
    }
  },


  async update({getters, rootState}, payload) {
    const {data} = payload
    try {
      if (!getters.can.update) throw new Error(`You don't have the rights to update this ressource`)

      const docRef = db
        .collection("talks")
        .doc(payload.id);

      const doc = await docRef.get()
      if (doc.exists) {

        await docRef.update(
          {
            ...doc.data(),
            ...data,
            ...getTimeStamp(doc.data())

          }
        )
        return 'data was updated'
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const mutations = {
  list(state, payload) {
    state.list = payload
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
