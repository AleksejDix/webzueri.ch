export default function (context) {
  const { store, redirect } = context

  if (!store.getters.hasUser) {
    if (context.query.redirect) {
      return redirect(`/signin/?redirect=${context.query.redirect}`)
    }
    return redirect('/signin/')
  }
}
