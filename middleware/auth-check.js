export default function ({ store, redirect }) {
  if (!store.getters.activeUser) {
    return redirect('/login')
  }
}
