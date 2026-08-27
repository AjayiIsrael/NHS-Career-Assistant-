import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Save, FileText, CheckCircle2 } from 'lucide-react'
import { TextField, TextArea } from '../components/Field'
import { Spinner } from '../components/Spinner'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { loadJSON, saveJSON } from '../utils/storage'

const FIELDS = [
  { key: 'full_name', label: 'Full name', type: 'text', placeholder: 'Jane Doe' },
  { key: 'headline', label: 'Professional headline', type: 'text', placeholder: 'Band 5 Staff Nurse | Acute Medicine' },
  { key: 'current_role', label: 'Current role', type: 'text', placeholder: 'Staff Nurse' },
  { key: 'employer', label: 'Current employer', type: 'text', placeholder: 'City Hospitals NHS Foundation Trust' },
  { key: 'years_experience', label: 'Years of experience', type: 'number', placeholder: '4' },
]
const TEXTAREAS = [
  { key: 'specialties', label: 'Specialties', placeholder: 'Acute medicine, tissue viability, mentorship…' },
  { key: 'qualifications', label: 'Qualifications', placeholder: 'BSc (Hons) Nursing, ILS, mentorship qualification…' },
  { key: 'key_achievements', label: 'Key achievements', placeholder: 'Led a falls-reduction project that cut incidents by 30%…' },
  { key: 'why_nhs', label: 'Why the NHS', placeholder: 'What draws you to NHS values and this kind of work…' },
]
const REG_FIELDS = [
  { key: 'nmc_pin', label: 'NMC PIN', placeholder: '12A3456B' },
  { key: 'gmc_number', label: 'GMC number', placeholder: '7654321' },
  { key: 'hcpc_number', label: 'HCPC number', placeholder: 'PH123456' },
]

const ALL_KEYS = [
  ...FIELDS.map((f) => f.key),
  ...TEXTAREAS.map((f) => f.key),
  'cv_text',
]

export default function Profile() {
  const toast = useToast()
  const { updateDisplayName } = useAuth()
  const fileRef = useRef(null)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(() => loadJSON('profile', {}))
  const [cvFileName, setCvFileName] = useState(profile.cv_file_name || '')

  const set = (key) => (e) =>
    setProfile((p) => ({ ...p, [key]: e.target.value }))

  const completion = useMemo(() => {
    const filled = ALL_KEYS.filter((k) => String(profile[k] || '').trim().length > 0).length
    return Math.round((filled / ALL_KEYS.length) * 100)
  }, [profile])

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setCvFileName(file.name)
    const isText = /\.txt$/i.test(file.name) || file.type === 'text/plain'
    if (isText) {
      const text = await file.text()
      setProfile((p) => ({ ...p, cv_text: text, cv_file_name: file.name }))
      toast.success('CV text imported.')
    } else {
      setProfile((p) => ({ ...p, cv_file_name: file.name }))
      toast.info(
        'Saved the file name. Automatic text extraction from PDF/DOCX isn’t available yet — paste your CV text below so the AI tools can use it.',
      )
    }
    e.target.value = ''
  }

  function handleSave() {
    setSaving(true)
    saveJSON('profile', { ...profile, cv_file_name: cvFileName })
    if (profile.full_name) updateDisplayName(profile.full_name)
    setTimeout(() => {
      setSaving(false)
      toast.success('Profile saved.')
    }, 400)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-nhs-dark-blue">Profile</h1>
        <p className="mt-1 text-sm text-nhs-dark-grey">
          Fill this in once. Your CV text is reused across every AI tool.
        </p>
      </div>

      {/* Completion */}
      <div className="nhs-card p-5">
        <div className="flex items-center justify-between text-sm font-semibold text-nhs-dark-grey">
          <span>Profile completion</span>
          <span className="text-nhs-blue">{completion}%</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full rounded-full bg-nhs-blue"
            animate={{ width: `${completion}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* CV upload */}
      <div className="nhs-card p-6">
        <h2 className="font-bold text-nhs-dark-blue">Your CV</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={handleFile}
          />
          <button className="btn-secondary" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Upload CV (PDF / DOCX / TXT)
          </button>
          {cvFileName && (
            <span className="inline-flex items-center gap-1.5 text-sm text-nhs-mid-grey">
              <FileText className="h-4 w-4" /> {cvFileName}
            </span>
          )}
        </div>
        <TextArea
          label="CV text"
          rows={10}
          value={profile.cv_text || ''}
          onChange={set('cv_text')}
          placeholder="Paste your full CV text here…"
          className="mt-4"
          hint="This is the text the AI tools read. Keep it up to date."
        />
      </div>

      {/* Details */}
      <div className="nhs-card space-y-4 p-6">
        <h2 className="font-bold text-nhs-dark-blue">About you</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <TextField
              key={f.key}
              label={f.label}
              type={f.type}
              placeholder={f.placeholder}
              value={profile[f.key] || ''}
              onChange={set(f.key)}
            />
          ))}
        </div>
        {TEXTAREAS.map((f) => (
          <TextArea
            key={f.key}
            label={f.label}
            rows={3}
            placeholder={f.placeholder}
            value={profile[f.key] || ''}
            onChange={set(f.key)}
          />
        ))}
      </div>

      {/* Registration numbers */}
      <div className="nhs-card space-y-4 p-6">
        <h2 className="font-bold text-nhs-dark-blue">Professional registration</h2>
        <p className="-mt-2 text-sm text-nhs-mid-grey">
          Only complete the ones that apply to your profession.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {REG_FIELDS.map((f) => (
            <TextField
              key={f.key}
              label={f.label}
              placeholder={f.placeholder}
              value={profile[f.key] || ''}
              onChange={set(f.key)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <Spinner /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving…' : 'Save profile'}
        </button>
        {completion === 100 && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-nhs-green">
            <CheckCircle2 className="h-4 w-4" /> Profile complete
          </span>
        )}
      </div>
    </div>
  )
}
