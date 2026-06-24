// src/pages/Contact.jsx
import { useState } from 'react'
import { Mail, Github, Linkedin, MapPin, Phone, Send, CheckCircle, FileDown } from 'lucide-react'
import { profile } from '../data/resume.js'

export default function Contact() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const canSubmit = name.trim() && email.trim() && isEmailValid && message.trim()

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }
      
      setSent(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[rgba(var(--accent-rgb),0.1)] border border-[rgba(var(--accent-rgb),0.2)] flex items-center justify-center">
            <Mail size={15} className="text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-[18px] font-semibold text-slate-100 leading-none mb-1">Contact</h1>
            <p className="text-[12px] text-slate-500">Let's connect</p>
          </div>
        </div>

        {/* Top row: links + availability */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-4">

          {/* Direct contact info */}
          <div className="bg-[#0d0d1a] border border-white/[0.07] rounded-2xl p-5 space-y-3">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                <Mail size={12} />
              </div>
              <span className="text-[12px] break-all">{profile.email}</span>
            </a>
            <a
              href={`tel:${profile.phone}`}
              className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                <Phone size={12} />
              </div>
              <span className="text-[12px]">{profile.phone}</span>
            </a>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                <MapPin size={12} />
              </div>
              <span className="text-[12px]">{profile.location}</span>
            </div>
            <div className="pt-1 flex gap-2">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] transition-all"
              >
                <Github size={11} /> GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] transition-all"
              >
                <Linkedin size={11} /> LinkedIn
              </a>
            </div>
          </div>

          {/* Availability card */}
          <div className="bg-[rgba(var(--accent-rgb),0.05)] border border-[rgba(var(--accent-rgb),0.2)] rounded-2xl p-5 flex flex-col justify-center gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] pulse-glow" />
                <span className="text-[12px] font-medium text-[var(--accent)]">Open to opportunities</span>
              </div>
              <p className="text-[12.5px] text-slate-400 leading-relaxed">
                Actively looking for Full Stack Developer roles — full-time, freelance, or internships.
                Happy to discuss any opportunity.
              </p>
            </div>
            <a
              href="/ansh_cv.pdf"
              download="Ansh_Gangwar_CV.pdf"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-[rgba(var(--accent-rgb),0.06)] border border-[rgba(var(--accent-rgb),0.15)] text-[var(--accent)] hover:bg-[rgba(var(--accent-rgb),0.12)] hover:border-[rgba(var(--accent-rgb),0.3)] text-[12px] font-semibold transition-all"
            >
              <FileDown size={13} />
              <span>Download CV PDF</span>
            </a>
          </div>
        </div>

        {/* Message form */}
        <div className="bg-[#0d0d1a] border border-white/[0.07] rounded-2xl p-5">
          <h2 className="text-[13px] font-medium text-slate-300 mb-4">Send a message</h2>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
              <CheckCircle size={28} className="text-[var(--accent)]" />
              <p className="text-[13px] text-slate-300 font-medium">Message sent successfully!</p>
              <p className="text-[12px] text-slate-500">
                Thanks for reaching out, Ansh will get back to you shortly.
              </p>
              <button
                onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); setError('') }}
                className="text-[12px] text-[var(--accent)] hover:underline mt-1"
              >
                Send another
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-[13px] text-slate-200 placeholder-slate-600 outline-none focus:border-[var(--accent)]/40 transition-colors w-full disabled:opacity-50"
                />
                <div className="w-full">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className={`bg-white/[0.04] border ${email.trim() && !isEmailValid ? 'border-red-400/50 focus:border-red-400/50' : 'border-white/[0.08] focus:border-[var(--accent)]/40'} rounded-lg px-3.5 py-2.5 text-[13px] text-slate-200 placeholder-slate-600 outline-none transition-colors w-full disabled:opacity-50`}
                  />
                  {email.trim() && !isEmailValid && (
                    <p className="text-red-400 text-[10px] mt-1.5 ml-1">Please enter a valid email address</p>
                  )}
                </div>
              </div>
              <textarea
                placeholder="Your message…"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-[13px] text-slate-200 placeholder-slate-600 outline-none focus:border-[var(--accent)]/40 transition-colors resize-none disabled:opacity-50"
              />
              
              {error && <p className="text-red-400 text-[12px]">{error}</p>}
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || loading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white text-[13px] font-medium hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={12} className={loading ? 'opacity-50' : ''} />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                <p className="text-[11px] text-slate-600">Sends directly to Ansh's inbox.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
