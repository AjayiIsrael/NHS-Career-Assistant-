import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const TOKEN_KEY = 'nhs_token'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  // AI generation endpoints can take 1–3 minutes.
  timeout: 240000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      // Let the AuthContext-guarded routes handle the redirect on next render.
      if (!window.location.pathname.startsWith('/login')) {
        window.dispatchEvent(new CustomEvent('nhs:unauthorised'))
      }
    }
    return Promise.reject(error)
  },
)

/** Turn any axios/backend error into a friendly, human string. */
export function friendlyError(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.code === 'ECONNABORTED') {
    return 'That request timed out. The AI can take a couple of minutes — please try again.'
  }
  if (error?.message === 'Network Error') {
    return 'Cannot reach the server. Make sure the backend is running at ' + baseURL + '.'
  }
  const detail = error?.response?.data?.detail
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg || d).join(' · ')
  }
  if (typeof detail === 'string') return detail
  return fallback
}

export { baseURL }
export default api
