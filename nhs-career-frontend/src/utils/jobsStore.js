import { loadJSON, saveJSON } from './storage'

/** A stable key for a job coming from the NHS feed. */
export function keyForJob(job) {
  return (
    job?.url ||
    `${job?.title || ''}::${job?.employer || ''}::${job?.location || ''}`
  )
}

/** Saved / bookmarked roles — kept in the browser, referencing real feed jobs. */
export function getSavedJobs() {
  return loadJSON('saved_jobs', [])
}
export function getSavedKeys() {
  return getSavedJobs().map((j) => j._key)
}
export function toggleSavedJob(job) {
  const key = keyForJob(job)
  const list = getSavedJobs()
  const exists = list.some((j) => j._key === key)
  const next = exists
    ? list.filter((j) => j._key !== key)
    : [{ ...job, _key: key, savedAt: Date.now() }, ...list]
  saveJSON('saved_jobs', next)
  return !exists
}

export function bumpCounter(name, by = 1) {
  const counters = loadJSON('counters', {})
  counters[name] = (counters[name] || 0) + by
  saveJSON('counters', counters)
  return counters[name]
}
export function getCounters() {
  return loadJSON('counters', {})
}
