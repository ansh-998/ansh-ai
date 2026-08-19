// src/components/Sidebar/MobileNav.jsx
import { NavLink } from 'react-router-dom'
import { MessageCircle, Code2, Zap, Mail, Palette } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme.js'

const NAV = [
  { to: '/',          icon: MessageCircle, label: 'Chat',     end: true },
  { to: '/projects',  icon: Code2,         label: 'Projects', end: false },
  { to: '/skills',    icon: Zap,           label: 'Skills',   end: false },
  { to: '/contact',   icon: Mail,          label: 'Contact',  end: false },
]

export default function MobileNav() {
  const { theme, setTheme, THEMES } = useTheme()

  const cycleTheme = () => {
    const idx = THEMES.indexOf(theme)
    const nextTheme = THEMES[(idx + 1) % THEMES.length]
    setTheme(nextTheme)
  }

  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-[#0c0c18]/95 backdrop-blur-md border-t border-white/[0.06] z-50 px-2 justify-around items-center safe-bottom">
      {NAV.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-all ${
              isActive
                ? 'text-[var(--accent)]'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={18} className={`mb-1 transition-transform ${isActive ? 'text-[var(--accent)] scale-105' : 'text-slate-400'}`} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}

      {/* Cycle Theme button for mobile */}
      <button
        onClick={cycleTheme}
        className="flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200"
        aria-label="Cycle theme accent"
      >
        <Palette size={18} className="mb-1 text-[var(--accent)] animate-pulse" />
        <span>Theme</span>
      </button>
    </nav>
  )
}
