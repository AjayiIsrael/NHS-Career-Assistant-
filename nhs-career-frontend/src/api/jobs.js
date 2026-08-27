import api from './client'

/**
 * GET /jobs/nhs-feed — real NHS jobs sourced from the Reed.co.uk API.
 * -> { jobs: [...], total, page, per_page }
 */
export function nhsFeed({ keyword, location, page = 1, per_page = 20 } = {}) {
  return api
    .get('/jobs/nhs-feed', {
      params: {
        keyword: keyword || undefined,
        location: location || undefined,
        page,
        per_page,
      },
    })
    .then((r) => r.data)
}

/** POST /jobs/add  { title, description, requirements } -> { message, job_id } */
export function addJob({ title, description, requirements }) {
  return api.post('/jobs/add', { title, description, requirements }).then((r) => r.data)
}

/** POST /jobs/match  { cv_text, top_k } -> { matches: [{ title, description, requirements, score }] } */
export function matchJobs({ cv_text, top_k = 10 }) {
  return api.post('/jobs/match', { cv_text, top_k }).then((r) => r.data)
}

/** POST /jobs/generate-statement -> { values_led, evidence_led } */
export function generateStatement({ cv_text, job_description, word_count = 1000 }) {
  return api
    .post('/jobs/generate-statement', { cv_text, job_description, word_count })
    .then((r) => r.data)
}

/** POST /jobs/career-gap -> { strengths, gaps, recommendations } (newline-delimited strings) */
export function careerGap({ cv_text, job_description }) {
  return api.post('/jobs/career-gap', { cv_text, job_description }).then((r) => r.data)
}

/** POST /jobs/person-spec -> { assessment } (raw text block) */
export function personSpec({ cv_text, person_spec }) {
  return api.post('/jobs/person-spec', { cv_text, person_spec }).then((r) => r.data)
}
