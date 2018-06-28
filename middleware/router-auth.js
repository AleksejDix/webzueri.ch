export default function({ store, redirect, route }) {
  store.state.authUser != null && route.name == 'login' ? redirect('/speaker') : '';
  store.state.authUser == null && isSpeakerRoute(route) ? redirect('/login') : '';
}

function isSpeakerRoute(route) {
  if (route.matched.some(record => record.path == '/speaker')) {
    return true
  }
}
