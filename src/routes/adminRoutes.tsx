import { Route, Routes } from 'react-router-dom'
import AdminShell from '../admin/layout/AdminShell'
import DashboardPage from '../admin/dashboard/DashboardPage'
import AdminArticlesPage from '../admin/articles/AdminArticlesPage'
import AdminPublicationsPage from '../admin/publications/AdminPublicationsPage'
import AdminGrantsPage from '../admin/grants/AdminGrantsPage'
import AdminPatentsPage from '../admin/patents/AdminPatentsPage'
import AdminCertificationsPage from '../admin/certifications/AdminCertificationsPage'
import AdminProfilePage from '../admin/profile/AdminProfilePage'

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminShell />}>
        <Route index element={<DashboardPage/>} />
        <Route path="articles" element={<AdminArticlesPage/>} />
        <Route path="publications" element={<AdminPublicationsPage/>} />
        <Route path="grants" element={<AdminGrantsPage/>} />
        <Route path="patents" element={<AdminPatentsPage/>} />
        <Route path="certifications" element={<AdminCertificationsPage/>} />
        <Route path="profile" element={<AdminProfilePage/>} />
      </Route>
    </Routes>
  )
}
