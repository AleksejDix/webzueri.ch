import { Auth } from '~/plugins/firebase-client-init.js';

export default (context) => {
  Auth.addAuthTokenListener(function (idToken) {
    document.cookie = '__session=' + idToken + ';max-age=' + (idToken ? 3600 : 0);
  });
}
