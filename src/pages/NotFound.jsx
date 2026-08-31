// src/pages/NotFound.jsx
import { Link } from 'react-router-dom'
import { AlertCircle, Home, Code2 } from 'lucide-react'
import RevealWrapper from '../components/UI/RevealWrapper.jsx'

export default function NotFound() {
  return (
    <div className="h-full overflow-y-auto flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 py-12 text-center">
        <RevealWrapper>
          <div className="w-12 h-12 rounded-2xl bg-[rgba(var(--accent-rgb),0.1)] border border-[rgba(var(--accent-rgb),0.2)] flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={24} className="text-[var(--accent)]" />
          </div>

          <h1 className="text-[32px] font-bold text-slate-100 mb-2 font-mono">404</h1>
          <h2 className="text-[16px] font-semibold text-slate-200 mb-3">Page Not Found</h2>
          <p className="text-[13px] text-slate-400 mb-6 leading-relaxed">
            The page you are looking for doesn't exist or has been moved. You can head back home to chat with Ansh's AI or explore his projects.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-all shadow-[0_4px_14px_rgba(var(--accent-rgb),0.25)]"
            >
              <Home size={14} />
              <span>Back to Chat</span>
            </Link>

            <Link
              to="/projects"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 text-[13px] font-medium hover:bg-white/[0.08] hover:text-slate-100 transition-all"
            >
              <Code2 size={14} />
              <span>View Projects</span>
            </Link>
          </div>
        </RevealWrapper>
      </div>
    </div>
  )
}
