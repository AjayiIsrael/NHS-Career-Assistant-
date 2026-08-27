import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  GitCompareArrows,
  Wand2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react'
import { TextArea } from '../components/Field'
import { Spinner, AiLoading } from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import { useToast } from '../context/ToastContext'
import { careerGap } from '../api/jobs'
import { friendlyError } from '../api/client'
import { toList } from '../utils/parse'
import { loadJSON, saveJSON } from '../utils/storage'
import { bumpCounter } from '../utils/jobsStore'

const CARDS = [
  {
    key: 'strengths',
    title: 'Strengths',
    icon: CheckCircle2,
    ring: 'ring-nhs-green/25',
    head: 'bg-nhs-green/10 text-nhs-green',
    dot: 'text-nhs-green',
  },
  {
    key: 'gaps',
    title: 'Gaps',
    icon: AlertTriangle,
    ring: 'ring-nhs-red/25',
    head: 'bg-nhs-red/10 text-nhs-red',
    dot: 'text-nhs-red',
  },
  {
    key: 'recommendations',
    title: 'Recommendations',
    icon: Lightbulb,
    ring: 'ring-nhs-blue/25',
    head: 'bg-nhs-blue/10 text-nhs-blue',
    dot: 'text-nhs-blue',
  },
]

function wc(t) {
  return (t || '').trim().split(/\s+/).filter(Boolean).length
}

export default function CareerGap() {
  const toast = useToast()
  const profile = loadJSON('profile', {})
  const cached = loadJSON('career_gap_draft', {})

  const [cvText, setCvText] = useState(cached.cvText || profile?.cv_text || '')
  const [jobDesc, setJobDesc] = useState(cached.jobDesc || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(cached.result || null)

  async function handleAnalyse() {
    if (wc(cvText) < 30 || wc(jobDesc) < 15) {
      toast.error('Add your CV and the job description first.')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const data = await careerGap({ cv_text: cvText, job_description: jobDesc })
      setResult(data)
      bumpCounter('gaps')
      saveJSON('career_gap_draft', { cvText, jobDesc, result: data })
      toast.success('Analysis complete.')
    } catch (err) {
      toast.error(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-nhs-dark-blue">Career Gap Analyser</h1>
        <p className="mt-1 text-sm text-nhs-dark-grey">
          See your strengths, the gaps to close, and concrete next steps for a specific role.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextArea
          label="Your CV"
          rows={8}
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          placeholder="Paste your CV…"
          className="nhs-card p-5"
        />
        <TextArea
          label="Job description"
          rows={8}
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Paste the job description…"
          className="nhs-card p-5"
        />
      </div>

      <button className="btn-primary" onClick={handleAnalyse} disabled={loading}>
        {loading ? <Spinner /> : <Wand2 className="h-4 w-4" />}
        {loading ? 'Analysing…' : 'Analyse career gap'}
      </button>

      {loading && <AiLoading label="Analysing your fit for this role" />}

      {!loading && !result && (
        <EmptyState icon={GitCompareArrows} title="Your analysis will appear here">
          Add your CV and a job description, then run the analysis. It usually takes 1–3 minutes.
        </EmptyState>
      )}

      {!loading && result && (
        <div className="grid gap-5 lg:grid-cols-3">
          {CARDS.map(({ key, title, icon: Icon, ring, head, dot }, i) => {
            const items = toList(result[key])
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`nhs-card p-5 ring-1 ${ring}`}
              >
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${head}`}>
                  <Icon className="h-5 w-5" />
                  <h3 className="font-bold">{title}</h3>
                  <span className="ml-auto text-sm font-bold">{items.length}</span>
                </div>
                {items.length ? (
                  <ul className="mt-4 space-y-3">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex gap-2.5 text-sm text-nhs-dark-grey">
                        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${dot}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 whitespace-pre-wrap text-sm text-nhs-dark-grey">
                    {result[key] || 'Nothing returned for this section.'}
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
