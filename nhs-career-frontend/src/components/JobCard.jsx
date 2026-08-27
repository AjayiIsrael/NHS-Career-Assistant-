import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  Building2,
  Clock3,
  CalendarClock,
  BadgeCheck,
  FileText,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import { cleanFeedText } from '../utils/parse'

function daysUntil(dateStr) {
  if (!dateStr) return null
  // Feed uses DD/MM/YYYY
  const m = String(dateStr).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  const d = m ? new Date(`${m[3]}-${m[2]}-${m[1]}T23:59:59`) : new Date(dateStr)
  if (isNaN(d)) return null
  return Math.ceil((d - new Date()) / 86400000)
}

function sponsorStyle(sponsorship) {
  const s = String(sponsorship || '').toLowerCase()
  if (s.includes('friendly'))
    return { cls: 'bg-nhs-green/12 text-nhs-green ring-1 ring-nhs-green/20', icon: BadgeCheck }
  if (s.includes('no sponsorship') || s === 'none')
    return { cls: 'bg-nhs-red/10 text-nhs-red ring-1 ring-nhs-red/20', icon: null }
  return { cls: 'bg-slate-100 text-nhs-dark-grey ring-1 ring-slate-200', icon: null }
}

export default function JobCard({ job: raw, saved, onToggleSave }) {
  const [open, setOpen] = useState(false)

  const job = {
    ...raw,
    title: cleanFeedText(raw.title),
    employer: cleanFeedText(raw.employer),
    location: cleanFeedText(raw.location),
    salary: cleanFeedText(raw.salary),
    description: cleanFeedText(raw.description),
  }

  const closingIn = daysUntil(job.closing_date)
  const closingSoon = closingIn !== null && closingIn >= 0 && closingIn <= 7
  const hasBand = job.band && !/unknown/i.test(job.band)
  const sponsor = sponsorStyle(job.sponsorship)
  const SponsorIcon = sponsor.icon

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="nhs-card overflow-hidden"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill bg-nhs-dark-blue text-white">
              {hasBand ? job.band : 'Band N/A'}
            </span>
            {job.sponsorship && (
              <span className={`pill ${sponsor.cls}`}>
                {SponsorIcon && <SponsorIcon className="h-3.5 w-3.5" />}
                {job.sponsorship}
              </span>
            )}
            {job.contract && (
              <span className="pill bg-nhs-blue/10 text-nhs-blue">{job.contract}</span>
            )}
          </div>
          <button
            onClick={onToggleSave}
            className={`shrink-0 rounded-lg p-2 transition ${
              saved
                ? 'bg-nhs-blue/10 text-nhs-blue'
                : 'text-nhs-mid-grey hover:bg-slate-100 hover:text-nhs-blue'
            }`}
            aria-label={saved ? 'Remove from saved' : 'Save role'}
          >
            {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>

        <div className="mt-3 space-y-1 text-sm text-nhs-mid-grey">
          {job.employer && (
            <p className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" /> {job.employer}
            </p>
          )}
          {job.location && (
            <p className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {job.location}
            </p>
          )}
        </div>

        <h3 className="mt-2 text-lg font-bold text-nhs-dark-blue">{job.title || 'Untitled role'}</h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-nhs-dark-grey">
          {job.salary && <span className="font-semibold">{job.salary}</span>}
          {job.hours && (
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" /> {job.hours}
            </span>
          )}
          {job.closing_date && (
            <span
              className={`flex items-center gap-1.5 font-medium ${
                closingSoon ? 'text-nhs-red' : ''
              }`}
            >
              <CalendarClock className="h-4 w-4" /> Closes {job.closing_date}
              {closingSoon ? ` · ${closingIn}d left` : ''}
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-primary ${!job.url ? 'pointer-events-none opacity-50' : ''}`}
          >
            View role <ExternalLink className="h-4 w-4" />
          </a>
          {job.description && (
            <button className="btn-ghost" onClick={() => setOpen((o) => !o)}>
              <FileText className="h-4 w-4" /> Details
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
          )}
          <button className="btn-ghost" onClick={onToggleSave}>
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && job.description && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-slate-50/60"
          >
            <div className="p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-nhs-mid-grey">
                Job description
              </p>
              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-nhs-dark-grey">
                {job.description}
              </p>
              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-nhs-blue hover:underline"
                >
                  Read the full advert on Reed <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
