import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'

const WAITLIST_URL = 'https://forms.gle/9zS6uNDvP1udzYqJ8'

export default function Waitlist() {
  const ref = useReveal()

  return (
    <section id="waitlist" className="relative py-24 md:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-2xl mx-auto reveal">
          <div className="beam-container waitlist-card relative bg-white/70 border border-[#8B7355]/10 rounded-2xl p-8 md:p-12 text-center overflow-hidden">
            <div className="beam" style={{ left: '25%', animationDelay: '0s' }} />
            <div className="beam" style={{ left: '50%', animationDelay: '2.5s' }} />
            <div className="beam" style={{ left: '75%', animationDelay: '5s' }} />

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <Icon icon="ph:planet-bold" className="text-white text-sm" />
                </div>
                <span className="text-[15px] font-medium tracking-wider uppercase text-[#8B7355]" style={{ fontFamily: "'Oswald', sans-serif" }}>From Mummaverse</span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto mb-6 pulse-glow-slow">
                <Icon icon="ph:house-simple-bold" className="text-white text-3xl" />
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium uppercase tracking-tight mb-3 text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>Your Village is Waiting</h2>
              <p className="text-[17px] text-[#6b5c50] leading-relaxed mb-8 max-w-md mx-auto">
                Join 1,000+ Indian moms on the waitlist. Be among the first to experience Pariverse.
              </p>

              <a href={WAITLIST_URL} target="_blank" rel="noreferrer" className="btn-primary text-[17px] font-semibold px-10 py-4 rounded-xl inline-flex items-center justify-center gap-3 w-full sm:w-auto">
                <span>Join the Waitlist</span>
                <Icon icon="ph:arrow-up-right-bold" className="text-xl" />
              </a>
              <p className="text-[12px] text-[#9c8b7e] mt-6">Free forever - No spam - Opens in new tab</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
