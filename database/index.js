import 'firebase/auth';
import 'firebase/firestore';

import firebase from 'firebase/app';

import config from './config';

if (!config) {
  throw new Error('missing firebase.json config.')
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

firebase.auth().useDeviceLanguage()

const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true};
firestore.settings(settings);

export default firebase
