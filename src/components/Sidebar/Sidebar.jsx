// src/components/Sidebar/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { MessageCircle, Code2, Zap, Mail, Github, Linkedin, FileDown } from 'lucide-react'
import { profile } from '../../data/resume.js'
import ThemeSelector from '../UI/ThemeSelector.jsx'

const NAV = [
  { to: '/',          icon: MessageCircle, label: 'Chat',     end: true },
  { to: '/projects',  icon: Code2,         label: 'Projects', end: false },
  { to: '/skills',    icon: Zap,           label: 'Skills',   end: false },
  { to: '/contact',   icon: Mail,          label: 'Contact',  end: false },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-[220px] flex-shrink-0 flex-col h-full bg-[#0c0c18] border-r border-white/[0.06]">

      {/* ── Profile ─────────────────────────────────────────────── */}
      <div className="p-5 border-b border-white/[0.06]">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-[rgba(var(--accent-rgb),0.1)] border border-[rgba(var(--accent-rgb),0.2)] flex items-center justify-center mb-4">
          <span className="text-[var(--accent)] font-mono font-semibold text-[13px]">AG</span>
        </div>

        <h1 className="text-[14px] font-semibold text-slate-100 leading-tight mb-0.5">
          {profile.name}
        </h1>
        <p className="text-[11.5px] text-slate-400 mb-3">{profile.title}</p>

        {/* AI active badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] pulse-glow" />
            <span className="text-[11px] text-[var(--accent)] font-mono tracking-wide">AI active</span>
          </div>
        </div>

        {/* Download Resume Button */}
        <a
          href="/ansh_cv.pdf"
          download="Ansh_Gangwar_CV.pdf"
          className="flex items-center justify-center gap-2 w-full mt-4 py-2 px-3 rounded-lg bg-[rgba(var(--accent-rgb),0.06)] border border-[rgba(var(--accent-rgb),0.15)] text-[var(--accent)] hover:bg-[rgba(var(--accent-rgb),0.12)] hover:border-[rgba(var(--accent-rgb),0.3)] text-[12px] font-semibold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
        >
          <FileDown size={13} />
          <span>Download CV</span>
        </a>
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                isActive
                  ? 'bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)] border border-[rgba(var(--accent-rgb),0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={14} className={isActive ? 'text-[var(--accent)]' : ''} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Social links ────────────────────────────────────────── */}
      <div className="p-4 border-t border-white/[0.06] space-y-4">
        <ThemeSelector />
        <div className="pt-3 border-t border-white/[0.04]">
          <p className="text-[11px] text-slate-600 mb-3">{profile.location}</p>
          <div className="flex items-center gap-2">
          {[
            { href: profile.github,           icon: Github,   label: 'GitHub' },
            { href: profile.linkedin,         icon: Linkedin, label: 'LinkedIn' },
            { href: `mailto:${profile.email}`, icon: Mail,     label: 'Email' },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
              aria-label={label}
              className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] transition-all"
            >
              <Icon size={13} />
            </a>
          ))}
        </div>
      </div>
      </div>
    </aside>
  )
}
