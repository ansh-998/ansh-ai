// src/components/Chat/ChatWindow.jsx
import { useEffect, useRef } from 'react'
import { Send, Bot, Sparkles } from 'lucide-react'
import MessageBubble from './MessageBubble.jsx'
import TypewriterIntro from './TypewriterIntro.jsx'
import { useChat } from '../../hooks/useChat.js'

// Animated typing indicator shown while AI is thinking
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
        <Bot size={12} className="text-emerald-400" />
      </div>
      <div className="bg-[#12121f] border-l-2 border-emerald-500 px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 typing-dot" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 typing-dot" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 typing-dot" />
        </div>
      </div>
    </div>
  )
}

export default function ChatWindow() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    showSuggestions,
    messagesLeft,
    isLimitReached,
    sendMessage,
    handleKeyDown,
  } = useChat()

  const bottomRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[#0a0a14] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
            <Bot size={13} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-slate-100 leading-none mb-0.5">Chat with Ansh AI</p>
            <p className="text-[11px] text-slate-500 leading-none">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        {/* Session counter */}
        <div className={`text-[11px] font-mono px-2 py-1 rounded-md border ${
          messagesLeft <= 3
            ? 'text-amber-400 border-amber-500/20 bg-amber-500/5'
            : 'text-slate-500 border-white/[0.06] bg-white/[0.03]'
        }`}>
          {messagesLeft} / 15 left
        </div>
      </div>

      {/* ── Messages ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {showSuggestions && <TypewriterIntro />}
        
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* ── Grid Suggestions (shown before first message) ────── */}
        {showSuggestions && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 max-w-[650px] mx-auto animate-slide-up select-none">
            {[
              {
                title: "Key Projects",
                desc: "Explore GenAI, Wanderlust, and SummarizeAI",
                prompt: "Tell me about Ansh's main projects."
              },
              {
                title: "Tech Stack",
                desc: "Review Frontend, Backend, Databases, and Tools",
                prompt: "What is Ansh's developer tech stack?"
              },
              {
                title: "Work Experience",
                desc: "Check his accomplishments at Decentralclasses",
                prompt: "Tell me about his internship experience."
              },
              {
                title: "Availability",
                desc: "Check active job hunt status and contact info",
                prompt: "Is Ansh currently open to roles?"
              }
            ].map((card) => (
              <button
                key={card.title}
                onClick={() => sendMessage(card.prompt)}
                className="text-left p-4 rounded-xl bg-[#0d0d1a] border border-white/[0.06] hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={11} className="text-[var(--accent)]" />
                  <p className="text-[13px] font-semibold text-slate-200">{card.title}</p>
                </div>
                <p className="text-[11.5px] text-slate-500 leading-tight">{card.desc}</p>
              </button>
            ))}
          </div>
        )}

        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ───────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-white/[0.06] bg-[#0a0a14] flex-shrink-0">
        {isLimitReached ? (
          <div className="text-center py-2 text-[12px] text-slate-500">
            Session limit reached.{' '}
            <a href="/contact" className="text-emerald-400 hover:underline">
              Get in touch directly
            </a>{' '}
            or open a new tab to reset.
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-[#12121f] border border-white/[0.08] rounded-xl px-4 py-2.5 focus-within:border-[var(--accent)]/40 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about Ansh…"
              disabled={isLoading}
              className="flex-1 bg-transparent text-[13.5px] text-slate-200 placeholder-slate-600 outline-none disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--accent-hover)] transition-colors flex-shrink-0"
            >
              <Send size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
