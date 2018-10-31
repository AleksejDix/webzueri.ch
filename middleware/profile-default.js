export default function ({ route, redirect }) {
  console.log(route.fullPath)
  if (route.fullPath === "/user/") {
    return redirect('/user/talks')
  }
}
