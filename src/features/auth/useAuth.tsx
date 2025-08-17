import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as apiLogin, me } from './api'
import type { User, Role } from '@/lib/authTypes'
import { onAuthLogout } from '@/lib/authBus'

type AuthState = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasRole: (role: Role) => boolean
  refreshMe: () => Promise<void>
}

const AuthCtx = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'))
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Boot: try to load /auth/me if we have a token
  useEffect(() => {
    let active = true
    ;(async () => {
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const u = await me()
        if (active) {
          setUser(u)
          console.log('[auth] me() ok:', u)
        }
      } catch (e) {
        // Do NOT delete token here; let interceptor handle 401 on demand.
        if (active) {
          setUser(null)
          console.warn('[auth] me() failed, keeping token for now', e)
        }
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [token])

  // Global 401 logout
  useEffect(() => onAuthLogout(() => {
    console.warn('[auth] global logout')
    localStorage.removeItem('admin_token')
    setToken(null)
    setUser(null)
  }), [])

  async function login(email: string, password: string) {
    const t = await apiLogin({ email, password })
    localStorage.setItem('admin_token', t)
    setToken(t)
    try {
      const u = await me()
      setUser(u)
      console.log('[auth] login -> me() ok')
    } catch (e) {
      console.warn('[auth] login -> me() failed', e)
      // still proceed; guard lets them in, interceptor will catch any 401
    }
  }

  function logout() {
    localStorage.removeItem('admin_token')
    setToken(null)
    setUser(null)
  }

  async function refreshMe() {
    const u = await me()
    setUser(u)
  }

  function hasRole(role: Role) {
    return user?.role === role
  }

  const value = useMemo<AuthState>(() => ({
    user, token, loading, login, logout, hasRole, refreshMe
  }), [user, token, loading])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
