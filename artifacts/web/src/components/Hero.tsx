import { Icon } from '@iconify/react'

const WAITLIST_URL = 'https://forms.gle/9zS6uNDvP1udzYqJ8'
const LETTERS = 'Pariverse'.split('')
const DELAYS = [.3, .36, .42, .48, .54, .6, .66, .72, .78]

function HeroAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 480 }}>
      {/* Outer soft radial glow */}
      <div className="absolute inset-0 rounded-3xl" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(234,88,12,.12) 0%, rgba(251,146,60,.06) 40%, transparent 70%)' }} />

      {/* Concentric rings */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 560 480" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Decorative dots scattered */}
        {[
          { cx: 80, cy: 60, r: 3, delay: '0s' },
          { cx: 480, cy: 80, r: 2, delay: '1s' },
          { cx: 520, cy: 300, r: 4, delay: '2s' },
          { cx: 40, cy: 380, r: 3, delay: '1.5s' },
          { cx: 160, cy: 440, r: 2.5, delay: '0.5s' },
          { cx: 400, cy: 420, r: 3.5, delay: '2.5s' },
          { cx: 300, cy: 30, r: 2, delay: '3s' },
        ].map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="rgba(234,88,12,0.5)"
            className="particle"
            style={{ animationDelay: dot.delay, animationDuration: `${5 + i}s` }}
          />
        ))}

        {/* Radial rings - concentric, pulsing */}
        <circle cx="280" cy="240" r="180" stroke="rgba(234,88,12,0.06)" strokeWidth="1" className="ring-pulse" style={{ animationDelay: '0s' }} />
        <circle cx="280" cy="240" r="140" stroke="rgba(234,88,12,0.10)" strokeWidth="1.5" className="ring-pulse" style={{ animationDelay: '.5s' }} />
        <circle cx="280" cy="240" r="100" stroke="rgba(234,88,12,0.14)" strokeWidth="2" className="ring-pulse" style={{ animationDelay: '1s' }} />
        <circle cx="280" cy="240" r="60" stroke="rgba(234,88,12,0.18)" strokeWidth="2.5" className="ring-pulse" style={{ animationDelay: '1.5s' }} />

        {/* Mandala-inspired rotating petals - outer layer */}
        <g className="mandala-rotate" style={{ transformOrigin: '280px 240px' }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            const x = 280 + 155 * Math.cos(rad)
            const y = 240 + 155 * Math.sin(rad)
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx="8"
                ry="4"
                fill="rgba(234,88,12,0.12)"
                transform={`rotate(${angle + 90}, ${x}, ${y})`}
              />
            )
          })}
        </g>

        {/* Inner mandala petals - counter-rotate */}
        <g className="mandala-rotate-reverse" style={{ transformOrigin: '280px 240px' }}>
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            const x = 280 + 115 * Math.cos(rad)
            const y = 240 + 115 * Math.sin(rad)
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx="10"
                ry="5"
                fill="rgba(251,146,60,0.14)"
                transform={`rotate(${angle + 90}, ${x}, ${y})`}
              />
            )
          })}
        </g>

        {/* Flowing curved paths */}
        <path d="M 100 180 Q 280 80 460 200 Q 380 340 200 320 Q 100 310 100 180Z"
          fill="none" stroke="rgba(234,88,12,0.06)" strokeWidth="1" />
        <path d="M 140 200 Q 280 120 420 210 Q 350 320 220 310 Q 140 300 140 200Z"
          fill="rgba(234,88,12,0.025)" stroke="none" />
      </svg>

      {/* Central glowing orb */}
      <div className="relative z-10 flex flex-col items-center justify-center" style={{ width: 200, height: 200 }}>
        <div
          className="pulse-glow rounded-full flex items-center justify-center"
          style={{
            width: 120,
            height: 120,
            background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 50%, #c2410c 100%)',
            boxShadow: '0 0 60px -10px rgba(234,88,12,0.5)',
          }}
        >
          <Icon icon="ph:planet-bold" className="text-white" style={{ fontSize: 56 }} />
        </div>

        {/* Orbiting icons */}
        <div className="absolute inset-0" style={{ animation: 'spinSlow 12s linear infinite', transformOrigin: 'center' }}>
          {[
            { icon: 'ph:cooking-pot-bold', color: '#d97706', angle: 0 },
            { icon: 'ph:heart-bold', color: '#9333ea', angle: 120 },
            { icon: 'ph:first-aid-kit-bold', color: '#dc2626', angle: 240 },
          ].map(({ icon, color, angle }, i) => {
            const rad = (angle * Math.PI) / 180
            const x = 100 + 88 * Math.cos(rad)
            const y = 100 + 88 * Math.sin(rad)
            return (
              <div
                key={i}
                className="absolute w-9 h-9 rounded-full bg-white border border-orange-100 flex items-center justify-center shadow-lg"
                style={{
                  left: x - 18,
                  top: y - 18,
                  animation: `spinReverse 12s linear infinite`,
                }}
              >
                <Icon icon={icon} style={{ color, fontSize: 18 }} />
              </div>
            )
          })}
        </div>

        {/* Second orbit */}
        <div className="absolute inset-0" style={{ animation: 'spinReverse 18s linear infinite', transformOrigin: 'center' }}>
          {[
            { icon: 'ph:users-three-bold', color: '#0891b2', angle: 60 },
            { icon: 'ph:chart-bar-bold', color: '#059669', angle: 180 },
            { icon: 'ph:clipboard-text-bold', color: '#ea580c', angle: 300 },
          ].map(({ icon, color, angle }, i) => {
            const rad = (angle * Math.PI) / 180
            const x = 100 + 88 * Math.cos(rad)
            const y = 100 + 88 * Math.sin(rad)
            return (
              <div
                key={i}
                className="absolute w-7 h-7 rounded-full bg-white border border-orange-100 flex items-center justify-center shadow-md"
                style={{
                  left: x - 14,
                  top: y - 14,
                  animation: `spinSlow 18s linear infinite`,
                }}
              >
                <Icon icon={icon} style={{ color, fontSize: 14 }} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Brand label */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-orange-200/30">
        <div className="w-2 h-2 rounded-full bg-orange-500 pulse-glow" />
        <span className="text-[11px] font-semibold text-[#92400E] uppercase tracking-widest">Your Family, Organised</span>
      </div>
    </div>
  )
}

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

            <h1 className="hero-title leading-[.85] tracking-[-.04em] text-[16vw] md:text-[10vw] lg:text-[8rem] mb-5 text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 500, textTransform: 'uppercase' }}>
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

          {/* Right: animated visual */}
          <div className="anim-in-d3 hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden float-slow" style={{ height: '520px', background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E8 50%, #FFE8D0 100%)' }}>
              <HeroAnimation />
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}
