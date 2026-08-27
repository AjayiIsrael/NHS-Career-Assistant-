// UTF-8 text that upstream re-encoded as Windows-1252 ("mojibake"). Sources are
// written as escape sequences so this file stays plain-ASCII and unambiguous.
// Longer sequences must come before their prefixes.
const MOJIBAKE = [
  ['â€™', '’'], // ’
  ['â€˜', '‘'], // ‘
  ['â€œ', '“'], // “
  ['â€', '”'], // ”
  ['â€”', '—'], // —
  ['â€“', '–'], // –
  ['â€¦', '…'], // …
  ['â€', '”'], // stray ”
  ['Â£', '£'], // £
  ['Â ', ' '], // non-breaking space
  ['Â', ''],
]

/**
 * Tidy text from the NHS feed: repair the common UTF-8 / Windows-1252 mojibake
 * in the upstream Reed data and decode HTML entities.
 */
export function cleanFeedText(input) {
  let s = String(input || '')
  for (const [from, to] of MOJIBAKE) s = s.split(from).join(to)
  if (typeof document !== 'undefined' && /&[a-z#0-9]+;/i.test(s)) {
    const el = document.createElement('textarea')
    el.innerHTML = s
    s = el.value
  }
  return s.replace(/\s+/g, ' ').trim()
}

/** Split a newline / bullet delimited LLM string into clean list items. */
export function toList(text) {
  if (!text) return []
  return String(text)
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-*•\d.)\]]+\s*/, '').trim())
    .filter((l) => l.length > 1)
}

const STATUS_MAP = [
  { re: /not\s*found|missing|no\s*evidence/i, key: 'NOT_FOUND' },
  { re: /partial|partly|some\s*evidence/i, key: 'PARTIAL' },
  { re: /covered|met|clear\s*evidence|strong/i, key: 'COVERED' },
]

export const STATUS_META = {
  COVERED: { label: 'Covered', pill: 'bg-nhs-green/12 text-nhs-green ring-1 ring-nhs-green/20', weight: 1 },
  PARTIAL: { label: 'Partially met', pill: 'bg-nhs-warm-yellow/15 text-[#9a6b00] ring-1 ring-nhs-warm-yellow/30', weight: 0.5 },
  NOT_FOUND: { label: 'Not found', pill: 'bg-nhs-red/10 text-nhs-red ring-1 ring-nhs-red/20', weight: 0 },
}

function classifyStatus(raw) {
  for (const { re, key } of STATUS_MAP) if (re.test(raw)) return key
  return 'PARTIAL'
}

/**
 * Parse the raw person-spec assessment text returned by the backend.
 * Expected loose format:
 *   CRITERION: ...
 *   STATUS: COVERED / PARTIALLY MET / NOT FOUND
 *   EVIDENCE: ...
 *   ...
 *   OVERALL MATCH: 50%
 */
export function parsePersonSpec(assessment) {
  const text = String(assessment || '')
  const criteria = []

  const blockRe = /CRITERION\s*:?\s*(.+?)\s*(?:\r?\n)+\s*STATUS\s*:?\s*(.+?)\s*(?:\r?\n)+\s*EVIDENCE\s*:?\s*([\s\S]*?)(?=\r?\n\s*CRITERION\s*:|\r?\n\s*OVERALL\s*MATCH|$)/gi
  let m
  while ((m = blockRe.exec(text)) !== null) {
    criteria.push({
      criterion: m[1].trim(),
      status: classifyStatus(m[2]),
      statusRaw: m[2].trim(),
      evidence: m[3].trim().replace(/\s*\n\s*/g, ' '),
    })
  }

  const pctMatch = text.match(/OVERALL\s*MATCH\s*:?\s*(\d{1,3})\s*%/i)
  let score = pctMatch ? Math.min(100, parseInt(pctMatch[1], 10)) : null

  if (score === null && criteria.length) {
    const total = criteria.reduce((s, c) => s + STATUS_META[c.status].weight, 0)
    score = Math.round((total / criteria.length) * 100)
  }

  return {
    criteria,
    score: score ?? 0,
    hadStructure: criteria.length > 0,
    raw: text,
  }
}
