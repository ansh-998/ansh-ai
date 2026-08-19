// src/pages/Projects.jsx
import { useEffect, useState } from 'react'
import { Code2 } from 'lucide-react'
import { projects } from '../data/resume.js'
import ProjectCard from '../components/UI/ProjectCard.jsx'
import RevealWrapper from '../components/UI/RevealWrapper.jsx'

export default function Projects() {
  const [highlightedId, setHighlightedId] = useState(null)

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const id = hash.replace('#', '').toLowerCase()
      setHighlightedId(id)

      // Scroll to element after a short delay for mount
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 400)

      const timer = setTimeout(() => {
        setHighlightedId(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Header */}
        <RevealWrapper>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[rgba(var(--accent-rgb),0.1)] border border-accent-glow flex items-center justify-center">
              <Code2 size={15} className="text-accent" />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-gradient-animated leading-none mb-1">Projects</h1>
              <p className="text-[12px] text-slate-500">{projects.length} projects built</p>
            </div>
          </div>
        </RevealWrapper>

        {/* Cards */}
        <div className="grid gap-4">
          {projects.map((project, index) => (
            <RevealWrapper key={project.id} delay={index * 80}>
              <div 
                id={project.id.toLowerCase()} 
                className={`rounded-2xl transition-all duration-500 ${
                  highlightedId === project.id.toLowerCase()
                    ? 'ring-2 ring-[var(--accent)] ring-offset-4 ring-offset-[#080810] scale-[1.02] shadow-[0_0_40px_rgba(var(--accent-rgb),0.2)]'
                    : ''
                }`}
              >
                <ProjectCard project={project} />
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </div>
  )
}
