import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'
import { useEffect, useState } from 'react'

function MealCalendarAnim() {
  const meals = ['Poha', 'Dal Rice', 'Roti Sabzi', 'Upma', 'Rajma', 'Biryani', 'Idli']
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const [lit, setLit] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setLit(l => (l + 1) % days.length), 800)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="w-full overflow-hidden rounded-xl relative" style={{ height: 192 }}>
      <img src={`${import.meta.env.BASE_URL}images/cartoon-meal-prep.png`} alt="Indian meal prep illustration" className="w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,251,235,0.88), rgba(254,243,199,0.82))' }} />
      <div className="absolute inset-0 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-lg bg-amber-500 flex items-center justify-center">
            <Icon icon="ph:cooking-pot-bold" className="text-white text-[10px]" />
          </div>
          <span className="text-[11px] font-semibold text-amber-800">Weekly Meal Plan</span>
        </div>
        <div className="grid grid-cols-7 gap-1 flex-1">
          {days.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[9px] text-amber-600 font-medium">{day}</span>
              <div
                className={`meal-cell w-full rounded-lg border flex items-center justify-center border-amber-300 ${i === lit ? 'lit' : ''}`}
                style={{ height: 52, transition: 'all .5s ease', background: i === lit ? '#f59e0b22' : 'rgba(255,255,255,0.6)' }}
              >
                <span className="text-[7px] text-amber-800 text-center leading-tight px-0.5 font-medium">{meals[i]}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="h-1 rounded-full bg-amber-200 flex-1">
            <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${((lit + 1) / 7) * 100}%` }} />
          </div>
          <span className="text-[9px] text-amber-700 font-medium">{lit + 1}/7</span>
        </div>
      </div>
    </div>
  )
}

function NutritionChartAnim() {
  const members = [
    { name: 'Mama', bars: [75, 55, 80, 40], color: '#ea580c' },
    { name: 'Papa', bars: [60, 80, 45, 70], color: '#0891b2' },
    { name: 'Kiddo', bars: [40, 30, 65, 55], color: '#059669' },
  ]
  const nutrients = ['Fe', 'VD', 'Ca', 'B12']

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', height: 192 }}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Icon icon="ph:chart-bar-bold" className="text-white text-[10px]" />
          </div>
          <span className="text-[11px] font-semibold text-emerald-800">Family Nutrition</span>
        </div>
        <div className="flex gap-2 flex-1">
          {members.map(({ name, bars, color }, mi) => (
            <div key={mi} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center" style={{ borderColor: color, background: `${color}15` }}>
                <span className="text-[8px] font-bold" style={{ color }}>{name[0]}</span>
              </div>
              <div className="flex gap-0.5 items-end flex-1">
                {bars.map((pct, bi) => (
                  <div key={bi} className="w-3 rounded-t overflow-hidden" style={{ height: 48, background: `${color}20` }}>
                    <div
                      className="w-full rounded-t"
                      style={{
                        backgroundColor: color,
                        height: `${pct}%`,
                        marginTop: `${100 - pct}%`,
                        animation: `barGrow ${1.2 + bi * 0.2}s ease-in-out infinite alternate`,
                        animationDelay: `${mi * 0.3 + bi * 0.1}s`,
                      }}
                    />
                  </div>
                ))}
              </div>
              <span className="text-[7px]" style={{ color }}>{name}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-1 mt-1 justify-center">
          {nutrients.map(n => <span key={n} className="text-[8px] text-emerald-600">{n}</span>)}
        </div>
      </div>
    </div>
  )
}

function FirstAidAnim() {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setFlipped(f => !f), 2500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ background: 'linear-gradient(135deg, #FFF5F5, #FFE4E6)', height: 192 }}>
      <div className="p-4 h-full flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-3 self-start">
          <div className="w-5 h-5 rounded-lg bg-red-500 flex items-center justify-center">
            <Icon icon="ph:first-aid-kit-bold" className="text-white text-[10px]" />
          </div>
          <span className="text-[11px] font-semibold text-red-800">First Aid Guide</span>
        </div>
        <div
          className="relative rounded-2xl transition-all duration-700 cursor-pointer flex items-center justify-center"
          style={{
            width: 140,
            height: 100,
            background: flipped ? 'linear-gradient(135deg, #fef2f2, #fecaca)' : 'linear-gradient(135deg, #dc2626, #b91c1c)',
            boxShadow: '0 8px 24px -8px rgba(220,38,38,0.3)',
          }}
        >
          {flipped ? (
            <div className="text-center px-3">
              <Icon icon="ph:check-circle-bold" className="text-red-600 text-2xl mb-1" />
              <p className="text-[9px] text-red-700 font-medium leading-tight">Cool under running water for 10-20 min</p>
            </div>
          ) : (
            <div className="text-center">
              <Icon icon="ph:fire-bold" className="text-white text-3xl pulse-glow-slow" />
              <p className="text-[10px] text-red-100 mt-1 font-semibold">Burns</p>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${!flipped ? 'bg-red-500' : 'bg-red-200'}`} />
          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${flipped ? 'bg-red-500' : 'bg-red-200'}`} />
        </div>
        <p className="text-[9px] text-red-500 mt-1">{flipped ? 'First Response' : 'Tap for guidance'}</p>
      </div>
    </div>
  )
}

function CommunityAnim() {
  const messages = [
    { text: 'My 3yo won\'t sleep alone 😩', from: 'left', color: '#ea580c' },
    { text: 'Try the Ferber method! Changed our life', from: 'right', color: '#9333ea' },
    { text: 'Or try a sleep story routine?', from: 'left', color: '#0891b2' },
    { text: '❤️ Thank you both so much!', from: 'right', color: '#059669' },
  ]
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (visible < messages.length) {
      const id = setTimeout(() => setVisible(v => v + 1), 800)
      return () => clearTimeout(id)
    } else {
      const id = setTimeout(() => setVisible(0), 2000)
      return () => clearTimeout(id)
    }
  }, [visible])

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ background: 'linear-gradient(135deg, #FAF5FF, #EDE9FE)', height: 192 }}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-lg bg-purple-600 flex items-center justify-center">
            <Icon icon="ph:users-three-bold" className="text-white text-[10px]" />
          </div>
          <span className="text-[11px] font-semibold text-purple-800">Mom Community</span>
        </div>
        <div className="flex-1 space-y-1.5 overflow-hidden">
          {messages.slice(0, visible).map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === 'right' ? 'justify-end' : 'justify-start'}`}
              style={{ animation: 'bubbleIn .4s ease-out both' }}
            >
              <div
                className="rounded-xl px-2.5 py-1.5 max-w-[75%] text-[9px] leading-tight"
                style={{ background: `${msg.color}12`, color: msg.color, border: `1px solid ${msg.color}25`, fontWeight: 500 }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  {
    AnimComp: MealCalendarAnim,
    iconBg: 'bg-amber-50 border-amber-200/50',
    icon: 'ph:cooking-pot-bold',
    iconColor: 'text-amber-600',
    tagColor: 'text-orange-600',
    tag: 'Never ask "aaj kya banau" again',
    title: 'Meal Planning',
    desc: 'Weekly Indian meal plans built around your family preferences. Auto-generates shopping lists sorted by section.',
    checkColor: 'text-amber-600',
    items: ['Seasonal ingredient suggestions', 'Leftover recycling recipes', 'Smart grocery list by aisle', 'Festival menus'],
  },
  {
    AnimComp: NutritionChartAnim,
    iconBg: 'bg-emerald-50 border-emerald-200/50',
    icon: 'ph:chart-bar-bold',
    iconColor: 'text-emerald-600',
    tagColor: 'text-emerald-600',
    tag: 'For every family member',
    title: 'Nutrition Tracking',
    desc: 'Track nutritional intake of everyone from one dashboard. Built around Indian food values - dal, roti, sabzi.',
    checkColor: 'text-emerald-600',
    items: ['Indian food database', 'Per-member profiles', 'Deficiency alerts', 'Weekly reports'],
    delay: '.1s',
  },
  {
    AnimComp: FirstAidAnim,
    iconBg: 'bg-rose-50 border-rose-200/50',
    icon: 'ph:first-aid-kit-bold',
    iconColor: 'text-rose-600',
    tagColor: 'text-rose-600',
    tag: 'Calm, clear, when you need it most',
    title: 'First Aid Guidance',
    desc: 'Doctor-reviewed first aid for common emergencies - burns, cuts, fevers. Tailored for Indian homes.',
    checkColor: 'text-rose-600',
    items: ['Symptom checker', 'Doctor-reviewed', 'Hospital red flags', 'Works offline'],
    delay: '.2s',
  },
  {
    AnimComp: CommunityAnim,
    iconBg: 'bg-purple-50 border-purple-200/50',
    icon: 'ph:users-three-bold',
    iconColor: 'text-purple-600',
    tagColor: 'text-purple-600',
    tag: 'Your village, finally online',
    title: 'Mom Community',
    desc: 'Topic-based spaces - toddler tantrums, teen nutrition, in-law care, going back to work. No judgment.',
    checkColor: 'text-purple-600',
    items: ['Topic circles', 'City-wise groups', 'Anonymous venting', 'Expert Q&A'],
    delay: '.3s',
  },
]

function FeatureCard({ AnimComp, iconBg, icon, iconColor, tagColor, tag, title, desc, checkColor, items, delay }: {
  AnimComp: () => JSX.Element
  iconBg: string; icon: string; iconColor: string; tagColor: string; tag: string
  title: string; desc: string; checkColor: string; items: string[]; delay?: string
}) {
  const ref = useReveal()
  return (
    <div ref={ref} className="feature-card rounded-2xl overflow-hidden reveal" style={delay ? { transitionDelay: delay } : {}}>
      <div className="p-5">
        <AnimComp />
      </div>
      <div className="p-7 md:p-8 pt-2">
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-12 h-12 rounded-xl ${iconBg} border flex items-center justify-center flex-shrink-0`}>
            <Icon icon={icon} className={`${iconColor} text-xl`} />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-medium uppercase tracking-tight mb-1 text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>{title}</h3>
            <span className={`text-[12px] ${tagColor} uppercase tracking-widest`}>{tag}</span>
          </div>
        </div>
        <p className="text-[15px] text-[#6b5c50] leading-relaxed mb-5">{desc}</p>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item} className="flex items-center gap-2 text-[15px] text-[#4A3728]">
              <Icon icon="ph:check-circle-fill" className={`${checkColor} flex-shrink-0`} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Features() {
  const headRef = useReveal()

  return (
    <section id="features" className="relative py-24 md:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="text-center mb-16 md:mb-20 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200/50 bg-orange-50/50 mb-6">
            <Icon icon="ph:sparkle-bold" className="text-orange-600 text-[15px]" />
            <span className="text-[12px] font-medium text-orange-700 uppercase tracking-widest">What Pariverse Does</span>
          </div>
          <h2 className="text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-medium uppercase leading-[.9] tracking-tight mb-4 text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Your Home, <span className="text-orange-600">Finally</span> Organised
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
        </div>
      </div>
    </section>
  )
}
