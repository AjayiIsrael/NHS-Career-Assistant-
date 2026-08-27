/** Decode a JWT payload without verifying the signature (client-side display only). */
export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch {
    return null
  }
}

export function isExpired(token) {
  const data = decodeJwt(token)
  if (!data?.exp) return false
  return Date.now() >= data.exp * 1000
}
