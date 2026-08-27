/** Small namespaced localStorage helpers with JSON + error safety. */
function key(k) {
  return `nhs_${k}`
}

export function loadJSON(k, fallback) {
  try {
    const raw = localStorage.getItem(key(k))
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveJSON(k, value) {
  try {
    localStorage.setItem(key(k), JSON.stringify(value))
  } catch {
    /* quota / private mode — ignore */
  }
}

export function remove(k) {
  try {
    localStorage.removeItem(key(k))
  } catch {
    /* ignore */
  }
}
