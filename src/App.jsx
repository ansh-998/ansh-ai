import { Routes, Route } from 'react-router-dom'
import Sidebar   from './components/Sidebar/Sidebar.jsx'
import MobileNav from './components/Sidebar/MobileNav.jsx'
import Home      from './pages/Home.jsx'
import Projects  from './pages/Projects.jsx'
import Skills    from './pages/Skills.jsx'
import Contact   from './pages/Contact.jsx'
import ParticlesBackground from './components/UI/ParticlesBackground.jsx'

export default function App() {
  return (
    <div className="flex h-screen bg-[#080810] overflow-hidden relative">
      <ParticlesBackground />
      <div className="flex w-full h-full z-10 relative">
        <Sidebar />
        <main className="flex-1 overflow-hidden flex flex-col min-w-0 pb-[64px] md:pb-0">
          <Routes>
            <Route path="/"          element={<Home />}     />
            <Route path="/projects"  element={<Projects />} />
            <Route path="/skills"    element={<Skills />}   />
            <Route path="/contact"   element={<Contact />}  />
          </Routes>
        </main>
        <MobileNav />
      </div>
    </div>
  )
}

