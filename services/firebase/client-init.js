import firebase from 'firebase/app'

import 'firebase/auth';
import 'firebase/firestore';

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

const firestore = firebase.firestore()
const auth = firebase.auth()
const currentUser = firebase.auth().currentUser

firestore.settings({timestampsInSnapshots: true})

const google = new firebase.auth.GoogleAuthProvider()
const github = new firebase.auth.GithubAuthProvider()

export default {
  firestore,
  auth,
  currentUser,
  provider: { google, github }
}
