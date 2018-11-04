import Vue from 'vue'
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

Vue.use(VueFire)
const config = {
  "apiKey": "AIzaSyCUj0VrsmXrSBJINseBT86G6514Emg3GCU",
  "authDomain": "web-zuri.firebaseapp.com",
  "databaseURL": "https://web-zuri.firebaseio.com",
  "projectId": "web-zuri",
  "storageBucket": "web-zuri.appspot.com",
  "messagingSenderId": "265864207852"
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const db = firebase.firestore()
db.settings({timestampsInSnapshots: true})

const storage = firebase.storage()
const auth = firebase.auth()
const currentUser = firebase.auth().currentUser



const google = new firebase.auth.GoogleAuthProvider()
const github = new firebase.auth.GithubAuthProvider()
const twitter = new firebase.auth.TwitterAuthProvider()

export default {
  firestore: db,
  auth,
  currentUser,
  storage,
  provider: { google, github, twitter }
}
