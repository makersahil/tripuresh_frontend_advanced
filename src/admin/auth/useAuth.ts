import { useState, useEffect } from 'react'
import { http } from '../../config/api'

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'))
  const [isValid, setValid] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      if (!token) { setValid(false); return }
      try {
        const res = await http.get('/api/v1/auth/me')
        setValid(!!res.data?.success)
      } catch {
        setValid(false)
      }
    })()
  }, [token])

  function login(t: string) { localStorage.setItem('admin_token', t); setToken(t) }
  function logout() { localStorage.removeItem('admin_token'); setToken(null); setValid(false) }

  return { token, isValid, login, logout }
}
