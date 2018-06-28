import { auth } from '@/services/fireinit.js';

export default context => {
  const { store } = context;

  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(payload => {
      store.commit('SET_AUTH_USER', payload);
      resolve();
    });
  });
};
