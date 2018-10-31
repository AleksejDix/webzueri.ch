import firebase from '../services/firebase/client-init.js';
export const strict = false

export const state = () => ({
  eventsPerPage: 10,
  currentUser: '',
  profile: '',
})

export const getters = {
  profile(state) {
    return state.profile
  },
  isAuthenticated (state) {
    return !!state.currentUser
  }
}

export const actions = {
  // seed store with the userdata from serverMiddleware
  nuxtServerInit ({ commit }, { req }) {
    if (req.user) {
      commit('setCurrentUser', req.user)
    }
    if (req.profile) {
      commit('setUserProfile', req.profile)
    }
  },

  async getUserProfile({ commit, state }) {
    const ref = await firebase.firestore.collection("users").doc(state.currentUser)
    const doc = await ref.get()
    commit('setUserProfile', doc.data())
  },

  async createNewAccount ({commit}, user) {
    const {email, displayName: name, uid, photoURL: picture} = user;
    await firebase.firestore.collection("users").doc(uid).set({email, name, uid, picture})
    // commit('setUser', {email, name, uid, picture})
  },

  async userGoogleLogin ({ dispatch }) {
    const { user } = await firebase.auth.signInWithPopup(firebase.provider.google)
    dispatch('createNewAccount', user)
  },

  async userGithubLogin ({ dispatch }) {
    const { user } = await firebase.auth.signInWithPopup(firebase.provider.github)
    dispatch('createNewAccount', user)
  },

  async createUser ({ dispatch }, { email, password }) {
    const { user } = await firebase.auth.createUserWithEmailAndPassword(email, password)
    dispatch('createNewAccount', user)
  },

  async signIn (state, {email, password}) {
    await firebase.auth.signInWithEmailAndPassword(email, password)
  },

  async signOut ({commit}) {
    await firebase.auth.signOut()
    commit('signOut')
  },

  // userNameUpdate ({ state }, name) {
  //   firebase.database().ref(`accounts/${state.user.uid}`).update({displayName: name})
  // },

  // async userImageUpload ({state, commit}, payload) {
  //   const snapshot = await Storage.ref(`/profiles/${state.profile.uid}`).put(payload)
  //   const picture = await snapshot.ref.getDownloadURL()
  //   commit('updateUserImage', picture)
  //   store.collection('users').doc(state.profile.uid).update({picture})
  // }
}


export const mutations = {

  setCurrentUser(state, payload) {
    state.currentUser = payload
  },

  setUserProfile(state, payload) {
    state.profile = payload
  },

  signOut (state) {
    state.currentUser = null
    state.profile = null
  },

}

  // updateUserImage(state, payload) {
  //   state.profile.picture = payload
  // },
