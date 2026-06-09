import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'

const TESTIMONIALS = [
  {
    quote: "I manage everything — cooking, cleaning, my kid's classes, my in-laws' medicines. Pariverse made me realise",
    highlight: "I was doing five people's jobs alone.",
    name: 'Priya S.',
    role: 'Working mom, Pune',
    avatar: 'P',
    color: 'from-orange-400 to-orange-600',
  },
  {
    quote: "Mere husband ko lagta tha ghar khud chal jaata hai. Chore board dekhke pehli baar bola —",
    highlight: '"yaar, itna sab tum karti ho?"',
    name: 'Deepika R.',
    role: 'Stay-at-home mom, Bengaluru',
    avatar: 'D',
    color: 'from-rose-400 to-rose-600',
  },
  {
    quote: "Bacche ko raat ko bukhar aaya, 102°F. Pariverse ka first aid guide khola — no Google rabbit hole, no panic.",
    highlight: "Sab kuch ek jagah, doctor ki tarah samjhaya.",
    name: 'Ananya M.',
    role: 'Mom of two, Delhi NCR',
    avatar: 'A',
    color: 'from-blue-400 to-blue-600',
  },
  {
    quote: "Joint family mein saas ki help thi. Nuclear family mein sab akele. Pariverse meri",
    highlight: "digital saas ban gayi — bina judgement ke.",
    name: 'Kavitha N.',
    role: 'IT professional & mom, Chennai',
    avatar: 'K',
    color: 'from-emerald-400 to-emerald-600',
  },
]

export default function Testimonial() {
  const ref = useReveal()
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => go((active + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(timer)
  }, [active])

  function go(idx: number) {
    if (idx === active) return
    setFading(true)
    setTimeout(() => { setActive(idx); setFading(false) }, 300)
  }

  const t = TESTIMONIALS[active]

  return (
    <section className="relative py-20 md:py-28 bg-transparent">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
        <Icon icon="ph:quotes-bold" className="text-5xl text-orange-200 mb-6 block mx-auto" />

        <div
          className="transition-all duration-300"
          style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(8px)' : 'translateY(0)' }}
        >
          <blockquote className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed mb-8 text-[#4A3728]">
            "{t.quote}{' '}
            <span className="text-orange-600 font-medium">{t.highlight}</span>"
          </blockquote>

          <div className="flex items-center justify-center gap-3">
            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-sm font-bold text-white shadow-md`}>
              {t.avatar}
            </div>
            <div className="text-left">
              <div className="text-[16px] font-semibold text-[#2C1810]">{t.name}</div>
              <div className="text-[14px] text-[#8B7355]">{t.role}</div>
            </div>
          </div>
        </div>

        {/* Dot navigation */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? 24 : 8,
                height: 8,
                background: i === active ? '#E07B39' : '#D4C4B0',
              }}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
