import firebase from '../services/firebase/client-init.js';
import { startOfHour } from 'date-fns';

export const strict = false

export const state = () => ({
  page: 'index',
  eventsPerPage: 10,
  user: '',
})

export const getters = {
  hasUser (state) {
    return !!state.user
  },
  isAdmin(state) {
    if (!state.user) return false
    return state.user.role === 'admin'
  },
  isConnectedWithGoogle () {
    //console.log(firebase)
    // if (!firebase.currentUser.providerData) return
    // return !!firebase.currentUser.providerData.find(x => x.providerId === 'google.com')
  },
  isConnectedWithTwitter () {
    //return !!firebase.currentUser.providerData.find(x => x.providerId === 'twitter.com')
  },
  isConnectedWithGithub () {
   // return !!firebase.currentUser.providerData.find(x => x.providerId === 'github.com')
  }
}

export const actions = {
  // seed store with the userdata from serverMiddleware
  nuxtServerInit ({ commit }, { req }) {
    if (req.user) {
      commit('setUser', req.user)
    }
  },

  async createProfile ({commit}, user) {
    const userRef = await firebase.firestore.collection('users').doc(user.uid)

    const profile = {
      displayName : user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      isAnonymous: user.isAnonymous,
      uid: user.uid
    }

    userRef.set(profile, { merge: true })

    const doc = await userRef.get()

    if (doc.exists) {
      commit('setUser', doc.data())
    } else {
      commit('setUser', profile)
    }
  },

  async sendPasswordReset(context, {email}) {
    await firebase.auth.sendPasswordResetEmail(email)
  },

  async getUserProfile({ commit, state }) {
    const ref = await firebase.firestore.collection("users").doc(state.user.uid)
    const doc = await ref.get()
    commit('setUser', doc.data())
  },

  async userGoogleLogin () {
    await firebase.auth.signInWithPopup(firebase.provider.google)
  },

  async linkGoogle ({state}) {
    await firebase.auth.currentUser.linkWithPopup(firebase.provider.google)
  },

  async unlinkGoogle ({state}) {
    await firebase.auth.currentUser.unlink('google.com')
  },

  async userGithubLogin () {
    await firebase.auth.signInWithPopup(firebase.provider.github)
  },

  async linkGithub ({state}) {
    await firebase.auth.currentUser.linkWithPopup(firebase.provider.github)
  },

  async unlinkGithub ({state}) {
    await firebase.auth.currentUser.unlink('github.com')
  },

  async userTwitterLogin () {
    await firebase.auth.signInWithPopup(firebase.provider.twitter)
  },

  async linkTwitter ({state}) {
    await firebase.auth.currentUser.linkWithPopup(firebase.provider.twitter)
  },

  async unlinkTwitter ({state}) {
    await firebase.auth.currentUser.unlink('twitter.com')
  },

  async createUser ({ dispatch }, { email, password }) {
    await firebase.auth.createUserWithEmailAndPassword(email, password)
  },

  async updateProfile ({state, commit}, payload) {
    await firebase.auth.currentUser.updateProfile(payload)
    const usersRef = await firebase.firestore.collection('users')
    const userRef = await usersRef.doc(state.user.uid)
    await userRef.set(payload, { merge: true })
    commit('setUser', payload)
  },

  async updateEmail (state, payload) {
    await firebase.auth.currentUser.updateEmail(payload)
  },

  async updatePassword (state, payload) {
    await firebase.auth.currentUser.updatePassword(payload)
  },

  async signIn ({dispatch}, {email, password}) {
    await firebase.auth.signInWithEmailAndPassword(email, password)
  },

  async sendSignInLinkToEmail({dispatch}, email) {
    await firebase.auth.sendSignInLinkToEmail(email, {
      'url': window.location.href,
      'handleCodeInApp': true
     })
    alert('An email was sent to ' + email + '. Please use the link in the email to sign-in.');
  },

  async signOut ({commit}) {
    await firebase.auth.signOut()
    commit('signOut')
  },

  async userImageUpload ({state, commit}, payload) {
    const snapshot = await firebase.storage.ref(`/profiles/${state.user.uid}`).put(payload)
    return await snapshot.ref.getDownloadURL()
  }
}

export const mutations = {
  setUser(state, payload) {
    state.user = {...state.user, ...payload }
  },

  signOut (state) {
    state.user = null
    this.$router.push({name: 'index'})
  },

  updatePage(state, pageName) {
    state.page = pageName
  },
}
