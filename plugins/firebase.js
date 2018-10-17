import 'firebase/firestore';

import firebase from 'firebase/app';
import Vue from 'vue';
import vuefire from 'vuefire';
import config from '~/firebase';

Vue.use(vuefire)

if (!config) {
  throw new Error('missing firebase.json config.')
}

export default function ({ store }, inject) {

    firebase.initializeApp(config)

    const firestore = firebase.firestore()
    const settings = { timestampsInSnapshots: true};
    firestore.settings(settings)
    inject('db', firestore)

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      store.commit('setUser', user)
    }
  })

  return firebase
}
