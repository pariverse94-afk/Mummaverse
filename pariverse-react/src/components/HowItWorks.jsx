import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'

const STEPS = [
  {
    num: '1', color: 'text-orange-600', border: 'border-orange-200/50',
    title: 'Set Up Your Family',
    desc: 'Add members - ages, preferences, health conditions. Profiles in under 5 minutes.',
    delay: undefined,
  },
  {
    num: '2', color: 'text-emerald-600', border: 'border-emerald-200/50',
    title: 'Get Your Plan',
    desc: 'Weekly meal plan, nutrition gaps flagged, community conversations surfaced. Everything adapts.',
    delay: '.15s',
  },
  {
    num: '3', color: 'text-purple-600', border: 'border-purple-200/50',
    title: 'Breathe and Share',
    desc: 'Follow the plan, lean on your village. You were never meant to do this alone.',
    delay: '.3s',
  },
]

function Step({ num, color, border, title, desc, delay }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="reveal text-center" style={delay ? { transitionDelay: delay } : {}}>
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className={`absolute inset-0 rounded-full border-2 ${border} float-slow`} />
        <div className="absolute inset-2 rounded-full bg-white border border-[#8B7355]/10 flex items-center justify-center">
          <span className={`font-oswald text-2xl font-500 ${color}`}>{num}</span>
        </div>
      </div>
      <h3 className="font-oswald text-xl font-500 uppercase tracking-tight mb-3 text-[#2C1810]">{title}</h3>
      <p className="text-[15px] text-[#6b5c50] leading-relaxed">{desc}</p>
    </div>
  )
}

export default function HowItWorks() {
  const headRef = useReveal()

  return (
    <section className="relative py-24 md:py-32 bg-[#FDF8F3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="text-center mb-16 md:mb-20 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200/50 bg-orange-50/50 mb-6">
            <Icon icon="ph:path-bold" className="text-orange-600 text-[15px]" />
            <span className="text-[12px] font-medium text-orange-700 uppercase tracking-widest">How It Works</span>
          </div>
          <h2 className="font-oswald text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-500 uppercase leading-[.9] tracking-tight mb-4 text-[#2C1810]">
            Three Steps to a <span className="text-orange-600">Lighter Home</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {STEPS.map(s => <Step key={s.num} {...s} />)}
        </div>
      </div>
    </section>
  )
}
