import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Contact from '../pages/Contact'
import ArticlesPage from '../features/articles/ArticlesPage'
import ArticleDetail from '../features/articles/ArticleDetail'
import PublicationsPage from '../features/publications/PublicationsPage'
import PublicationDetail from '../features/publications/PublicationDetail'
import GrantsPage from '../features/grants/GrantsPage'
import GrantDetail from '../features/grants/GrantDetail'
import PatentsPage from '../features/patents/PatentsPage'
import PatentDetail from '../features/patents/PatentDetail'
import CertificationsPage from '../features/certifications/CertificationsPage'
import CertificationDetail from '../features/certifications/CertificationDetail'
import SearchPage from '../features/search/SearchPage'
import NotFound from '../pages/NotFound'

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/articles" element={<ArticlesPage/>} />
      <Route path="/articles/:slug" element={<ArticleDetail/>} />
      <Route path="/publications" element={<PublicationsPage/>} />
      <Route path="/publications/:slug" element={<PublicationDetail/>} />
      <Route path="/grants" element={<GrantsPage/>} />
      <Route path="/grants/:slug" element={<GrantDetail/>} />
      <Route path="/patents" element={<PatentsPage/>} />
      <Route path="/patents/:slug" element={<PatentDetail/>} />
      <Route path="/certifications" element={<CertificationsPage/>} />
      <Route path="/certifications/:slug" element={<CertificationDetail/>} />
      <Route path="/search" element={<SearchPage/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  )
}
