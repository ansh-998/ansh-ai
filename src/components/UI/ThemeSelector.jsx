// src/components/UI/ThemeSelector.jsx
import { useTheme } from '../../hooks/useTheme.js'

export default function ThemeSelector({ compact = false }) {
  const { theme, setTheme, THEMES } = useTheme()

  const colors = {
    emerald: 'bg-emerald-500 ring-emerald-500/20',
    sapphire: 'bg-blue-500 ring-blue-500/20',
    amethyst: 'bg-purple-500 ring-purple-500/20',
  }

  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3 justify-between'}`}>
      {!compact && <span className="text-[11px] text-slate-500 font-medium">Theme Accent</span>}
      <div className="flex gap-2">
        {THEMES.map((t) => {
          const isActive = theme === t
          return (
            <button
              key={t}
              onClick={() => setTheme(t)}
              aria-label={`Switch to ${t} theme`}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${colors[t]} ${
                isActive
                  ? 'ring-4 scale-110 shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)]'
                  : 'hover:scale-105 opacity-60 hover:opacity-100'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
