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
