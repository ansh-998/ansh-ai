// src/components/UI/ProjectCard.jsx
import { useRef } from 'react'
import { ExternalLink, Github, Star } from 'lucide-react'

export default function ProjectCard({ project }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty('--mouse-x', `${x}px`)
    cardRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`glow-card bg-[#0d0d1a] border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1.5 ${
        project.highlight
          ? 'border-[var(--accent)]/30 shadow-[0_10px_35px_rgba(var(--accent-rgb),0.06)]'
          : 'border-white/[0.07] hover:border-[var(--accent)]/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]'
      }`}
    >
      {/* Dynamic hover glow overlay */}
      <div className="glow-overlay" />

      {/* Featured badge */}
      {project.highlight && (
        <div className="flex items-center gap-1.5 z-10">
          <Star size={10} className="text-[var(--accent)] fill-[var(--accent)]" />
          <span className="text-[10px] font-semibold text-[var(--accent)] tracking-widest uppercase">
            Featured project
          </span>
        </div>
      )}

      {/* Title + description */}
      <div className="z-10">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="text-[15px] font-semibold text-slate-100">{project.name}</h3>
        </div>
        <p className="text-[12px] font-medium text-[var(--accent)] mb-2">{project.tagline}</p>
        <p className="text-[13px] text-slate-400 leading-relaxed">{project.description}</p>
      </div>

      {/* Tech stack tags */}
      <div className="flex flex-wrap gap-1.5 z-10">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.07] text-slate-400 font-mono"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Links */}
      {(project.live || project.github) && (
        <div className="flex items-center gap-2 pt-1 mt-auto border-t border-white/[0.05] z-10">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20 transition-all"
            >
              <ExternalLink size={11} />
              Live demo
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg bg-white/[0.05] text-slate-400 border border-white/[0.08] hover:text-slate-200 hover:bg-white/[0.08] transition-all"
            >
              <Github size={11} />
              Source
            </a>
          )}
        </div>
      )}
    </div>
  )
}
