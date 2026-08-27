import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import Logo from '../components/Logo'
import { TextField } from '../components/Field'
import { Spinner } from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { friendlyError } from '../api/client'

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      await login(form)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(friendlyError(err, 'Invalid email or password.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Logo />
          <h1 className="mt-8 text-2xl font-extrabold text-nhs-dark-blue">Log in</h1>
          <p className="mt-1.5 text-sm text-nhs-mid-grey">
            Welcome back. Enter your details to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <TextField
              label="Email address"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={update('password')}
              placeholder="••••••••"
            />
            <button type="submit" className="btn-primary w-full" disabled={busy}>
              {busy ? <Spinner /> : <LogIn className="h-4 w-4" />}
              {busy ? 'Signing in…' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-nhs-dark-grey">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-nhs-blue hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-nhs-blue to-nhs-dark-blue lg:block">
        <div className="pointer-events-none absolute -left-16 top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-80 w-80 rounded-full bg-nhs-light-blue/20 blur-3xl" />
        <div className="flex h-full flex-col justify-center px-14 text-white">
          <h2 className="text-3xl font-extrabold leading-tight">
            A stronger NHS application, every time.
          </h2>
          <p className="mt-4 max-w-md text-white/80">
            Pick up where you left off — your CV, matched roles and drafts are ready when you are.
          </p>
        </div>
      </div>
    </div>
  )
}
