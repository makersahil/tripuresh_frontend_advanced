import { Link, NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn("px-3 py-2 rounded-xl text-sm font-medium transition", isActive ? "bg-muted" : "hover:bg-muted")

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 bg-primary text-white px-3 py-2 rounded-xl"
      >
        Skip to content
      </a>
      <header className="border-b border-border sticky top-0 z-50 bg-white/70 backdrop-blur">
        <div className="container h-16 flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-bold">Tripuresh<span className="text-primary">.in</span></Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" className={linkClass} end>Home</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
            <NavLink to="/articles" className={linkClass}>Articles</NavLink>
            <NavLink to="/publications" className={linkClass}>Publications</NavLink>
            <NavLink to="/grants" className={linkClass}>Grants</NavLink>
            <NavLink to="/patents" className={linkClass}>Patents</NavLink>
            <NavLink to="/certifications" className={linkClass}>Certifications</NavLink>
            <NavLink to="/admin" className={linkClass}>Admin</NavLink>
          </nav>
        </div>
      </header>
    </>
  )
}
