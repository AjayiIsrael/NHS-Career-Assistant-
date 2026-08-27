import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Briefcase,
  FileText,
  GitCompareArrows,
  ListChecks,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
} from 'lucide-react'
import PageTransition from '../components/PageTransition'

const FEATURES = [
  {
    icon: Briefcase,
    title: 'Job Matching',
    body: 'Paste your CV and our semantic search engine ranks the NHS roles that fit you best — by meaning, not just keywords.',
  },
  {
    icon: FileText,
    title: 'Supporting Statement Generator',
    body: 'Get two tailored drafts in seconds: a values-led version and an evidence-led version, ready to refine and submit.',
  },
  {
    icon: GitCompareArrows,
    title: 'Career Gap Analyser',
    body: 'See exactly where your experience is strong, where the gaps are, and the concrete steps to close them.',
  },
  {
    icon: ListChecks,
    title: 'Person Spec Matcher',
    body: 'Score your CV against any person specification, criterion by criterion, with the evidence pulled out for you.',
  },
]

const STEPS = [
  { n: '1', t: 'Add your CV', d: 'Paste your CV once. Every tool reuses it.' },
  { n: '2', t: 'Pick a tool', d: 'Match jobs, draft a statement, analyse gaps or score a spec.' },
  { n: '3', t: 'Apply with confidence', d: 'Copy, tweak and submit a stronger application.' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function Landing() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-nhs-blue/10 blur-3xl" />
          <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-nhs-light-blue/10 blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.span
              variants={item}
              className="pill bg-nhs-blue/10 text-nhs-blue"
            >
              <Sparkles className="h-3.5 w-3.5" /> AI built for NHS applications
            </motion.span>
            <motion.h1
              variants={item}
              className="mt-5 text-4xl font-extrabold leading-[1.1] text-nhs-dark-blue sm:text-5xl lg:text-6xl"
            >
              Your NHS Career,
              <br />
              <span className="text-nhs-blue">Powered by AI</span>
            </motion.h1>
            <motion.p variants={item} className="mt-5 max-w-xl text-lg text-nhs-dark-grey">
              NHS Career Assistant helps you find the right roles and write applications that
              actually land. Job matching, supporting statements, career gap analysis and person
              spec scoring — all in one place, tuned to how the NHS recruits.
            </motion.p>
            <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary text-base">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-secondary text-base">
                Login
              </Link>
            </motion.div>
            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-nhs-mid-grey"
            >
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-nhs-green" /> Your data stays in your browser
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-nhs-blue" /> First draft in minutes
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative"
          >
            <div className="nhs-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-nhs-red/60" />
                <span className="h-3 w-3 rounded-full bg-nhs-warm-yellow/70" />
                <span className="h-3 w-3 rounded-full bg-nhs-green/60" />
                <span className="ml-2 text-xs font-medium text-nhs-mid-grey">
                  Person Spec Matcher
                </span>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-nhs-dark-grey">Overall match</p>
                    <p className="text-3xl font-extrabold text-nhs-dark-blue">78%</p>
                  </div>
                  <div className="h-16 w-16 rounded-full border-[6px] border-nhs-green/25 border-t-nhs-green" />
                </div>
                {[
                  ['Registered nurse (NMC)', 'Covered', 'bg-nhs-green/12 text-nhs-green'],
                  ['Evidence of QI project', 'Partially met', 'bg-nhs-warm-yellow/20 text-[#9a6b00]'],
                  ['Band 6 leadership', 'Not found', 'bg-nhs-red/10 text-nhs-red'],
                ].map(([label, status, cls]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2.5"
                  >
                    <span className="text-sm font-medium text-nhs-dark-grey">{label}</span>
                    <span className={`pill ${cls}`}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-nhs-dark-blue sm:text-4xl">
              Four tools, one stronger application
            </h2>
            <p className="mt-3 text-lg text-nhs-dark-grey">
              Everything you need to move from job search to submitted application.
            </p>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={item}
                className="nhs-card group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-nhs-blue/10 text-nhs-blue transition-colors group-hover:bg-nhs-blue group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-nhs-dark-blue">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-nhs-dark-grey">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-nhs-dark-blue sm:text-4xl">How it works</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="nhs-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-nhs-dark-blue text-lg font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-bold text-nhs-dark-blue">{s.t}</h3>
                <p className="mt-1.5 text-sm text-nhs-dark-grey">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-nhs-blue to-nhs-dark-blue px-8 py-14 text-center shadow-xl">
            <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to build a stronger NHS application?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Set up your profile in three quick steps and start using every tool for free.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="btn bg-white text-nhs-blue hover:bg-slate-100 focus:ring-white/40 text-base"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="btn border border-white/40 text-white hover:bg-white/10 focus:ring-white/30 text-base"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
