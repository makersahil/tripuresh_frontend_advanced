import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function AdminShell() {
  const { isValid, token } = useAuth()
  if (!token || !isValid) {
    return (
      <div className="container py-10">
        <h2 className="text-2xl font-bold mb-4">Admin</h2>
        <p>Please <Link className="text-primary underline" to="/admin/login">login</Link> to continue.</p>
      </div>
    )
  }
  return (
    <div className="container py-8">
      <div className="mb-6 flex gap-3 text-sm">
        <Link className="underline" to="/admin">Dashboard</Link>
        <Link className="underline" to="/admin/articles">Articles</Link>
        <Link className="underline" to="/admin/publications">Publications</Link>
        <Link className="underline" to="/admin/grants">Grants</Link>
        <Link className="underline" to="/admin/patents">Patents</Link>
        <Link className="underline" to="/admin/certifications">Certifications</Link>
        <Link className="underline" to="/admin/profile">Profile</Link>
      </div>
      <Outlet/>
    </div>
  )
}
