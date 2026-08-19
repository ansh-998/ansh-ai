// src/components/Chat/MessageBubble.jsx
import { Bot, User, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// A lightweight markdown-to-React parser to render bold, lists, code blocks, and action buttons beautifully
function formatMessageContent(text, handleActionClick) {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []
  
  const parseInline = (str) => {
    const parts = []
    let lastIndex = 0
    // Group 2: bold, Group 3: code, Group 4: actionType, Group 5: actionId
    const inlineRegex = /(\*\*(.*?)\*\*|`(.*?)`|\[(view|nav):([a-zA-Z0-9_-]+)\])/g
    let match
    
    while ((match = inlineRegex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index))
      }
      
      const fullMatch = match[1]
      
      if (fullMatch.startsWith('**')) {
        const boldText = match[2]
        parts.push(
          <strong key={match.index} className="font-semibold text-slate-100">
            {boldText}
          </strong>
        )
      } else if (fullMatch.startsWith('`')) {
        const codeText = match[3]
        parts.push(
          <code key={match.index} className="px-1.5 py-0.5 rounded bg-white/[0.08] text-[var(--accent)] font-mono text-[11px] border border-white/[0.04]">
            {codeText}
          </code>
        )
      } else if (fullMatch.startsWith('[')) {
        const actionType = match[4]
        const actionId = match[5]
        const label = actionType === 'view' 
          ? `View ${actionId.toUpperCase()}` 
          : `Go to ${actionId.toUpperCase()}`
        
        parts.push(
          <button
            key={match.index}
            onClick={() => handleActionClick(actionType, actionId)}
            className="inline-flex items-center gap-1 mx-1.5 px-2.5 py-1 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)]/25 text-[11.5px] font-semibold transition-all duration-150 align-middle shadow-[0_2px_8px_rgba(var(--accent-rgb),0.15)]"
          >
            <Sparkles size={10} />
            {label}
          </button>
        )
      }
      
      lastIndex = inlineRegex.lastIndex
    }
    
    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex))
    }
    
    return parts.length > 0 ? parts : str
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    
    if (!trimmed) {
      // Empty line spacing
      elements.push(<div key={`space-${i}`} className="h-2" />)
      continue
    }

    const bulletMatch = line.match(/^(\s*)([-*•]|\d+\.)\s+(.*)/)
    
    if (bulletMatch) {
      const indent = bulletMatch[1].length
      const marker = bulletMatch[2]
      const rest = bulletMatch[3]
      const isNumbered = /^\d+\./.test(marker)
      
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 my-1" style={{ paddingLeft: `${indent * 8}px` }}>
          <span className="text-[var(--accent)] font-bold select-none mt-0.5 text-[11px] flex-shrink-0">
            {isNumbered ? marker : '•'}
          </span>
          <span className="flex-1 text-[13px]">{parseInline(rest)}</span>
        </div>
      )
    } else {
      elements.push(
        <p key={`p-${i}`} className="mb-1.5 last:mb-0 text-[13px]">
          {parseInline(line)}
        </p>
      )
    }
  }

  return elements
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const navigate = useNavigate()

  const handleActionClick = (type, id) => {
    if (type === 'nav') {
      const path = id === 'home' || id === 'chat' ? '/' : `/${id}`
      navigate(path)
    } else if (type === 'view') {
      navigate(`/projects#${id}`)
    }
  }

  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="flex items-end gap-2.5 max-w-[78%]">
          <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-[13px] leading-relaxed">
            {message.content}
          </div>
          <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <User size={12} className="text-indigo-400" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2.5 animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-[rgba(var(--accent-rgb),0.1)] border border-[rgba(var(--accent-rgb),0.2)] flex items-center justify-center flex-shrink-0">
        <Bot size={12} className="text-[var(--accent)]" />
      </div>
      <div
        className={`max-w-[78%] bg-[#12121f] border-l-2 px-4 py-2.5 rounded-2xl rounded-bl-sm text-[13px] leading-relaxed text-slate-200 ${
          message.isError ? 'border-amber-400 text-amber-200/90' : 'border-[var(--accent)]'
        }`}
      >
        {formatMessageContent(message.content, handleActionClick)}
      </div>
    </div>
  )
}
