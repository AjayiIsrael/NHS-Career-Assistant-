import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, MapPin, SlidersHorizontal, Briefcase, RefreshCw, AlertTriangle } from 'lucide-react'
import { Spinner } from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import JobCard from '../components/JobCard'
import { useToast } from '../context/ToastContext'
import { nhsFeed } from '../api/jobs'
import { friendlyError } from '../api/client'
import { getSavedKeys, toggleSavedJob, keyForJob } from '../utils/jobsStore'

const PER_PAGE = 20

const SPONSOR_TABS = [
  { key: 'all', label: 'All roles', test: () => true },
  { key: 'friendly', label: 'Sponsorship-friendly', test: (s) => s.includes('friendly') },
  { key: 'unknown', label: 'Quiet on sponsorship', test: (s) => s.includes('quiet') },
  { key: 'none', label: 'No sponsorship', test: (s) => s.includes('no sponsorship') },
]
const BANDS = ['All bands', 'Band 2', 'Band 3', 'Band 4', 'Band 5', 'Band 6', 'Band 7', 'Band 8', 'Band 9']
const SALARY_BANDS = [
  { label: 'Any salary', min: 0 },
  { label: '£25,000+', min: 25000 },
  { label: '£35,000+', min: 35000 },
  { label: '£45,000+', min: 45000 },
  { label: '£55,000+', min: 55000 },
]

function salaryFloor(salaryStr) {
  if (!salaryStr) return null
  const nums = String(salaryStr).replace(/,/g, '').match(/\d+(?:\.\d+)?/g)
  return nums ? Math.min(...nums.map(Number)) : null
}

function pageWindow(current, count) {
  const span = 2
  const pages = []
  const from = Math.max(1, current - span)
  const to = Math.min(count, current + span)
  if (from > 1) pages.push(1, from > 2 ? '…' : null)
  for (let p = from; p <= to; p++) pages.push(p)
  if (to < count) pages.push(to < count - 1 ? '…' : null, count)
  return pages.filter((p) => p !== null)
}

export default function JobFeed() {
  const toast = useToast()

  // Applied query (what the API is currently showing)
  const [query, setQuery] = useState({ keyword: '', location: '', page: 1 })
  // Draft inputs (not yet submitted)
  const [kw, setKw] = useState('')
  const [loc, setLoc] = useState('')

  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [savedKeys, setSavedKeys] = useState(getSavedKeys)
  const [sponsor, setSponsor] = useState('all')
  const [band, setBand] = useState('All bands')
  const [salaryMin, setSalaryMin] = useState(0)

  const fetchFeed = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await nhsFeed({
        keyword: query.keyword,
        location: query.location,
        page: query.page,
        per_page: PER_PAGE,
      })
      setJobs(Array.isArray(data.jobs) ? data.jobs : [])
      setTotal(Number(data.total) || 0)
    } catch (err) {
      setError(friendlyError(err, 'Could not load the NHS jobs feed.'))
      setJobs([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [query.page])

  function applySearch(e) {
    e?.preventDefault()
    setSponsor('all')
    setBand('All bands')
    setSalaryMin(0)
    setQuery({ keyword: kw.trim(), location: loc.trim(), page: 1 })
  }

  function handleToggleSave(job) {
    const nowSaved = toggleSavedJob(job)
    setSavedKeys(getSavedKeys())
    toast.success(nowSaved ? 'Role saved.' : 'Removed from saved.')
  }

  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE))

  const visible = useMemo(() => {
    return jobs.filter((job) => {
      if (sponsor !== 'all') {
        const tab = SPONSOR_TABS.find((t) => t.key === sponsor)
        if (!tab.test(String(job.sponsorship || '').toLowerCase())) return false
      }
      if (band !== 'All bands' && job.band !== band) return false
      if (salaryMin > 0) {
        const floor = salaryFloor(job.salary)
        if (floor === null || floor < salaryMin) return false
      }
      return true
    })
  }, [jobs, sponsor, band, salaryMin])

  const refineCount = (sponsor !== 'all') + (band !== 'All bands') + (salaryMin > 0)
  const hasSearch = query.keyword || query.location

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-nhs-dark-blue">Job Feed</h1>
          <p className="mt-1 text-sm text-nhs-dark-grey">
            Live NHS roles from Reed. Search by keyword and location, then refine the results.
          </p>
        </div>
        <button className="btn-ghost" onClick={fetchFeed} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Search */}
      <form onSubmit={applySearch} className="nhs-card p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="nhs-input pl-9"
              placeholder="Job title or keyword, e.g. staff nurse"
              value={kw}
              onChange={(e) => setKw(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="nhs-input pl-9"
              placeholder="City or region, e.g. Manchester"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
            />
          </div>
          <button className="btn-primary" disabled={loading}>
            {loading ? <Spinner /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </div>

        {/* Sponsorship tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {SPONSOR_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setSponsor(t.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                sponsor === t.key
                  ? 'bg-nhs-blue text-white'
                  : 'bg-slate-100 text-nhs-dark-grey hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Client-side refinements */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select className="nhs-input" value={band} onChange={(e) => setBand(e.target.value)}>
            {BANDS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <select
            className="nhs-input"
            value={salaryMin}
            onChange={(e) => setSalaryMin(Number(e.target.value))}
          >
            {SALARY_BANDS.map((s) => (
              <option key={s.label} value={s.min}>
                {s.label}
              </option>
            ))}
          </select>
          {refineCount > 0 && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 justify-self-start text-xs font-semibold text-nhs-blue hover:underline"
              onClick={() => {
                setSponsor('all')
                setBand('All bands')
                setSalaryMin(0)
              }}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Clear {refineCount} refinement
              {refineCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-nhs-mid-grey">
          Keyword and location search the full feed. Band, salary and sponsorship refine the
          {' '}roles on this page.
        </p>
      </form>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="nhs-card h-44 skeleton" />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn’t load the feed"
          action={
            <button className="btn-primary" onClick={fetchFeed}>
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          }
        >
          {error}
        </EmptyState>
      ) : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No roles found">
          {hasSearch
            ? 'Try a broader keyword or a different location.'
            : 'The feed returned no roles right now — try again shortly.'}
        </EmptyState>
      ) : visible.length === 0 ? (
        <EmptyState icon={Briefcase} title="No roles match your refinements">
          {refineCount > 0
            ? 'Clear the band, salary or sponsorship refinements to see all results on this page.'
            : 'Try a different page.'}
        </EmptyState>
      ) : (
        <>
          <p className="text-sm text-nhs-mid-grey">
            {total.toLocaleString()} role{total !== 1 ? 's' : ''} found
            {refineCount > 0 && ` · showing ${visible.length} of ${jobs.length} on this page`}
            {' · '}page {query.page} of {pageCount}
          </p>

          <div className="space-y-4">
            {visible.map((job) => {
              const k = keyForJob(job)
              return (
                <JobCard
                  key={k}
                  job={job}
                  saved={savedKeys.includes(k)}
                  onToggleSave={() => handleToggleSave(job)}
                />
              )
            })}
          </div>

          {pageCount > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
              <button
                className="btn-ghost px-3 py-1.5 text-xs"
                disabled={query.page === 1}
                onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}
              >
                Prev
              </button>
              {pageWindow(query.page, pageCount).map((p, i) =>
                p === '…' ? (
                  <span key={`gap-${i}`} className="px-1 text-xs text-nhs-mid-grey">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setQuery((q) => ({ ...q, page: p }))}
                    className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition ${
                      p === query.page
                        ? 'bg-nhs-blue text-white'
                        : 'bg-slate-100 text-nhs-dark-grey hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                className="btn-ghost px-3 py-1.5 text-xs"
                disabled={query.page === pageCount}
                onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
