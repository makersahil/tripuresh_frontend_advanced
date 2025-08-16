import { Route, Routes } from "react-router-dom"

import Home from "../pages/Home"
import About from "../pages/About"
import Contact from "../pages/Contact"
import NotFound from "../pages/NotFound"

import ArticlesPage from "../features/articles/ArticlesPage"
import ArticleDetail from "../features/articles/ArticleDetail"
import PublicationsPage from "../features/publications/PublicationsPage"
import PublicationDetail from "../features/publications/PublicationDetail"
import GrantsPage from "../features/grants/GrantsPage"
import GrantDetail from "../features/grants/GrantDetail"
import PatentsPage from "../features/patents/PatentsPage"
import PatentDetail from "../features/patents/PatentDetail"
import CertificationsPage from "../features/certifications/CertificationsPage"
import CertificationDetail from "../features/certifications/CertificationDetail"
import SearchPage from "../features/search/SearchPage"

import LoginPage from "../admin/auth/LoginPage"
import AdminShell from "../admin/layout/AdminShell"
import DashboardPage from "../admin/dashboard/DashboardPage"
import AdminArticlesPage from "../admin/articles/AdminArticlesPage"
import AdminPublicationsPage from "../admin/publications/AdminPublicationsPage"
import AdminGrantsPage from "../admin/grants/AdminGrantsPage"
import AdminPatentsPage from "../admin/patents/AdminPatentsPage"
import AdminCertificationsPage from "../admin/certifications/AdminCertificationsPage"
import AdminProfilePage from "../admin/profile/AdminProfilePage"

export default function RoutesIndex() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:slug" element={<ArticleDetail />} />
      <Route path="/publications" element={<PublicationsPage />} />
      <Route path="/publications/:slug" element={<PublicationDetail />} />
      <Route path="/grants" element={<GrantsPage />} />
      <Route path="/grants/:slug" element={<GrantDetail />} />
      <Route path="/patents" element={<PatentsPage />} />
      <Route path="/patents/:slug" element={<PatentDetail />} />
      <Route path="/certifications" element={<CertificationsPage />} />
      <Route path="/certifications/:slug" element={<CertificationDetail />} />
      <Route path="/search" element={<SearchPage />} />

      {/* Admin */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="articles" element={<AdminArticlesPage />} />
        <Route path="publications" element={<AdminPublicationsPage />} />
        <Route path="grants" element={<AdminGrantsPage />} />
        <Route path="patents" element={<AdminPatentsPage />} />
        <Route path="certifications" element={<AdminCertificationsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
