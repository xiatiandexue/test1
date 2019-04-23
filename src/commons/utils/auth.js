import Cookies from 'js-cookie'
const UserIdKey = 'UserId'
const ClassIdKey = 'ClassId'
const TokenKey = 'Admin'
const NameKey = 'Name'
const RoleKey = 'Role'
var TimeKey = 'LoginTime'
var SessionKey = 'SHAREJSESSIONID'

export function getUserId () {
  return Cookies.get(UserIdKey)
}

export function setUserId (userId) {
  return Cookies.set(UserIdKey, userId)
}

export function removeUserId () {
  return Cookies.remove(UserIdKey)
}
export function getClassId () {
  return Cookies.get(ClassIdKey)
}

export function setClassId (classId) {
  return Cookies.set(ClassIdKey, classId)
}

export function removeClassId () {
  return Cookies.remove(ClassIdKey)
}
export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
   Cookies.remove(SessionKey)
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

export function removeTime () {
  return Cookies.remove(TimeKey)
}