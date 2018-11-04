import firebase, {db} from '../services/firebase/client-init.js';

function setCookie (token) {
  const today = new Date()
  today.setTime(today.getTime() + 14*24*60*60*1000);
  var expires = "; expires=" + today.toUTCString();
  document.cookie = '__webzurich=' + token + expires + '; path=/;'
}

function deleteCookie () {
  document.cookie = "__webzurich=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export default async (context) => {

  firebase.auth.onAuthStateChanged(async (user) => {
    if (user) {

      setCookie(await user.getIdToken(true))

      context.store.dispatch('createProfile', user)

    } else {
      deleteCookie()
    }
  })

}


