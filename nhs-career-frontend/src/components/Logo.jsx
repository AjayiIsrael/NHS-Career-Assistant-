import { Link } from 'react-router-dom'

export default function Logo({ to = '/', light = false, className = '' }) {
  const Wrapper = to ? Link : 'div'
  return (
    <Wrapper to={to} className={`group flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-14 items-center justify-center rounded-md bg-nhs-blue font-extrabold italic tracking-tighter text-white shadow-sm">
        NHS
      </span>
      <span
        className={`text-[15px] font-bold leading-tight ${
          light ? 'text-white' : 'text-nhs-dark-blue'
        }`}
      >
        Career<span className="font-semibold text-nhs-bright-blue">Assistant</span>
      </span>
    </Wrapper>
  )
}
