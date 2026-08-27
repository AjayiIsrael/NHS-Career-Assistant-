import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Logo from './Logo'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-nhs-mid-grey sm:flex-row">
          <Logo to={null} />
          <p>Built to help NHS applicants. Not affiliated with NHS England.</p>
          <p>© {new Date().getFullYear()} NHS Career Assistant</p>
        </div>
      </footer>
    </div>
  )
}
