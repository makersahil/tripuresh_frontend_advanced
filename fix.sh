#!/usr/bin/env bash
set -euo pipefail

# directories
mkdir -p src/features/auth
mkdir -p src/routes/guards
mkdir -p src/pages/admin
mkdir -p src/lib

# ---------- lib: a tiny event bus to broadcast auth/logout ----------
cat > src/lib/authBus.ts <<'TS'
type Handler = () => void
const listeners = new Set<Handler>()
export function onAuthLogout(h: Handler) { listeners.add(h); return () => listeners.delete(h) }
export function emitAuthLogout() { for (const h of [...listeners]) try { h() } catch {} }
TS

# ---------- types (lightweight; merge with yours if you already have) ----------
cat > src/lib/authTypes.ts <<'TS'
export type Role = 'admin' | 'user'
export type User = {
  id: string
  email: string
  name?: string
  role?: Role
}
TS

# ---------- API: login + /auth/me ----------
cat > src/features/auth/api.ts <<'TS'
import { http } from '@/config/api'
import type { User } from '@/lib/authTypes'

type LoginBody = { email: string; password: string }
type LoginResp = { success: true; data: { token: string } }

export async function login(data: LoginBody): Promise<string> {
  const res = await http.post<LoginResp>('/auth/login', data)
  if (res.data?.success && res.data.data?.token) return res.data.data.token
  throw new Error('Invalid login response')
}

export async function me(): Promise<User> {
  const res = await http.get<{ success: true; data: User }>('/auth/me')
  if (res.data?.success) return res.data.data
  throw new Error('Failed to load profile')
}
TS

# ---------- Auth context + hook ----------
cat > src/features/auth/useAuth.tsx <<'TSX'
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
TSX

# ---------- Role helper ----------
cat > src/features/auth/useRole.ts <<'TS'
import { useAuth } from './useAuth'
import type { Role } from '@/lib/authTypes'
export function useRole(role: Role) {
  const { user } = useAuth()
  return user?.role === role
}
TS

# ---------- RequireAuth guard ----------
cat > src/routes/guards/RequireAuth.tsx <<'TSX'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { token, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <div className="container py-12 text-center text-sm text-gray-600">Checking session…</div>
  if (!token) return <Navigate to="/admin/login" replace state={{ from: loc }} />
  return children
}
TSX

# ---------- Minimal Admin pages ----------
cat > src/pages/admin/LoginPage.tsx <<'TSX'
import { FormEvent, useState } from 'react'
import { useAuth } from '@/features/auth/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import Input from '@/components/ui/input'

export default function LoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation() as any
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      setBusy(true); setError(null)
      await login(email, password)
      const to = loc?.state?.from?.pathname || '/admin'
      nav(to, { replace: true })
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="container py-12 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Email</span>
          <Input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Password</span>
          <Input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        </label>
        {error && <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
        <button
          disabled={busy}
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium bg-primary text-white disabled:opacity-50"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  )
}
TSX

cat > src/pages/admin/DashboardPage.tsx <<'TSX'
import { useAuth } from '@/features/auth/useAuth'
export default function DashboardPage() {
  const { user, logout } = useAuth()
  return (
    <section className="container py-10 grid gap-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="text-gray-700">Welcome{user?.name ? `, ${user.name}` : ''}!</div>
      <button onClick={logout} className="w-max rounded-2xl border border-border px-4 py-2 text-sm">Logout</button>
    </section>
  )
}
TSX

# ---------- axios response interceptor for 401 ----------
# (append-safe patch: re-write config/api.ts with response interceptor if not present)
node - <<'JS'
const fs = require('fs'), p='src/config/api.ts';
let s = fs.readFileSync(p,'utf8');
if (!s.includes('http.interceptors.response.use')) {
  s += `

import { emitAuthLogout } from '@/lib/authBus'

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401) {
      emitAuthLogout()
      // redirect to login without importing react-router
      if (typeof window !== 'undefined') {
        const atLogin = window.location.pathname.startsWith('/admin/login')
        if (!atLogin) window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)
`
  fs.writeFileSync(p, s)
  console.log('Added response interceptor to src/config/api.ts')
} else {
  console.log('Response interceptor already present in src/config/api.ts')
}
JS

echo "✅ Phase 3 auth patch applied."
