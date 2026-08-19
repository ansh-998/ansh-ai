// src/hooks/useTheme.js
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'ansh_portfolio_theme'
const THEMES = ['emerald', 'sapphire', 'amethyst']

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return THEMES.includes(saved) ? saved : 'emerald'
  })

  useEffect(() => {
    const root = document.documentElement
    // Remove other theme classes
    root.classList.remove('theme-emerald', 'theme-sapphire', 'theme-amethyst')
    
    // Add current theme class
    if (theme !== 'emerald') {
      root.classList.add(`theme-${theme}`)
    }
    
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return { theme, setTheme, THEMES }
}
