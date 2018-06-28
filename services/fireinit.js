import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';

var config = {
  apiKey: 'AIzaSyCUj0VrsmXrSBJINseBT86G6514Emg3GCU',
  authDomain: 'web-zuri.firebaseapp.com',
  databaseURL: 'https://web-zuri.firebaseio.com',
  projectId: 'web-zuri',
  storageBucket: 'web-zuri.appspot.com',
  messagingSenderId: '265864207852'
};

!firebase.apps.length ? firebase.initializeApp(config) : '';

export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const DB = firebase.database();
export default firebase;
