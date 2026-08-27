import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  GitCompareArrows,
  ListChecks,
  UserRound,
  LogOut,
} from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/jobs', label: 'Job Feed', icon: Briefcase },
  { to: '/statement', label: 'Supporting Statement', icon: FileText },
  { to: '/career-gap', label: 'Career Gap Analyser', icon: GitCompareArrows },
  { to: '/person-spec', label: 'Person Spec Matcher', icon: ListChecks },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

function itemClass({ isActive }) {
  return [
    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
    isActive
      ? 'bg-nhs-blue text-white shadow-[0_8px_20px_-8px_rgba(0,94,184,0.7)]'
      : 'text-nhs-dark-grey hover:bg-nhs-blue/8 hover:text-nhs-dark-blue',
  ].join(' ')
}

export default function Sidebar({ onNavigate }) {
  const { logout } = useAuth()

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="px-2 py-3">
        <Logo to="/dashboard" />
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={itemClass} onClick={onNavigate}>
            {({ isActive }) => (
              <>
                <Icon
                  className={`h-[18px] w-[18px] ${
                    isActive ? 'text-white' : 'text-nhs-mid-grey group-hover:text-nhs-blue'
                  }`}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => {
          onNavigate?.()
          logout()
        }}
        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-nhs-dark-grey transition-all hover:bg-nhs-red/10 hover:text-nhs-red"
      >
        <LogOut className="h-[18px] w-[18px] text-nhs-mid-grey group-hover:text-nhs-red" />
        Sign out
      </button>
    </div>
  )
}
