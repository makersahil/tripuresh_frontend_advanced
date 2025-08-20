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
