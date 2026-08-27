import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function Spinner({ className = 'h-5 w-5', stroke = 'currentColor' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke={stroke} strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

const AI_MESSAGES = [
  'Reading your CV…',
  'Cross-referencing the job description…',
  'Drafting against NHS values…',
  'Checking evidence and impact…',
  'Polishing the final wording…',
]

/** Full-panel loading state for the long (1–3 min) AI calls. */
export function AiLoading({ label = 'Working on it', note }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-nhs-blue/25 bg-nhs-blue/[0.03] px-6 py-16 text-center">
      <div className="relative">
        <div className="h-14 w-14 rounded-full border-4 border-nhs-blue/15" />
        <Spinner className="absolute inset-0 h-14 w-14 text-nhs-blue" />
      </div>
      <div>
        <p className="text-base font-semibold text-nhs-dark-blue">{label}</p>
        <CyclingText messages={AI_MESSAGES} />
      </div>
      <p className="max-w-xs text-xs text-nhs-mid-grey">
        {note || 'This uses a local AI model and usually takes 1–3 minutes. You can keep this tab open.'}
      </p>
    </div>
  )
}

function CyclingText({ messages }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % messages.length), 3200)
    return () => clearInterval(id)
  }, [messages.length])
  return (
    <motion.p
      key={i}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1 text-sm text-nhs-mid-grey"
    >
      {messages[i]}
    </motion.p>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={`skeleton rounded-lg ${className}`} />
}
