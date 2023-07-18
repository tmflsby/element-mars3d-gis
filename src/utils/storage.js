import Cookies from 'js-cookie'

const AccessTokenKey = 'access_token' + `_${document.location.host}`
const RefreshTokenKey = 'refresh_token' + `_${document.location.host}`
const options = {
  path: '/',
  domain: document.domain
}

export const getAccessToken = () => Cookies.get(AccessTokenKey)

export const setAccessToken = (token) => Cookies.set(AccessTokenKey, token, options)

export const removeAccessToken = () => Cookies.remove(AccessTokenKey, options)

export const getRefreshToken = () => Cookies.get(RefreshTokenKey)

export const setRefreshToken = (token) => Cookies.set(RefreshTokenKey, token, options)

export const removeRefreshToken = () => Cookies.remove(RefreshTokenKey, options)

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

export const removeLocalStorage = (key) => {
  localStorage.removeItem(key)
}

export const clearLocalStorage = () => {
  localStorage.clear()
}

export const setSessionStorage = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export const getSessionStorage = (key) => {
  return JSON.parse(sessionStorage.getItem(key))
}

export const removeSessionStorage = (key) => {
  sessionStorage.removeItem(key)
}

export const clearSessionStorage = () => {
  sessionStorage.clear()
}
