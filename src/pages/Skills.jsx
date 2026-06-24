// src/pages/Skills.jsx
import { Zap } from 'lucide-react'
import { skills, experience, education } from '../data/resume.js'
import SkillBadge from '../components/UI/SkillBadge.jsx'
import RevealWrapper from '../components/UI/RevealWrapper.jsx'

const SKILL_SECTIONS = [
  { label: 'Frontend',  key: 'frontend',  accent: 'text-blue-400',   dot: 'bg-blue-400'   },
  { label: 'Backend',   key: 'backend',   accent: 'text-accent',      dot: 'bg-accent'      },
  { label: 'Database',  key: 'database',  accent: 'text-violet-400',  dot: 'bg-violet-400'  },
  { label: 'Tools',     key: 'tools',     accent: 'text-amber-400',   dot: 'bg-amber-400'   },
  { label: 'Concepts',  key: 'concepts',  accent: 'text-rose-400',    dot: 'bg-rose-400'    },
]

export default function Skills() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Header */}
        <RevealWrapper>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[rgba(var(--accent-rgb),0.1)] border border-accent-glow flex items-center justify-center">
              <Zap size={15} className="text-accent" />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-gradient-animated leading-none mb-1">Skills</h1>
              <p className="text-[12px] text-slate-500">Full stack + AI integrations</p>
            </div>
          </div>
        </RevealWrapper>

        {/* Skill groups */}
        <div className="space-y-3 mb-8">
          {SKILL_SECTIONS.map(({ label, key, accent, dot }, index) => (
            <RevealWrapper key={key} delay={index * 60}>
              <div className="bg-[#0d0d1a] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.12] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${dot === 'bg-accent' ? 'bg-[var(--accent)]' : dot}`} />
                  <h2 className={`text-[11px] font-semibold uppercase tracking-wider ${accent}`}>
                    {label}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills[key].map((skill) => (
                    <SkillBadge key={skill} skill={skill} />
                  ))}
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>

        {/* Experience */}
        <RevealWrapper>
          <h2 className="text-[13px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Experience</h2>
        </RevealWrapper>
        <div className="space-y-3 mb-8">
          {experience.map((exp, i) => (
            <RevealWrapper key={i} delay={i * 80}>
              <div className="bg-[#0d0d1a] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.12] transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-[14px] font-semibold text-slate-100">{exp.role}</p>
                    <p className="text-[12px] text-accent font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] text-slate-500 font-mono">{exp.period}</p>
                    <p className="text-[11px] text-slate-600">{exp.type}</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {exp.points.map((pt, j) => (
                    <li key={j} className="flex items-start gap-2 text-[12.5px] text-slate-400">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--accent)] opacity-60 flex-shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealWrapper>
          ))}
        </div>

        {/* Education */}
        <RevealWrapper>
          <h2 className="text-[13px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Education</h2>
        </RevealWrapper>
        <div className="space-y-3">
          {education.map((edu, i) => (
            <RevealWrapper key={i} delay={i * 80}>
              <div className="bg-[#0d0d1a] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.12] transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[13.5px] font-semibold text-slate-100">{edu.degree}</p>
                    <p className="text-[12px] text-slate-400 mt-0.5">{edu.institution}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{edu.location}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[12px] font-semibold text-accent">{edu.grade}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{edu.period}</p>
                  </div>
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>

      </div>
    </div>
  )
}
