export default function ({ route, redirect }) {
  if (route.fullPath === "/dashboard/") {
    return redirect('/dashboard/talk')
  }
}
