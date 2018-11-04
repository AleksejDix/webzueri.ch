export default function ({ route, redirect }) {
  if (route.fullPath === "/user/") {
    return redirect('/user/talks')
  }
}
