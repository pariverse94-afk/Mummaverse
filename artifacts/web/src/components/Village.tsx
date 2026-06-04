import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'
import { useEffect, useRef, useState } from 'react'

const TILES = [
  {
    icon: 'ph:users-three-bold',
    iconColor: '#ea580c',
    gradientFrom: '#FFF3E8',
    gradientTo: '#FFE4C8',
    borderColor: 'rgba(234,88,12,0.2)',
    stat: '50+',
    label: 'Moms answer\nyour questions',
    delay: 0,
  },
  {
    icon: 'ph:cooking-pot-bold',
    iconColor: '#d97706',
    gradientFrom: '#FFFBEB',
    gradientTo: '#FEF3C7',
    borderColor: 'rgba(217,119,6,0.2)',
    stat: '7 days',
    label: 'Meal plan,\nautomated',
    delay: 150,
  },
  {
    icon: 'ph:heart-bold',
    iconColor: '#9333ea',
    gradientFrom: '#FAF5FF',
    gradientTo: '#EDE9FE',
    borderColor: 'rgba(147,51,234,0.2)',
    stat: '1000+',
    label: 'Moms on the\nwaitlist',
    delay: 300,
  },
  {
    icon: 'ph:shield-check-bold',
    iconColor: '#059669',
    gradientFrom: '#ECFDF5',
    gradientTo: '#D1FAE5',
    borderColor: 'rgba(5,150,105,0.2)',
    stat: '100%',
    label: 'Safe, private,\nnon-judgmental',
    delay: 450,
  },
]

export default function Village() {
  const textRef = useReveal()
  const gridRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState([false, false, false, false])

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          TILES.forEach((tile, i) => {
            setTimeout(() => {
              setVisible(v => {
                const next = [...v]
                next[i] = true
                return next
              })
            }, tile.delay)
          })
          obs.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="village" className="relative py-24 md:py-32 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Animated mosaic grid */}
          <div ref={gridRef} className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              {TILES.map((tile, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-6 flex flex-col items-center text-center border ${i === 1 ? 'mt-6' : i === 2 ? '-mt-6' : i === 3 ? 'mt-6' : ''}`}
                  style={{
                    background: `linear-gradient(135deg, ${tile.gradientFrom}, ${tile.gradientTo})`,
                    borderColor: tile.borderColor,
                    opacity: visible[i] ? 1 : 0,
                    transform: visible[i] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                    transition: 'all .7s cubic-bezier(.16,1,.3,1)',
                    minHeight: 160,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: `${tile.iconColor}15`, border: `1px solid ${tile.iconColor}30` }}
                  >
                    <Icon icon={tile.icon} style={{ color: tile.iconColor, fontSize: 28 }} className="float-slow" />
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: tile.iconColor, fontFamily: "'Oswald', sans-serif" }}>
                    {tile.stat}
                  </div>
                  <p className="text-[12px] text-[#6b5c50] leading-tight" style={{ whiteSpace: 'pre-line' }}>{tile.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: text */}
          <div ref={textRef} className="reveal order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200/50 bg-orange-50/50 mb-6">
              <Icon icon="ph:heart-bold" className="text-orange-600 text-[15px]" />
              <span className="text-[12px] font-medium text-orange-700 uppercase tracking-widest">The Village</span>
            </div>
            <h2 className="text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-medium uppercase leading-[.9] tracking-tight mb-6 text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>
              We Lost Our Villages.<br /><span className="text-orange-600">Let Us Rebuild Them.</span>
            </h2>
            <div className="space-y-4 text-[15px] md:text-[17px] text-[#6b5c50] leading-relaxed">
              <p>Your grandmother did not manage a home alone. She had her sisters, her mother-in-law, the neighbour aunty. Chores were shared. Kids were watched by many hands.</p>
              <p>Then we moved to cities. Got nuclear families. Got apartments with locked doors. The expectation stayed - <span className="text-[#2C1810] font-medium">mom handles it all</span> - but the support system disappeared.</p>
              <p>Pariverse community is not a social network. It is a <strong className="text-[#2C1810]">digital village</strong>. Where you can ask "my 3-year-old will not eat dal" and get answers from 50 moms.</p>
            </div>
            <div className="mt-8 p-6 rounded-xl bg-orange-50/30 border border-orange-200/30">
              <p className="text-[15px] text-[#4A3728] italic leading-relaxed">"I did not realise how alone I was until I found a space where other moms said the things I was thinking but never dared to say out loud."</p>
              <p className="text-[14px] text-orange-700 mt-2 font-semibold">- Early waitlist mom, Delhi</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
