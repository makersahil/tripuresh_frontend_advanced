import { useState } from 'react'
import { http } from '../../config/api'
import { useAuth } from './useAuth'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@tripuresh.in')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: any) {
    e.preventDefault()
    setErr(null)
    try {
      const res = await http.post('/api/v1/auth/login', { email, password })
      const token = res.data?.data?.token
      if (token) login(token)
        if (res) {
      navigate("/admin")   // ✅ Always redirect to dashboard root
    }

    } catch (e: any) {
      setErr(e?.message ?? 'Login failed')
    }
  }

  return (
    <div className="container py-10 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        {err && <div className="text-red-600">{err}</div>}
        <Button type="submit">Sign in</Button>
      </form>
    </div>
  )
}
