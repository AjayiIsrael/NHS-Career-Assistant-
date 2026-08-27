import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Wand2, Download, Heart, Trophy } from 'lucide-react'
import { TextArea } from '../components/Field'
import { Spinner, AiLoading } from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import CopyButton from '../components/CopyButton'
import { useToast } from '../context/ToastContext'
import { generateStatement } from '../api/jobs'
import { friendlyError } from '../api/client'
import { downloadWordDoc } from '../utils/docx'
import { loadJSON, saveJSON } from '../utils/storage'
import { bumpCounter } from '../utils/jobsStore'

function wordCount(t) {
  return (t || '').trim().split(/\s+/).filter(Boolean).length
}

export default function Statement() {
  const toast = useToast()
  const profile = loadJSON('profile', {})
  const cached = loadJSON('statement_draft', {})

  const [cvText, setCvText] = useState(cached.cvText || profile?.cv_text || '')
  const [jobDesc, setJobDesc] = useState(cached.jobDesc || '')
  const [words, setWords] = useState(cached.words || 1000)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(cached.result || null)

  async function handleGenerate() {
    if (wordCount(cvText) < 30 || wordCount(jobDesc) < 15) {
      toast.error('Add your CV and the job description first.')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const data = await generateStatement({
        cv_text: cvText,
        job_description: jobDesc,
        word_count: words,
      })
      setResult(data)
      bumpCounter('statements')
      saveJSON('statement_draft', { cvText, jobDesc, words, result: data })
      toast.success('Two drafts ready below.')
    } catch (err) {
      toast.error(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'values_led',
      title: 'Values-led statement',
      icon: Heart,
      accent: 'text-nhs-blue',
      blurb: 'Opens with NHS values and why this role matters to you.',
    },
    {
      key: 'evidence_led',
      title: 'Evidence-led statement',
      icon: Trophy,
      accent: 'text-nhs-green',
      blurb: 'Opens with your strongest achievement and builds the evidence.',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-nhs-dark-blue">Supporting Statement Generator</h1>
        <p className="mt-1 text-sm text-nhs-dark-grey">
          Two tailored drafts from your CV and a job description — refine and submit.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: inputs */}
        <div className="nhs-card space-y-4 p-6">
          <TextArea
            label="Your CV"
            rows={9}
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Paste your CV…"
          />
          <TextArea
            label="Job description"
            rows={9}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description / advert…"
          />
          <div>
            <div className="nhs-label flex items-center justify-between">
              <span>Target length per statement</span>
              <span className="font-bold text-nhs-blue">{words} words</span>
            </div>
            <input
              type="range"
              min={750}
              max={1500}
              step={50}
              value={words}
              onChange={(e) => setWords(Number(e.target.value))}
              className="mt-2 w-full accent-nhs-blue"
            />
            <div className="mt-1 flex justify-between text-xs text-nhs-mid-grey">
              <span>750</span>
              <span>1500</span>
            </div>
          </div>
          <button className="btn-primary w-full" onClick={handleGenerate} disabled={loading}>
            {loading ? <Spinner /> : <Wand2 className="h-4 w-4" />}
            {loading ? 'Generating…' : 'Generate statements'}
          </button>
        </div>

        {/* Right: results */}
        <div className="space-y-4">
          {loading && <AiLoading label="Drafting your statements" />}

          {!loading && !result && (
            <EmptyState icon={FileText} title="Your drafts will appear here">
              Fill in your CV and the job description, choose a length, then generate. This usually
              takes 1–3 minutes.
            </EmptyState>
          )}

          {!loading &&
            result &&
            columns.map(({ key, title, icon: Icon, accent, blurb }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="nhs-card p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${accent}`} />
                    <h3 className="font-bold text-nhs-dark-blue">{title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CopyButton text={result[key]} />
                    <button
                      onClick={() =>
                        downloadWordDoc(
                          `supporting-statement-${key.replace('_led', '')}`,
                          title,
                          [{ heading: title, body: result[key] || '' }],
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-nhs-dark-grey transition hover:bg-slate-200"
                    >
                      <Download className="h-3.5 w-3.5" /> Word
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-nhs-mid-grey">{blurb}</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-nhs-black">
                  {result[key] || 'The model did not return this version — try generating again.'}
                </p>
                <p className="mt-3 text-xs text-nhs-mid-grey">{wordCount(result[key])} words</p>
              </motion.div>
            ))}

          {!loading && result && (
            <button
              onClick={() =>
                downloadWordDoc('supporting-statements', 'Supporting Statements', [
                  { heading: 'Values-led statement', body: result.values_led || '' },
                  { heading: 'Evidence-led statement', body: result.evidence_led || '' },
                ])
              }
              className="btn-secondary w-full"
            >
              <Download className="h-4 w-4" /> Download both as one Word doc
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
