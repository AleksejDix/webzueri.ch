const hasRole = (x, list) => list.includes(x)

export function isAllowed (allowedRoles = [], userRoles = []) {
  return allowedRoles.some(x => hasRole(x, userRoles))
}

export function isInTheList (state, change) {
  return  state.list.some(e => e.id === change.doc.id)
}
