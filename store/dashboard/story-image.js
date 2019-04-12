import {
  storage
} from '../../services/firebase/client-init.js';

export const actions = {
  async set({
    rootState
  }, payload) {
    try {
      const path = `/stories/${rootState.user.uid}/post-cover-${payload.name}-${new Date().getTime()}`
      const snapshot = await storage
        .ref(path)
        .put(payload)
      return await snapshot.ref.getDownloadURL()

    } catch (error) {
      console.log(error)
    }
  }
}
