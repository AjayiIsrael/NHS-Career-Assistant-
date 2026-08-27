# NHS Career Assistant — Frontend

A modern React frontend for the NHS Career Assistant API: job matching, supporting
statement generation, career gap analysis and person spec matching.

- **React 18 + Vite** (plain JavaScript, no TypeScript)
- **React Router 6** for navigation and protected routes
- **Tailwind CSS** with an NHS colour system
- **Axios** with a JWT interceptor
- **framer-motion** for page transitions and loading states
- **lucide-react** for icons

## Prerequisites

**Node.js 18+ is required and is not currently installed on this machine.**
Install it from <https://nodejs.org> (LTS), then reopen your terminal so `node`
and `npm` are on your `PATH`.

## Getting started

```bash
cd nhs-career-frontend
npm install
npm run dev
```

The app runs at <http://localhost:5173>.

### Backend

The API base URL is read from `.env`:

```
VITE_API_URL=http://127.0.0.1:8000
```

Start the backend from the project root:

```bash
uvicorn app.main:app --reload
```

> **Backend change made for this frontend:** `app/main.py` now registers the
> `users` router (it previously only registered `jobs`, so `/users/register`
> and `/users/login` returned 404) and enables CORS for `http://localhost:5173`.

## Pages

| Route          | Page                          | Auth |
| -------------- | ----------------------------- | ---- |
| `/`            | Landing                       | –    |
| `/register`    | 3-step onboarding + sign up   | –    |
| `/login`       | Login                         | –    |
| `/dashboard`   | Dashboard + quick actions     | ✅   |
| `/jobs`        | Job Feed + filters + add job  | ✅   |
| `/statement`   | Supporting Statement Generator| ✅   |
| `/career-gap`  | Career Gap Analyser           | ✅   |
| `/person-spec` | Person Spec Matcher           | ✅   |
| `/profile`     | Profile + CV + completion bar | ✅   |

Protected routes redirect to `/login` when no valid token is present. The JWT is
stored in `localStorage` under `nhs_token` and sent as `Authorization: Bearer …`.

## Notes on API mapping

The backend currently stores jobs as free text (`title`, `description`,
`requirements`) and has **no job-list or job-count endpoint**. To honour the
Job Feed design:

- The feed is driven by `POST /jobs/match` (paste a CV → ranked roles).
- Jobs you add via the form are also kept in `localStorage` so they appear in
  the feed immediately.
- Band, salary, hours, NHS trust, location, closing date and sponsorship status
  are **derived heuristically** from the description text (`src/utils/parse.js`,
  `deriveJobMeta`). Populate those fields in the description when adding a job
  for the badges to appear.

`POST /jobs/person-spec` returns one raw text block; it is parsed client-side in
`src/utils/parse.js` (`parsePersonSpec`) into criteria + an overall score. If the
model doesn't follow the expected format, the raw text is shown instead.

Profile data and onboarding preferences are stored in `localStorage` (no backend
endpoint yet).

## AI request timing

`/jobs/generate-statement`, `/jobs/career-gap` and `/jobs/person-spec` call a
local Ollama model and can take **1–3 minutes**. The Axios timeout is set to
4 minutes and every AI action shows a full-panel loading state.

## Project structure

```
src/
  api/         axios client + endpoint wrappers
  context/     AuthContext, ToastContext
  components/  layout, sidebar, cards, spinners, inputs
  pages/       one file per route
  utils/       parsing, localStorage, JWT, Word export
```
