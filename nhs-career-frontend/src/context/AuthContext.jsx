import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { TOKEN_KEY } from '../api/client'
import * as authApi from '../api/auth'
import { decodeJwt, isExpired } from '../utils/jwt'

const AuthContext = createContext(null)

const PROFILE_NAME_KEY = 'nhs_display_name'

function readToken() {
  const t = localStorage.getItem(TOKEN_KEY)
  if (!t || isExpired(t)) {
    if (t) localStorage.removeItem(TOKEN_KEY)
    return null
  }
  return t
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readToken)
  const [displayName, setDisplayName] = useState(
    () => localStorage.getItem(PROFILE_NAME_KEY) || '',
  )

  const applyToken = useCallback((access_token) => {
    localStorage.setItem(TOKEN_KEY, access_token)
    setToken(access_token)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  useEffect(() => {
    const handler = () => logout()
    window.addEventListener('nhs:unauthorised', handler)
    return () => window.removeEventListener('nhs:unauthorised', handler)
  }, [logout])

  const login = useCallback(
    async ({ email, password }) => {
      const data = await authApi.login({ email, password })
      applyToken(data.access_token)
      return data
    },
    [applyToken],
  )

  const register = useCallback(
    async ({ username, email, password, fullName }) => {
      await authApi.register({ username, email, password })
      const data = await authApi.login({ email, password })
      applyToken(data.access_token)
      if (fullName) {
        localStorage.setItem(PROFILE_NAME_KEY, fullName)
        setDisplayName(fullName)
      }
      return data
    },
    [applyToken],
  )

  const updateDisplayName = useCallback((name) => {
    localStorage.setItem(PROFILE_NAME_KEY, name || '')
    setDisplayName(name || '')
  }, [])

  const claims = useMemo(() => (token ? decodeJwt(token) : null), [token])

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      username: claims?.sub || '',
      displayName: displayName || claims?.sub || '',
      login,
      register,
      logout,
      updateDisplayName,
    }),
    [token, claims, displayName, login, register, logout, updateDisplayName],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
