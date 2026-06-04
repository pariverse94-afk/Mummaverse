import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'
import { useEffect, useRef, useState } from 'react'

const STEPS = [
  {
    num: '1', color: '#ea580c', bg: 'bg-orange-50', border: 'border-orange-200/50',
    icon: 'ph:user-plus-bold',
    title: 'Set Up Your Family',
    desc: 'Add members - ages, preferences, health conditions. Profiles in under 5 minutes.',
  },
  {
    num: '2', color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-200/50',
    icon: 'ph:calendar-check-bold',
    title: 'Get Your Plan',
    desc: 'Weekly meal plan, nutrition gaps flagged, community conversations surfaced. Everything adapts.',
    delay: '.15s',
  },
  {
    num: '3', color: '#9333ea', bg: 'bg-purple-50', border: 'border-purple-200/50',
    icon: 'ph:heart-bold',
    title: 'Breathe and Share',
    desc: 'Follow the plan, lean on your village. You were never meant to do this alone.',
    delay: '.3s',
  },
]

export default function HowItWorks() {
  const headRef = useReveal()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [lineVisible, setLineVisible] = useState(false)
  const [nodeVisible, setNodeVisible] = useState([false, false, false])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLineVisible(true)
          setTimeout(() => setNodeVisible([true, false, false]), 200)
          setTimeout(() => setNodeVisible([true, true, false]), 700)
          setTimeout(() => setNodeVisible([true, true, true]), 1200)
          obs.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="relative py-24 md:py-32 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="text-center mb-16 md:mb-20 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200/50 bg-orange-50/50 mb-6">
            <Icon icon="ph:path-bold" className="text-orange-600 text-[15px]" />
            <span className="text-[12px] font-medium text-orange-700 uppercase tracking-widest">How It Works</span>
          </div>
          <h2 className="text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-medium uppercase leading-[.9] tracking-tight mb-4 text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Three Steps to a <span className="text-orange-600">Lighter Home</span>
          </h2>
        </div>

        <div ref={sectionRef} className="relative">
          {/* Connecting animated line (desktop) */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-[#8B7355]/10 overflow-hidden" style={{ left: '16.66%', right: '16.66%' }}>
            <div
              className="h-full bg-gradient-to-r from-orange-400 via-emerald-400 to-purple-400 timeline-line"
              style={{ transition: `transform 1.2s cubic-bezier(.16,1,.3,1)`, transform: lineVisible ? 'scaleX(1)' : 'scaleX(0)' }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="text-center"
                style={{
                  opacity: nodeVisible[i] ? 1 : 0,
                  transform: nodeVisible[i] ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all .6s cubic-bezier(.16,1,.3,1)',
                  transitionDelay: step.delay || '0s',
                }}
              >
                {/* Animated node */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  {/* Outer ring */}
                  <div
                    className="absolute inset-0 rounded-full border-2 float-slow"
                    style={{ borderColor: `${step.color}40` }}
                  />
                  {/* Middle ring */}
                  <div
                    className="absolute inset-2 rounded-full border float-slow"
                    style={{ borderColor: `${step.color}25`, animationDelay: '.3s' }}
                  />
                  {/* Inner filled circle */}
                  <div
                    className={`absolute inset-3 rounded-full ${step.bg} flex items-center justify-center shadow-md`}
                    style={{
                      border: `2px solid ${step.color}30`,
                      boxShadow: nodeVisible[i] ? `0 0 20px -5px ${step.color}50` : 'none',
                      transition: 'box-shadow 1s ease',
                    }}
                  >
                    <Icon icon={step.icon} style={{ color: step.color, fontSize: 26 }} />
                  </div>
                  {/* Step number badge */}
                  <div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-md"
                    style={{ background: step.color }}
                  >
                    {step.num}
                  </div>
                </div>

                <h3 className="text-xl font-medium uppercase tracking-tight mb-3 text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>{step.title}</h3>
                <p className="text-[15px] text-[#6b5c50] leading-relaxed">{step.desc}</p>

                {/* Connector arrow on mobile */}
                {i < STEPS.length - 1 && (
                  <div className="md:hidden mt-4 flex justify-center">
                    <Icon icon="ph:arrow-down-bold" className="text-[#8B7355]/40 text-xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
