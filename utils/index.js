const hasRole = (x, list) => list.includes(x)

export default function (allowedRoles = [], userRoles = []) {
  return allowedRoles.some(x => hasRole(x, userRoles))
}
