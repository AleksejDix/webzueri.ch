export default function ({ store, route, redirect, $firebase }) {
  if (!store.getters.isAuthenticated && route.name !== 'login') {
    redirect('/account/login')
  }
  if (store.getters.isAuthenticated && route.name === 'login') {
    redirect('/account/')
  }
}
