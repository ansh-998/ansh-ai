// src/components/UI/RevealWrapper.jsx
import { useScrollReveal } from '../../hooks/useScrollReveal.js'

export default function RevealWrapper({ children, delay = 0 }) {
  const [ref, revealed] = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`reveal-hidden ${revealed ? 'reveal-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
