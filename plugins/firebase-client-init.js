import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import * as firebase from 'firebase/app';



const config = {
  "apiKey": "AIzaSyCUj0VrsmXrSBJINseBT86G6514Emg3GCU",
  "authDomain": "web-zuri.firebaseapp.com",
  "databaseURL": "https://web-zuri.firebaseio.com",
  "projectId": "web-zuri",
  "storageBucket": "web-zuri.appspot.com",
  "messagingSenderId": "265864207852"
}

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app()
export const Auth = firebase.auth()
export const Storage = firebase.storage()

export const DB = firebase.firestore()
const settings = {timestampsInSnapshots: true};
DB.settings(settings);

export const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const GithubAuthProvider = new firebase.auth.GithubAuthProvider()
