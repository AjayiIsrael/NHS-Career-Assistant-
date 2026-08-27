export function TextField({ label, hint, error, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="nhs-label">{label}</span>}
      <input className="nhs-input" {...props} />
      {hint && !error && <span className="mt-1 block text-xs text-nhs-mid-grey">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-nhs-red">{error}</span>}
    </label>
  )
}

export function TextArea({ label, hint, rows = 8, className = '', value, ...props }) {
  const count = (value || '').trim().split(/\s+/).filter(Boolean).length
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="nhs-label flex items-center justify-between">
          <span>{label}</span>
          <span className="text-xs font-normal text-nhs-mid-grey">{count} words</span>
        </span>
      )}
      <textarea
        rows={rows}
        value={value}
        className="nhs-input scroll-slim resize-y leading-relaxed"
        {...props}
      />
      {hint && <span className="mt-1 block text-xs text-nhs-mid-grey">{hint}</span>}
    </label>
  )
}
