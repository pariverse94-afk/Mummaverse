import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'

function MentalLoadAnim() {
  return (
    <div className="w-full h-44 flex items-center justify-center rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF3E8, #FFE4C8)' }}>
      <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute rounded-full border border-orange-400/30"
            style={{
              width: 30 + i * 28,
              height: 30 + i * 28,
              animation: `ringPulse ${2 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        <div className="relative z-10 w-14 h-14 rounded-full bg-orange-100 border border-orange-300/50 flex items-center justify-center">
          <Icon icon="ph:clock-countdown-bold" className="text-orange-600 text-2xl" style={{ animation: 'clockTick 4s steps(4) infinite' }} />
        </div>
      </div>
      <div className="ml-4 space-y-1.5">
        {['Milk?', 'Uniform?', 'Meds?'].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-white/70 text-[#8B4513] border border-orange-200/50" style={{ animation: `particleDrift ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

function MealPlanAnim() {
  return (
    <div className="w-full h-44 rounded-xl overflow-hidden relative">
      <img
        src={`${import.meta.env.BASE_URL}images/meal-thali.jpg`}
        alt="Indian thali meal"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(120,60,0,0.7) 0%, rgba(0,0,0,0.1) 60%)' }} />
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
          <Icon icon="ph:cooking-pot-bold" className="text-white text-sm" />
        </div>
        <span className="text-white text-[12px] font-semibold drop-shadow">Dal, Roti, Sabzi — sorted</span>
      </div>
      <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-bold">
        Aaj kya banau?
      </div>
    </div>
  )
}

function PanicAnim() {
  return (
    <div className="w-full h-44 flex items-center justify-center rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', animation: 'phonePulse 3s ease-in-out infinite' }}>
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-28 rounded-xl border-2 border-blue-300 bg-white flex flex-col items-center justify-center gap-1 shadow-md">
          <div className="w-6 h-1 rounded-full bg-blue-200 mb-1" />
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
            <Icon icon="ph:warning-bold" className="text-blue-500 text-xl" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }} />
          </div>
          <div className="text-[8px] text-blue-500 font-semibold">FEVER?</div>
          <div className="w-8 h-1.5 rounded-full bg-blue-400/50" />
          <div className="w-10 h-1.5 rounded-full bg-blue-300/30" />
        </div>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-400/60"
            style={{
              right: -8 - i * 12,
              top: 10 + i * 12,
              animation: `particleDrift ${2 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
      <div className="ml-4 text-left">
        <div className="text-[12px] text-blue-800 font-semibold mb-1">2:00 AM</div>
        <div className="text-[11px] text-blue-600">No clear answers</div>
        <div className="text-[11px] text-blue-600">10 Google tabs</div>
        <div className="mt-2 px-2 py-1 rounded-lg bg-blue-100 border border-blue-200">
          <div className="text-[10px] text-blue-700 font-medium">Pariverse: Calm guide</div>
        </div>
      </div>
    </div>
  )
}

function NutritionAnim() {
  const bars = [
    { label: 'Iron', pct: 35, color: '#10b981' },
    { label: 'Vit D', pct: 22, color: '#f59e0b' },
    { label: 'Calc', pct: 60, color: '#3b82f6' },
    { label: 'B12', pct: 48, color: '#8b5cf6' },
  ]
  return (
    <div className="w-full h-44 flex items-center justify-center rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' }}>
      <div className="flex items-end gap-3 px-4">
        {bars.map(({ label, pct, color }, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-semibold" style={{ color }}>{pct}%</span>
            <div className="relative w-8 rounded-t-lg overflow-hidden" style={{ height: 64, background: `${color}20` }}>
              <div
                className="absolute bottom-0 w-full rounded-t-lg"
                style={{
                  backgroundColor: color,
                  height: `${pct}%`,
                  animation: `barGrow ${1.2 + i * 0.2}s cubic-bezier(.16,1,.3,1) infinite alternate`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            </div>
            <span className="text-[9px] text-[#6b5c50]">{label}</span>
          </div>
        ))}
        <div className="ml-2 flex flex-col gap-1">
          <Icon icon="ph:leaf-bold" className="text-emerald-500 text-xl" style={{ animation: 'leafSway 2s ease-in-out infinite' }} />
          <div className="text-[9px] text-emerald-700 font-medium">Track</div>
          <div className="text-[9px] text-emerald-700 font-medium">gaps</div>
        </div>
      </div>
    </div>
  )
}

function ChoreLonelinessAnim() {
  return (
    <div className="w-full h-44 rounded-xl overflow-hidden relative">
      <img
        src={`${import.meta.env.BASE_URL}images/chores-india-family.jpg`}
        alt="Family doing household chores"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(80,20,20,0.72) 0%, rgba(0,0,0,0.08) 60%)' }} />
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center">
          <Icon icon="ph:clipboard-text-bold" className="text-white text-sm" />
        </div>
        <span className="text-white text-[12px] font-semibold drop-shadow">Share the load</span>
      </div>
      <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-rose-500/90 text-white text-[10px] font-bold">
        Nuclear family load
      </div>
    </div>
  )
}

function VillageAnim() {
  return (
    <div className="w-full h-44 flex items-center justify-center rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)' }}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 mb-1">
          {[
            { icon: 'ph:person-bold', color: '#ea580c', label: 'You' },
            { icon: 'ph:person-bold', color: '#9333ea', label: 'Priya' },
            { icon: 'ph:person-bold', color: '#0891b2', label: 'Anita' },
          ].map(({ icon, color, label }, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center" style={{ borderColor: color, background: `${color}15` }}>
                <Icon icon={icon} style={{ color, fontSize: 18 }} />
              </div>
              <span className="text-[9px]" style={{ color }}>{label}</span>
            </div>
          ))}
        </div>
        {[
          { text: '"My toddler won\u2019t eat dal!"', delay: '0s', color: '#ea580c' },
          { text: '"Add ghee, works every time \u{1F60A}"', delay: '0.8s', color: '#9333ea' },
          { text: '"Try it mixed with rice!"', delay: '1.6s', color: '#0891b2' },
        ].map(({ text, delay, color }, i) => (
          <div
            key={i}
            className="px-2 py-1 rounded-xl text-[10px] font-medium max-w-[180px]"
            style={{
              background: `${color}12`,
              color,
              border: `1px solid ${color}30`,
              animation: `bubbleIn .5s ease-out both`,
              animationDelay: delay,
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}

const PROBLEMS = [
  {
    Anim: MentalLoadAnim,
    icon: 'ph:clock-countdown-bold',
    title: 'The Invisible Mental Load',
    desc: 'Remembering what is in the fridge, whose uniform needs ironing, when the milk runs out - this constant checklist never turns off.',
  },
  {
    Anim: MealPlanAnim,
    icon: 'ph:cooking-pot-bold',
    title: 'Meal Planning Exhaustion',
    desc: '"Aaj kya banau?" - asked every single day. Planning balanced meals everyone eats is a full-time job nobody pays you for.',
    delay: '.08s',
  },
  {
    Anim: PanicAnim,
    icon: 'ph:warning-circle-bold',
    title: 'Panic at 2 AM',
    desc: 'Child gets a fever. You Google. Ten different answers. No quick, reliable first aid built for Indian homes.',
    delay: '.16s',
  },
  {
    Anim: NutritionAnim,
    icon: 'ph:leaf-bold',
    title: 'Nutrition Blind Spots',
    desc: 'Is your child getting enough iron? Is your husband skipping proteins? Are you eating at all? Without tracking, you are guessing.',
    delay: '.24s',
  },
  {
    Anim: ChoreLonelinessAnim,
    icon: 'ph:clipboard-text-bold',
    title: 'Chore Loneliness',
    desc: 'In a nuclear family, you cannot ask your sister-in-law to watch the kids. There is no one to share the load with.',
    delay: '.32s',
  },
  {
    Anim: VillageAnim,
    icon: 'ph:users-three-bold',
    title: 'No Village, No Support',
    desc: '"It takes a village" is not just cute - it is biology. You need other moms who have been through what you are going through.',
    delay: '.4s',
  },
]

function ProblemCard({ Anim, title, desc, delay }: { Anim: () => JSX.Element, title: string, desc: string, delay?: string }) {
  const ref = useReveal()
  return (
    <article ref={ref} className="problem-card rounded-2xl p-6 md:p-7 reveal" style={delay ? { transitionDelay: delay } : {}}>
      <div className="rounded-xl overflow-hidden mb-5">
        <Anim />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-[#2C1810]">{title}</h3>
      <p className="text-[15px] text-[#6b5c50] leading-relaxed">{desc}</p>
    </article>
  )
}

export default function Problem() {
  const headRef = useReveal()

  return (
    <section id="problem" className="relative py-24 md:py-32 overflow-hidden bg-[#FDF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="max-w-3xl mx-auto text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200/50 bg-orange-50/50 mb-6">
            <Icon icon="ph:heart-break-bold" className="text-orange-600 text-[15px]" />
            <span className="text-[12px] font-medium text-orange-700 uppercase tracking-widest">The Real Problem</span>
          </div>
          <h2 className="text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-medium uppercase leading-[.9] tracking-tight mb-6 text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>
            You Are Not Failing.<br /><span className="text-orange-600">The System Is.</span>
          </h2>
          <p className="text-[17px] md:text-lg text-[#6b5c50] leading-relaxed max-w-2xl mx-auto">
            In urban India, the nuclear family replaced the joint family - but nobody replaced the village that once shared the load.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROBLEMS.map(p => <ProblemCard key={p.title} {...p} />)}
        </div>
      </div>
    </section>
  )
}
