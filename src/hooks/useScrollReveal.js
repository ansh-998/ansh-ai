// src/hooks/useScrollReveal.js
import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(threshold = 0.05) {
  const [revealed, setRevealed] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.unobserve(currentRef) // Only reveal once
        }
      },
      { threshold }
    )

    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  return [ref, revealed]
}
