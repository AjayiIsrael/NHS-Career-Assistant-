import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          <a href="/#features" className="btn-ghost">Features</a>
          <a href="/#how" className="btn-ghost">How it works</a>
          {isAuthenticated ? (
            <button className="btn-primary ml-2" onClick={() => navigate('/dashboard')}>
              Go to dashboard
            </button>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="btn-primary ml-1" onClick={() => navigate('/register')}>
                Get started
              </button>
            </>
          )}
        </nav>

        <button
          className="rounded-lg p-2 text-nhs-dark-grey md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            <a href="/#features" className="btn-ghost justify-start" onClick={() => setOpen(false)}>
              Features
            </a>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary" onClick={() => setOpen(false)}>
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
