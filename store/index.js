import { fb } from '@/plugins/firebase-plugin';
import Vuex from 'vuex';

const firebase = fb;
const db = firebase.firestore();
db.settings({timestampsInSnapshots: true});

firebase.auth().useDeviceLanguage()

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: null,
      account: null,
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
      }
    },
    actions: {
      createNewAccount ({commit}, payload) {
        console.log(payload)
        const { uid, displayName, email, photoURL } = payload
        db.collection("users").doc(uid).set({displayName , email, photoURL})
        .then(docRef => {
          console.log("Document written with ID: ", docRef);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
      },

      async userGoogleLogin ({ dispatch, commit }) {
        const { user } = await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        dispatch('createNewAccount', user)
        commit('setUser', user)
      },

      async userGithubLogin ({ dispatch, commit }) {
        console.log('github')
        const { user } = await firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
        dispatch('createNewAccount', user)
        commit('setUser', user)
      },

      async userRegister ({ dispatch }, { email, password }) {
        const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password)
        dispatch('createNewAccount', user)
      },

      async userLogin ({commit}, {email, password}) {
        const user = await firebase.auth().signInWithEmailAndPassword(email, password)
        console.log('Username Password Login:', user)
        commit('setUser', user)
      },

      async userLogout ({commit}) {
        await firebase.auth().signOut()
        commit('resetUser')
      },

      // userNameUpdate ({ state }, name) {
      //   firebase.database().ref(`accounts/${state.user.uid}`).update({displayName: name})
      // },

      // userUpdateImage ({ state }, image) {
      //   firebase.database().ref(`accounts/${state.user.uid}`).update({image: image})
      // },

      // async userImageUpload ({state, commit}, file) {
      //   const snapshot = await firebase.storage().ref(`accounts/profile/${state.user.uid}`).put(files[0])
      //   const downloadURL = await snapshot.ref.getDownloadURL()
      //   commit('userUpdateImage', downloadURL)
      // },
    },
    mutations: {
      setUser (state, user) {
        state.user = user
      },
      resetUser (state) {
        state.user = null
      },
    }
  })
}

export default createStore
