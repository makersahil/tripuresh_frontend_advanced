import RoutesIndex from './routes'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <RoutesIndex />
      </main>
      <Footer />
    </div>
  )
}
