// src/components/UI/SkillBadge.jsx
export default function SkillBadge({ skill }) {
  return (
    <span className="inline-block text-[12px] px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-slate-300 font-mono hover:bg-[rgba(var(--accent-rgb),0.08)] hover:border-[rgba(var(--accent-rgb),0.2)] hover:text-[var(--accent-hover)] transition-all cursor-default">
      {skill}
    </span>
  )
}
