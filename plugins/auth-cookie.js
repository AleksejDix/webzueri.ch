import firebase from '../services/firebase/client-init.js';


function setCookie (token) {
  const today = new Date()
  today.setTime(today.getTime() + 14*24*60*60*1000);
  var expires = "; expires=" + today.toUTCString();
  document.cookie = '__webzurich=' + token + expires + '; path=/;'
}

function deleteCookie () {
  document.cookie = "__webzurich=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export default (context) => {

  firebase.auth.onAuthStateChanged(async (user) => {
    if (user) {
      const token = await user.getIdToken(true)
      setCookie(token)
      context.store.commit('setCurrentUser', user.uid)
      context.store.dispatch('getUserProfile')
    } else {
      console.log('no user')
      deleteCookie()
    }
  })
}
