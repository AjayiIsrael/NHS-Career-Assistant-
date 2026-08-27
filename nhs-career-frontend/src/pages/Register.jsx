import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, UserPlus } from 'lucide-react'
import Logo from '../components/Logo'
import { TextField } from '../components/Field'
import { Spinner } from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { saveJSON } from '../utils/storage'
import { friendlyError } from '../api/client'

const BANDS = ['Band 3', 'Band 4', 'Band 5', 'Band 6', 'Band 7', 'Band 8']
const REGIONS = [
  'London',
  'South East',
  'South West',
  'Midlands',
  'North West',
  'North East & Yorkshire',
  'East of England',
  'Scotland',
  'Wales',
  'Northern Ireland',
]
const SITUATIONS = [
  'Currently overseas looking to relocate',
  'In the UK on a work/study visa',
  'UK citizen / settled status',
  'Already working in the NHS',
]

const STEP_TITLES = ['Target bands', 'Preferred regions', 'Your situation', 'Your details']

function Toggle({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
        active
          ? 'border-nhs-blue bg-nhs-blue text-white shadow-[0_8px_20px_-10px_rgba(0,94,184,0.8)]'
          : 'border-slate-300 bg-white text-nhs-dark-grey hover:border-nhs-blue/50 hover:bg-nhs-blue/5'
      }`}
    >
      <span className="flex items-center justify-between gap-2">
        {children}
        {active && <Check className="h-4 w-4 shrink-0" />}
      </span>
    </button>
  )
}

export default function Register() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [prefs, setPrefs] = useState({
    bands: [],
    regions: [],
    situation: '',
    needsSponsorship: null,
  })
  const [details, setDetails] = useState({ fullName: '', email: '', password: '' })

  const toggleIn = (key) => (value) =>
    setPrefs((p) => ({
      ...p,
      [key]: p[key].includes(value) ? p[key].filter((v) => v !== value) : [...p[key], value],
    }))

  const canContinue = useMemo(() => {
    if (step === 0) return prefs.bands.length > 0
    if (step === 1) return prefs.regions.length > 0
    if (step === 2) return prefs.situation && prefs.needsSponsorship !== null
    return (
      details.fullName.trim() &&
      /\S+@\S+\.\S+/.test(details.email) &&
      details.password.length >= 6
    )
  }, [step, prefs, details])

  const progress = ((step + (canContinue ? 1 : 0.35)) / 4) * 100

  async function handleFinish(e) {
    e.preventDefault()
    if (busy || !canContinue) return
    setBusy(true)
    try {
      const local = details.email.split('@')[0].replace(/[^a-zA-Z0-9._-]/g, '')
      const username = `${local || 'user'}${Math.floor(1000 + Math.random() * 9000)}`
      await register({
        username,
        email: details.email.trim(),
        password: details.password,
        fullName: details.fullName.trim(),
      })
      saveJSON('preferences', prefs)
      toast.success('Account created — welcome to NHS Career Assistant!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(friendlyError(err, 'Could not create your account.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-nhs-pale-grey/40">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Logo />

        {/* Progress */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-xs font-semibold text-nhs-mid-grey">
            {STEP_TITLES.map((t, i) => (
              <span key={t} className={i <= step ? 'text-nhs-blue' : ''}>
                {i + 1}. {t}
              </span>
            ))}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-nhs-blue"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <div className="nhs-card mt-6 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <>
                  <h1 className="text-xl font-extrabold text-nhs-dark-blue">
                    Which NHS pay bands are you targeting?
                  </h1>
                  <p className="mt-1 text-sm text-nhs-mid-grey">Select all that apply.</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {BANDS.map((b) => (
                      <Toggle
                        key={b}
                        active={prefs.bands.includes(b)}
                        onClick={() => toggleIn('bands')(b)}
                      >
                        {b}
                      </Toggle>
                    ))}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h1 className="text-xl font-extrabold text-nhs-dark-blue">
                    Where in the UK are you looking?
                  </h1>
                  <p className="mt-1 text-sm text-nhs-mid-grey">Select all that apply.</p>
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {REGIONS.map((r) => (
                      <Toggle
                        key={r}
                        active={prefs.regions.includes(r)}
                        onClick={() => toggleIn('regions')(r)}
                      >
                        {r}
                      </Toggle>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h1 className="text-xl font-extrabold text-nhs-dark-blue">
                    What best describes your situation?
                  </h1>
                  <div className="mt-5 grid gap-3">
                    {SITUATIONS.map((s) => (
                      <Toggle
                        key={s}
                        active={prefs.situation === s}
                        onClick={() => setPrefs((p) => ({ ...p, situation: s }))}
                      >
                        {s}
                      </Toggle>
                    ))}
                  </div>
                  <p className="mt-6 text-sm font-semibold text-nhs-dark-grey">
                    Do you need visa sponsorship?
                  </p>
                  <div className="mt-3 flex gap-3">
                    {[
                      ['Yes', true],
                      ['No', false],
                    ].map(([label, val]) => (
                      <Toggle
                        key={label}
                        active={prefs.needsSponsorship === val}
                        onClick={() => setPrefs((p) => ({ ...p, needsSponsorship: val }))}
                      >
                        <span className="w-16 text-center">{label}</span>
                      </Toggle>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <form onSubmit={handleFinish} className="space-y-4">
                  <h1 className="text-xl font-extrabold text-nhs-dark-blue">
                    Almost there — your details
                  </h1>
                  <TextField
                    label="Full name"
                    required
                    value={details.fullName}
                    onChange={(e) => setDetails((d) => ({ ...d, fullName: e.target.value }))}
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                  <TextField
                    label="Email address"
                    type="email"
                    required
                    value={details.email}
                    onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    required
                    value={details.password}
                    onChange={(e) => setDetails((d) => ({ ...d, password: e.target.value }))}
                    placeholder="At least 6 characters"
                    hint="Minimum 6 characters."
                    autoComplete="new-password"
                  />
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => (step === 0 ? navigate('/') : setStep((s) => s - 1))}
            >
              <ArrowLeft className="h-4 w-4" />
              {step === 0 ? 'Home' : 'Back'}
            </button>

            {step < 3 ? (
              <button
                type="button"
                className="btn-primary"
                disabled={!canContinue}
                onClick={() => setStep((s) => s + 1)}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                disabled={!canContinue || busy}
                onClick={handleFinish}
              >
                {busy ? <Spinner /> : <UserPlus className="h-4 w-4" />}
                {busy ? 'Creating account…' : 'Create account'}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-nhs-dark-grey">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-nhs-blue hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
