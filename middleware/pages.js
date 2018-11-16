export default function({store, route}) {
  const {commit} = store
  const {path, params, query, name} = route
  commit('page/set', {path, params, query, name})
}
