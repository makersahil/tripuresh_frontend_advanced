import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { token, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <div className="container py-12 text-center text-sm text-gray-600">Checking session…</div>
  if (!token) return <Navigate to="/admin/login" replace state={{ from: loc }} />
  return children
}
