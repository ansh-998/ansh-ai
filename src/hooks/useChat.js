// src/hooks/useChat.js
import { useState, useCallback } from 'react'

const SESSION_KEY = 'ansh_chat_count'
const MESSAGE_LIMIT = 15

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm Ansh's AI assistant — I know everything about his projects, skills, and experience. Ask me anything! For example: what has he built with AI, or what's his tech stack?",
  timestamp: Date.now(),
}

export const SUGGESTIONS = [
  "What projects has Ansh built?",
  "What's his tech stack?",
  "Tell me about his experience",
  "Is he open to opportunities?",
]

export function useChat() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)

  // Track count in state so UI reactively updates
  const [messageCount, setMessageCount] = useState(() =>
    parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10)
  )

  const messagesLeft = Math.max(0, MESSAGE_LIMIT - messageCount)
  const isLimitReached = messageCount >= MESSAGE_LIMIT

  const sendMessage = useCallback(
    async (text) => {
      const messageText = (text || input).trim()
      if (!messageText || isLoading || isLimitReached) return

      setShowSuggestions(false)

      const userMsg = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMsg])
      setInput('')
      setIsLoading(true)

      // Build history — skip the static welcome message
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }))

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageText, history }),
        })

        const data = await res.json()

        if (!res.ok || data.error) {
          throw new Error(data.error || 'Something went wrong')
        }

        const aiMsg = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, aiMsg])

        // Increment persistent session counter
        const next = messageCount + 1
        setMessageCount(next)
        sessionStorage.setItem(SESSION_KEY, String(next))
      } catch (err) {
        const errMsg = {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content:
            err.message ||
            "Sorry, I'm having trouble right now. Try again in a moment, or explore the Projects and Skills pages!",
          timestamp: Date.now(),
          isError: true,
        }
        setMessages((prev) => [...prev, errMsg])
      } finally {
        setIsLoading(false)
      }
    },
    [input, isLoading, isLimitReached, messages, messageCount]
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage]
  )

  return {
    messages,
    input,
    setInput,
    isLoading,
    showSuggestions,
    messagesLeft,
    isLimitReached,
    sendMessage,
    handleKeyDown,
  }
}
