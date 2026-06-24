// src/components/Chat/TypewriterIntro.jsx
import { useState, useEffect } from 'react'

const PHRASES = [
  'Full Stack Developer.',
  'MERN Stack Specialist.',
  'AI Integrations Builder.',
  'Problem Solver.'
]

export default function TypewriterIntro() {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timer
    const activePhrase = PHRASES[phraseIdx]

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(activePhrase.substring(0, displayText.length - 1))
      }, 35)
    } else {
      timer = setTimeout(() => {
        setDisplayText(activePhrase.substring(0, displayText.length + 1))
      }, 75)
    }

    if (!isDeleting && displayText === activePhrase) {
      timer = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setPhraseIdx((prev) => (prev + 1) % PHRASES.length)
    }

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, phraseIdx])

  return (
    <div className="flex flex-col items-center justify-center text-center py-6 px-4 select-none">
      <h2 className="text-[24px] font-bold text-slate-100 mb-2 leading-tight">
        Hi, I'm <span className="text-gradient-animated">Ansh Gangwar</span>
      </h2>
      <p className="text-[14px] text-slate-400 font-medium h-[24px] flex items-center justify-center gap-1">
        <span>I am a </span>
        <span className="text-[var(--accent)] font-semibold">{displayText}</span>
        <span className="w-[2px] h-[14px] bg-[var(--accent)] animate-pulse" />
      </p>
    </div>
  )
}
