import { useState } from 'react'
import { motion } from 'framer-motion'
import { ListChecks, Wand2, Info } from 'lucide-react'
import { TextArea } from '../components/Field'
import { Spinner, AiLoading } from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import CircularProgress from '../components/CircularProgress'
import CopyButton from '../components/CopyButton'
import { useToast } from '../context/ToastContext'
import { personSpec } from '../api/jobs'
import { friendlyError } from '../api/client'
import { parsePersonSpec, STATUS_META } from '../utils/parse'
import { loadJSON, saveJSON } from '../utils/storage'
import { bumpCounter } from '../utils/jobsStore'

function wc(t) {
  return (t || '').trim().split(/\s+/).filter(Boolean).length
}

export default function PersonSpec() {
  const toast = useToast()
  const profile = loadJSON('profile', {})
  const cached = loadJSON('person_spec_draft', {})

  const [cvText, setCvText] = useState(cached.cvText || profile?.cv_text || '')
  const [spec, setSpec] = useState(cached.spec || '')
  const [loading, setLoading] = useState(false)
  const [parsed, setParsed] = useState(cached.parsed || null)

  async function handleMatch() {
    if (wc(cvText) < 30 || wc(spec) < 10) {
      toast.error('Add your CV and the person specification first.')
      return
    }
    setLoading(true)
    setParsed(null)
    try {
      const data = await personSpec({ cv_text: cvText, person_spec: spec })
      const p = parsePersonSpec(data.assessment)
      setParsed(p)
      bumpCounter('specs')
      saveJSON('person_spec_draft', { cvText, spec, parsed: p })
      toast.success(`Match score: ${p.score}%`)
    } catch (err) {
      toast.error(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  const counts = parsed
    ? parsed.criteria.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1
        return acc
      }, {})
    : {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-nhs-dark-blue">Person Spec Matcher</h1>
        <p className="mt-1 text-sm text-nhs-dark-grey">
          Score your CV against a person specification, criterion by criterion.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextArea
          label="Your CV"
          rows={9}
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          placeholder="Paste your CV…"
          className="nhs-card p-5"
        />
        <TextArea
          label="Person specification"
          rows={9}
          value={spec}
          onChange={(e) => setSpec(e.target.value)}
          placeholder="Paste the person specification — essential and desirable criteria…"
          className="nhs-card p-5"
        />
      </div>

      <button className="btn-primary" onClick={handleMatch} disabled={loading}>
        {loading ? <Spinner /> : <Wand2 className="h-4 w-4" />}
        {loading ? 'Matching…' : 'Match against spec'}
      </button>

      {loading && <AiLoading label="Scoring your CV against the spec" />}

      {!loading && !parsed && (
        <EmptyState icon={ListChecks} title="Your match report will appear here">
          Add your CV and the person specification, then run the match. It usually takes 1–3 minutes.
        </EmptyState>
      )}

      {!loading && parsed && (
        <div className="space-y-6">
          {/* Score header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="nhs-card flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-center"
          >
            <CircularProgress value={parsed.score} label="overall match" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-nhs-dark-blue">
                {parsed.score >= 70
                  ? 'Strong match'
                  : parsed.score >= 40
                    ? 'Partial match — worth strengthening'
                    : 'Early-stage match'}
              </h3>
              <p className="mt-1 text-sm text-nhs-dark-grey">
                Based on {parsed.criteria.length || '—'} criteria in the specification.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(STATUS_META).map(([k, meta]) => (
                  <span key={k} className={`pill ${meta.pill}`}>
                    {counts[k] || 0} {meta.label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Criteria */}
          {parsed.hadStructure ? (
            <div className="space-y-3">
              {parsed.criteria.map((c, i) => {
                const meta = STATUS_META[c.status]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.4) }}
                    className="nhs-card p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-semibold text-nhs-dark-blue">{c.criterion}</p>
                      <span className={`pill ${meta.pill}`}>{meta.label.toUpperCase()}</span>
                    </div>
                    {c.evidence && (
                      <p className="mt-2 text-sm leading-relaxed text-nhs-dark-grey">
                        <span className="font-semibold text-nhs-mid-grey">Evidence: </span>
                        {c.evidence}
                      </p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="nhs-card p-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold text-nhs-dark-grey">
                  <Info className="h-4 w-4 text-nhs-blue" /> Raw assessment
                </p>
                <CopyButton text={parsed.raw} />
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-nhs-black">
                {parsed.raw}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
