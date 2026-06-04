import { useState } from 'react'
import { Icon } from '@iconify/react'

const WAITLIST_URL = 'https://forms.gle/9zS6uNDvP1udzYqJ8'

export default function Navbar({ onLogoClick }: { onLogoClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const scrollTo = (id: string) => {
    closeMenu()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <nav className="nav-glass fixed top-0 left-0 right-0 z-50" role="navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button onClick={onLogoClick} className="flex items-center gap-2.5 anim-in" aria-label="Home">
              <img
                src={`${import.meta.env.BASE_URL}images/pariverse-logo.png`}
                alt="Pariverse logo"
                className="w-10 h-10 rounded-xl object-cover shadow-md"
              />
              <div className="flex flex-col leading-tight">
                <span style={{ fontFamily: "'Oswald', sans-serif" }} className="text-lg font-medium tracking-wide text-[#2C1810]">Mummaverse</span>
                <span className="text-[9px] uppercase tracking-[.15em] text-[#8B7355] hidden sm:block">Presents Pariverse</span>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-8 anim-in-d1">
              {[['problem','Why Pariverse'],['features','Features'],['village','The Village'],['blog','Blog'],['faq','FAQ']].map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)} className="text-[15px] text-[#6b5c50] hover:text-[#2C1810] transition-colors font-medium">{label}</button>
              ))}
            </div>

            <div className="flex items-center gap-3 anim-in-d2">
              <a href={WAITLIST_URL} target="_blank" rel="noreferrer" className="hidden sm:inline-flex btn-primary text-[15px] font-semibold px-5 py-2.5 rounded-xl">
                Join Waitlist
              </a>
              <button className="md:hidden text-[#2C1810] p-2" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
                <Icon icon={menuOpen ? 'ph:x-bold' : 'ph:list-bold'} className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu fixed inset-0 z-40 bg-white/80/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 ${menuOpen ? 'open' : ''}`} role="dialog">
        {[['problem','Why Pariverse'],['features','Features'],['village','The Village'],['blog','Blog'],['faq','FAQ']].map(([id, label]) => (
          <button key={id} onClick={() => scrollTo(id)} style={{ fontFamily: "'Oswald', sans-serif" }} className="text-2xl font-medium uppercase tracking-wider text-[#2C1810] hover:text-[#E8600C] transition-colors">
            {label}
          </button>
        ))}
        <a href={WAITLIST_URL} target="_blank" rel="noreferrer" onClick={closeMenu} className="btn-primary text-[15px] font-semibold px-8 py-3 rounded-xl mt-4 flex items-center justify-center">
          Join Waitlist
        </a>
      </div>
    </>
  )
}
