import Vuex from 'vuex';
import { Auth, DB, Storage, GithubAuthProvider, GoogleAuthProvider } from '~/plugins/firebase-client-init.js';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loading: false,
      user: null,
      profile: '',
      eventsPerPage: 5,
      menu: {
        intern: {
          title: "Information",
          links: [
            {
              text: "Talks",
              desc: "Speeches given at <strong>web zurich</strong>",
              url: "/events/1"
            },
            {
              text: "Speakers",
              desc: "People who <strong>care and share</strong>",
              url: "/speakers"
            },
            {
              text: "Code of Conduct",
              desc: "Our rules of <strong>good behaviour</strong>",
              url: "/code-of-conduct"
            }
          ]
        },
        social: {
          title: "community",
          links: [
            {
              text: "Patreon",
              desc: "Support us with <strong>some money</strong>",
              url: "https://www.patreon.com/webzurich",
              color: "#f96854"
            },
            {
              text: "Slack",
              desc: "Get help from your <strong>local peers</strong>.",
              url: "https://webzuerich-invite.herokuapp.com/",
              color: "#79D4B6"
            },
            {
              text: "Twitter",
              desc: "Tell the world about <strong>web zurich</strong>",
              url: "https://twitter.com/webzuerich",
              color: "#1DA1F3"
            },
            {
              text: "Meetup",
              desc: "Join the group for <strong>latest updates</strong>",
              url: "https://www.meetup.com/Web-Zurich/",
              color: "#F7405F"
            }
          ]
        }
      }
    },
    getters: {
      isAuthenticated (state) {
        return !!state.user
      },
      activeUser: (state) => {
        return state.user
      },
      isLoading: (state) => {
        return state.loading
      }
    },
    actions: {
      // seed store with the userdata from serverMiddleware
      nuxtServerInit ({ commit }, { req }) {
        if (req.user) {
          commit('setUser', req.user)
        }
        if (req.profile) {
          commit('setProfile', req.profile)
        }
      },

      async createNewAccount ({commit}, {email, displayName: name, uid, photoURL: picture}) {
        await DB.collection("users").doc(uid).set({email, name, uid, picture})
        commit('setUser', {email, name, uid, picture})
        const docRef = await DB.collection("users").doc(uid)
        const doc = await docRef.get()
        commit('setProfile', doc.data())
        this.app.router.push('/profile/')
      },

      async userGoogleLogin ({ dispatch }) {
        const authData = await Auth.signInWithPopup(GoogleAuthProvider)
        dispatch('createNewAccount', authData.user)
      },

      async userGithubLogin ({ dispatch }) {
        const { user } = await Auth.signInWithPopup(GithubAuthProvider)
        dispatch('createNewAccount', user)
      },

      async userRegister ({ dispatch }, { email, password }) {
        const { user } = await Auth.createUserWithEmailAndPassword(email, password)
        dispatch('createNewAccount', user)
      },

      async userLogin ({commit}, {email, password}) {
        const user = await Auth.signInWithEmailAndPassword(email, password)
        commit('setUser', user)
      },

      async userLogout ({commit}) {
        await Auth.signOut()
        commit('resetUser')
      },

      // userNameUpdate ({ state }, name) {
      //   firebase.database().ref(`accounts/${state.user.uid}`).update({displayName: name})
      // },

      async userImageUpload ({state, commit}, payload) {
        const snapshot = await Storage.ref(`/profiles/${state.profile.uid}`).put(payload)
        const picture = await snapshot.ref.getDownloadURL()
        commit('updateUserImage', picture)
        DB.collection('users').doc(state.profile.uid).update({picture})


      },
    },
    mutations: {
      updateUserImage(state, payload) {
        state.profile.picture = payload
      },
      setUser (state, payload) {
        state.user = payload
      },
      setProfile (state, payload) {
        state.profile = payload
      },
      resetUser (state) {
        state.user = null
        state.profile = null
        this.app.router.push('/')
      },
      setLoading (state, payload) {
        state.loading = payload
      }
    }
  })
}

export default createStore
