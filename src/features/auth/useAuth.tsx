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

  // Load current user if token exists
  useEffect(() => {
    let active = true
    async function boot() {
      if (!token) { setUser(null); setLoading(false); return }
      try {
        setLoading(true)
        const u = await me()
        if (active) setUser(u)
      } catch {
        // invalid token -> clear
        if (active) { localStorage.removeItem('admin_token'); setToken(null); setUser(null) }
      } finally {
        if (active) setLoading(false)
      }
    }
    boot()
    return () => { active = false }
  }, [token])

  // Respond to global 401 (from axios interceptor)
  useEffect(() => onAuthLogout(() => {
    localStorage.removeItem('admin_token')
    setToken(null)
    setUser(null)
  }), [])

  async function login(email: string, password: string) {
    const t = await apiLogin({ email, password })
    localStorage.setItem('admin_token', t)
    setToken(t)
    const u = await me()
    setUser(u)
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
