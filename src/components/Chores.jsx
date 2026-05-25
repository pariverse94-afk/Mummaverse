import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'

const ITEMS = [
  { icon: 'ph:clipboard-text-bold', color: 'text-orange-500', title: 'Visual Chore Board', desc: 'See who is doing what.' },
  { icon: 'ph:bell-ringing-bold', color: 'text-amber-500', title: 'Gentle Reminders', desc: 'Not nagging - just a nudge.' },
  { icon: 'ph:trophy-bold', color: 'text-emerald-500', title: 'Family Streaks', desc: 'Gamify chores for kids.' },
  { icon: 'ph:calendar-check-bold', color: 'text-purple-500', title: 'Weekly Fairness Check', desc: 'Data to back it up.' },
]

export default function Chores() {
  const headRef = useReveal()
  const gridRef = useReveal()

  return (
    <section className="relative py-24 md:py-32 bg-[#FDF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="max-w-3xl mx-auto text-center mb-14 reveal">
          <h2 className="font-oswald text-3xl md:text-[2.75rem] font-500 uppercase leading-[.9] tracking-tight mb-6 text-[#2C1810]">
            Chores Are Not "Mom's Job".<br /><span className="text-orange-600">That Is the New Normal.</span>
          </h2>
        </div>
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal">
          {ITEMS.map(({ icon, color, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-5 text-center border border-[#8B7355]/10 hover:shadow-md transition-shadow">
              <Icon icon={icon} className={`text-3xl ${color} mb-3`} />
              <h3 className="text-[15px] font-semibold mb-1 text-[#2C1810]">{title}</h3>
              <p className="text-[14px] text-[#8B7355]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
