import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Briefcase,
  FileText,
  GitCompareArrows,
  ListChecks,
  ArrowRight,
  Bookmark,
  FileCheck2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getSavedJobs, getCounters } from '../utils/jobsStore'
import { loadJSON } from '../utils/storage'

const TOOLS = [
  {
    to: '/jobs',
    icon: Briefcase,
    title: 'Job Feed',
    body: 'Browse live NHS roles from Reed, with keyword, location, band and sponsorship filters.',
  },
  {
    to: '/statement',
    icon: FileText,
    title: 'Supporting Statement',
    body: 'Generate values-led and evidence-led drafts tailored to a specific job description.',
  },
  {
    to: '/career-gap',
    icon: GitCompareArrows,
    title: 'Career Gap Analyser',
    body: 'Get your strengths, gaps and recommended next steps against any role.',
  },
  {
    to: '/person-spec',
    icon: ListChecks,
    title: 'Person Spec Matcher',
    body: 'Score your CV against a person specification, criterion by criterion.',
  },
]

export default function Dashboard() {
  const { displayName } = useAuth()
  const saved = getSavedJobs()
  const counters = getCounters()
  const hasCv = !!loadJSON('profile', {})?.cv_text

  const stats = [
    { label: 'Saved roles', value: saved.length, icon: Bookmark },
    { label: 'Statements generated', value: counters.statements || 0, icon: FileCheck2 },
    { label: 'Gap analyses', value: counters.gaps || 0, icon: GitCompareArrows },
    { label: 'Spec matches', value: counters.specs || 0, icon: ListChecks },
  ]

  const first = (displayName || 'there').split(' ')[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-nhs-dark-blue sm:text-3xl">
          Welcome back, {first} 👋
        </h1>
        <p className="mt-1.5 text-nhs-dark-grey">
          {hasCv
            ? 'Your CV is saved. Pick a tool below to keep building your application.'
            : 'Add your CV on the Profile page once, and every tool will reuse it.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="nhs-card p-4"
          >
            <div className="flex items-center gap-2 text-nhs-mid-grey">
              <Icon className="h-4 w-4" />
              <span className="text-xs font-semibold">{label}</span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-nhs-dark-blue">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-bold text-nhs-dark-blue">AI tools</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {TOOLS.map(({ to, icon: Icon, title, body }) => (
            <Link
              key={to}
              to={to}
              className="nhs-card group flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-nhs-blue/10 text-nhs-blue transition-colors group-hover:bg-nhs-blue group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-nhs-dark-blue">{title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-nhs-dark-grey">{body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-nhs-blue">
                Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {!hasCv && (
        <div className="rounded-2xl border border-nhs-blue/20 bg-nhs-blue/5 p-5">
          <p className="text-sm font-semibold text-nhs-dark-blue">Start with your profile</p>
          <p className="mt-1 text-sm text-nhs-dark-grey">
            Paste your CV and fill in a few details so the AI tools have something to work with.
          </p>
          <Link to="/profile" className="btn-primary mt-4">
            Go to profile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
