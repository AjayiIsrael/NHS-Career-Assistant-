import { useEffect, useState } from 'react'

export default function CircularProgress({ value = 0, size = 160, stroke = 14, label }) {
  const [shown, setShown] = useState(0)
  const pct = Math.max(0, Math.min(100, value))

  useEffect(() => {
    let raf
    const start = performance.now()
    const from = shown
    const dur = 900
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(Math.round(from + (pct - from) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct])

  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (shown / 100) * c
  const colour = pct >= 70 ? '#009639' : pct >= 40 ? '#FFB81C' : '#DA291C'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#E8EDEE" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colour}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke 0.3s' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-nhs-dark-blue">{shown}%</span>
        {label && <span className="mt-0.5 text-xs font-medium text-nhs-mid-grey">{label}</span>}
      </div>
    </div>
  )
}
