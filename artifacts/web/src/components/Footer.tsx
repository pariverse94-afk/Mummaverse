import { Icon } from '@iconify/react'

export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <footer className="relative border-t border-[#8B7355]/10 bg-[#F7EDE4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Icon icon="ph:planet-bold" className="text-white text-lg" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-medium tracking-wide text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>Mummaverse</span>
                <span className="text-[9px] uppercase tracking-[.15em] text-[#8B7355]">Apps for Indian moms</span>
              </div>
            </div>
            <p className="text-[14px] text-[#9c8b7e] leading-relaxed max-w-xs">Building a suite of apps for urban Indian moms. Pariverse is our first product.</p>
          </div>

          <nav>
            <h4 className="text-[12px] uppercase tracking-widest text-[#8B7355] mb-4">Pariverse</h4>
            <ul className="space-y-2.5">
              {['Meal Planning','Nutrition','First Aid','Community'].map(item => (
                <li key={item}><button onClick={() => scrollTo('features')} className="text-[15px] text-[#6b5c50] hover:text-[#2C1810] transition-colors">{item}</button></li>
              ))}
            </ul>
          </nav>

          <nav>
            <h4 className="text-[12px] uppercase tracking-widest text-[#8B7355] mb-4">Ecosystem</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => scrollTo('features')} className="text-[15px] text-[#6b5c50] hover:text-[#2C1810] transition-colors">Pariverse</button></li>
              <li><span className="text-[15px] text-[#9c8b7e]">Eduverse - Soon</span></li>
              <li><span className="text-[15px] text-[#9c8b7e]">Selfverse - Soon</span></li>
              <li><button onClick={() => scrollTo('blog')} className="text-[15px] text-[#6b5c50] hover:text-[#2C1810] transition-colors">Blog</button></li>
            </ul>
          </nav>

          <nav>
            <h4 className="text-[12px] uppercase tracking-widest text-[#8B7355] mb-4">Company</h4>
            <ul className="space-y-2.5">
              {['About','Privacy','Contact'].map(item => (
                <li key={item}><a href="#" className="text-[15px] text-[#6b5c50] hover:text-[#2C1810] transition-colors">{item}</a></li>
              ))}
              <li><button onClick={() => scrollTo('faq')} className="text-[15px] text-[#6b5c50] hover:text-[#2C1810] transition-colors">FAQ</button></li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#8B7355]/10">
          <p className="text-[13px] text-[#9c8b7e]">2025 Mummaverse. Made with love for Indian moms.</p>
          <div className="flex items-center gap-5">
            {[
              { icon: 'ph:instagram-logo-bold', label: 'Instagram' },
              { icon: 'ph:twitter-logo-bold', label: 'Twitter' },
              { icon: 'ph:youtube-logo-bold', label: 'YouTube' },
            ].map(({ icon, label }) => (
              <a key={label} href="#" className="text-[#8B7355] hover:text-[#E8600C] transition-colors" aria-label={label}>
                <Icon icon={icon} className="text-xl" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
