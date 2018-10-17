import 'firebase/firestore';

import Firebase from 'firebase';
import Vue from 'vue';
import config from '~/firebase';

if (!config) {
  throw new Error('missing firebase.json config.')
}

if (!Firebase.apps.length) {
  Firebase.initializeApp(config)
}

export const fb = Firebase

const firebasePlugin = {
  install () {
    if (Vue.__nuxt_firebase_installed__) {
      return
    }
    Vue.__nuxt_firebase_installed__ = true

    if (!Vue.prototype.$firebase) {
      Vue.prototype.$firebase = fb
    }
  }
}

Vue.use(firebasePlugin)

export default (ctx) => {
  const { app, store } = ctx
  app.$firebase = Vue.prototype.$firebase
  ctx.$firebase = Vue.prototype.$firebase
  if (store) {
    store.$firebase = Vue.prototype.$firebase
  }
}
