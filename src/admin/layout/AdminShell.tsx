import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function AdminShell() {
  const { isValid, token, logout   } = useAuth()
  const navigate = useNavigate()
  if (!token || !isValid) {
    return (
      <div className="container py-10">
        <h2 className="text-2xl font-bold mb-4">Admin</h2>
        <p>Please <Link className="text-primary underline" to="/admin/login">login</Link> to continue.</p>
      </div>
    )
  }
  const handleLogout = () => {
    logout()
    navigate("/admin/login")   // redirect after clearing auth
  }
  return (
    <div className="container py-8">
      <div className="mb-6 flex gap-3 text-sm items-center">
        <Link className="underline" to="/admin">Dashboard</Link>
        <Link className="underline" to="/admin/articles">Articles</Link>
        <Link className="underline" to="/admin/publications">Publications</Link>
        <Link className="underline" to="/admin/grants">Grants</Link>
        <Link className="underline" to="/admin/patents">Patents</Link>
        <Link className="underline" to="/admin/certifications">Certifications</Link>
        <Link className="underline" to="/admin/profile">Profile</Link>
        <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 mt-1.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={handleLogout}>Logout</button>
      </div>
      <Outlet/>
    </div>
  )
}
