import { Icon } from '@iconify/react'
import heroImg from '../assets/hero.png'

const WAITLIST_URL = 'https://forms.gle/DEMO-REPLACE-THIS-LINK'
const LETTERS = 'Pariverse'.split('')
const DELAYS = [.3, .36, .42, .48, .54, .6, .66, .72, .78]

export default function Hero() {
  return (
    <header className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%,rgba(234,88,12,.08),transparent 60%)' }} />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl float-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-amber-600/5 blur-3xl float-medium" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: text */}
          <div className="text-left">
            <div className="anim-in-d1 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200/50 bg-orange-50/50 mb-6">
              <div className="w-2 h-2 rounded-full bg-orange-500 pulse-glow" />
              <span className="text-[13px] font-medium text-[#92400E] uppercase tracking-widest">First Product by Mummaverse - Coming Soon</span>
            </div>

            <p className="anim-in-d2 text-[15px] uppercase tracking-[.25em] text-orange-500 mb-4 font-semibold">Introducing</p>

            <h1 className="hero-title font-oswald font-500 uppercase leading-[.85] tracking-[-.04em] text-[16vw] md:text-[10vw] lg:text-[8rem] mb-5 text-[#2C1810]">
              {LETTERS.map((l, i) => (
                <span key={i}><em style={{ animationDelay: `${DELAYS[i]}s` }}>{l}</em></span>
              ))}
            </h1>

            <p className="anim-in-d4 text-xl md:text-2xl text-[#4A3728] max-w-xl mb-3 leading-relaxed font-light">
              Every mom deserves a village. <span className="text-[#2C1810] font-normal">We are building one online.</span>
            </p>
            <p className="anim-in-d5 text-[17px] md:text-lg text-[#8B7355] max-w-lg mb-10 leading-relaxed">
              India's first home management app for urban nuclear families - plan meals, track nutrition, handle emergencies, connect with moms who get it.
            </p>

            <div className="anim-in-d6 flex flex-col sm:flex-row items-start gap-4">
              <a href={WAITLIST_URL} target="_blank" rel="noreferrer" className="btn-primary text-[17px] font-semibold px-8 py-4 rounded-xl flex items-center gap-3 w-full sm:w-auto justify-center">
                <span>Join the Waitlist</span>
                <Icon icon="ph:arrow-up-right-bold" className="text-xl" />
              </a>
              <button onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })} className="btn-outline text-[17px] font-medium px-8 py-4 rounded-xl flex items-center gap-3 w-full sm:w-auto justify-center">
                <span>See How It Helps</span>
              </button>
            </div>

            <div className="anim-in-d7 mt-12 flex flex-col items-start gap-2">
              <span className="text-[11px] uppercase tracking-[.3em] text-[#9c8b7e]">Scroll to learn more</span>
              <div className="w-5 h-8 rounded-full border border-[#8B7355]/30 flex items-start justify-center p-1">
                <div className="w-1 h-2 rounded-full bg-orange-500 float-slow" />
              </div>
            </div>
          </div>

          {/* Right: image */}
          <div className="anim-in-d3 hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl float-slow" style={{ height: '560px' }}>
              <img
                src={heroImg}
                alt="A premium, cinematic shot representing the support and strength of a community of mothers."
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(44,24,16,.3),transparent 60%)' }} />
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}
