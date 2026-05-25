import { useReveal } from '../hooks/useReveal'

const STATS = [
  { value: '4', label: 'Core Features' },
  { value: '100%', label: 'Free to Use' },
  { value: '1000+', label: 'Moms Waiting' },
  { value: 'Infinite', label: 'Village Love', highlight: true },
]

export default function Stats() {
  const ref = useReveal()

  return (
    <section className="relative border-y border-[#8B7355]/10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 reveal">
          {STATS.map(({ value, label, highlight }) => (
            <div key={label} className="stat-item text-center">
              <div className={`text-3xl md:text-4xl font-medium mb-1 ${highlight ? 'text-orange-600' : 'text-[#2C1810]'}`} style={{ fontFamily: "'Oswald', sans-serif" }}>{value}</div>
              <div className="text-[13px] uppercase tracking-[.15em] text-[#8B7355]">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
