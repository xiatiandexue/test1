import Cookies from 'js-cookie'

const TokenKey = 'Admin'
const NameKey = 'Name'
const RoleKey = 'Role'
var TimeKey = 'LoginTime'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function getName () {
  return Cookies.get(NameKey)
}

export function setName (name) {
  return Cookies.set(NameKey, name)
}

export function removeName () {
  return Cookies.remove(NameKey)
}

export function getRole () {
  return Cookies.get(RoleKey)
}

export function setRole (role) {
  return Cookies.set(RoleKey, role)
}

export function removeRole () {
  return Cookies.remove(RoleKey)
}

export function getTime () {
  return Cookies.get(TimeKey)
}

export function setTime (logintime) {
  return Cookies.set(TimeKey, logintime)
}

export function remove () {
  return Cookies.remove(TimeKey)
}