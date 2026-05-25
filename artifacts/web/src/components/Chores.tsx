import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'

const ITEMS = [
  { icon: 'ph:clipboard-text-bold', color: 'text-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200/50', title: 'Visual Chore Board', desc: 'See who is doing what.' },
  { icon: 'ph:bell-ringing-bold', color: 'text-amber-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-200/50', title: 'Gentle Reminders', desc: 'Not nagging - just a nudge.' },
  { icon: 'ph:trophy-bold', color: 'text-emerald-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200/50', title: 'Family Streaks', desc: 'Gamify chores for kids.' },
  { icon: 'ph:calendar-check-bold', color: 'text-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200/50', title: 'Weekly Fairness Check', desc: 'Data to back it up.' },
]

export default function Chores() {
  const headRef = useReveal()
  const gridRef = useReveal()

  return (
    <section className="relative py-24 md:py-32 bg-[#FDF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="max-w-3xl mx-auto text-center mb-14 reveal">
          <h2 className="text-3xl md:text-[2.75rem] font-medium uppercase leading-[.9] tracking-tight mb-6 text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Chores Are Not "Mom's Job".<br /><span className="text-orange-600">That Is the New Normal.</span>
          </h2>
        </div>
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal">
          {ITEMS.map(({ icon, color, bgColor, borderColor, title, desc }) => (
            <div key={title} className={`${bgColor} rounded-xl p-5 text-center border ${borderColor} hover:shadow-md transition-shadow`}>
              <div className={`w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center mx-auto mb-3 border ${borderColor}`}>
                <Icon icon={icon} className={`text-2xl ${color}`} />
              </div>
              <h3 className="text-[15px] font-semibold mb-1 text-[#2C1810]">{title}</h3>
              <p className="text-[14px] text-[#8B7355]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
