// src/pages/Contact.jsx
import { useState } from 'react'
import { Mail, Github, Linkedin, MapPin, Phone, Send, CheckCircle, FileDown } from 'lucide-react'
import { profile } from '../data/resume.js'

export default function Contact() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent]       = useState(false)

  const canSubmit = name.trim() && email.trim() && message.trim()

  const handleSubmit = () => {
    if (!canSubmit) return
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`)
    const body    = encodeURIComponent(`Hi Ansh,\n\n${message}\n\n— ${name}\n${email}`)
    window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`)
    setSent(true)
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
              <p className="text-[13px] text-slate-300 font-medium">Email client opened!</p>
              <p className="text-[12px] text-slate-500">
                Your default email app should have opened with the message pre-filled.
              </p>
              <button
                onClick={() => { setSent(false); setName(''); setEmail(''); setMessage('') }}
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
                  className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-[13px] text-slate-200 placeholder-slate-600 outline-none focus:border-[var(--accent)]/40 transition-colors w-full"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-[13px] text-slate-200 placeholder-slate-600 outline-none focus:border-[var(--accent)]/40 transition-colors w-full"
                />
              </div>
              <textarea
                placeholder="Your message…"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-[13px] text-slate-200 placeholder-slate-600 outline-none focus:border-[var(--accent)]/40 transition-colors resize-none"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white text-[13px] font-medium hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={12} />
                  Send via email
                </button>
                <p className="text-[11px] text-slate-600">Opens your email client pre-filled.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
