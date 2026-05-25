import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'

function EcoIllustration({ icon, color, label }: { icon: string; color: string; label: string }) {
  return (
    <div className="h-40 relative overflow-hidden flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}08, ${color}15)` }}>
      <div className="absolute inset-0">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 80 + i * 60,
              height: 80 + i * 60,
              border: `1px solid ${color}20`,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `ringPulse ${2.5 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${color}90, ${color})` }}>
          <Icon icon={icon} className="text-white text-2xl" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color }}>{label}</span>
      </div>
    </div>
  )
}

export default function Ecosystem() {
  const headRef = useReveal()
  const gridRef = useReveal()

  return (
    <section className="relative py-24 md:py-32 bg-[#FDF8F3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200/50 bg-orange-50/50 mb-6">
            <Icon icon="ph:planet-bold" className="text-orange-600 text-[15px]" />
            <span className="text-[12px] font-medium text-[#8B7355] uppercase tracking-widest">By Mummaverse</span>
          </div>
          <h2 className="text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-medium uppercase leading-[.9] tracking-tight mb-4 text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>
            One Company. <span className="text-orange-600">Many Solutions.</span>
          </h2>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
          {/* Pariverse - Active */}
          <div className="feature-card rounded-2xl overflow-hidden">
            <EcoIllustration icon="ph:house-simple-bold" color="#ea580c" label="Home Management" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <Icon icon="ph:house-simple-bold" className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-medium uppercase text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>Pariverse</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-600">Home Management</span>
                </div>
              </div>
              <p className="text-[14px] text-[#6b5c50] leading-relaxed mb-3">Meal planning, nutrition, first aid, chore delegation, community.</p>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />In Development
              </span>
            </div>
          </div>

          {/* Eduverse - Coming soon */}
          <div className="eco-card rounded-2xl overflow-hidden">
            <EcoIllustration icon="ph:graduation-cap-bold" color="#8B7355" label="Learning" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#F7EDE4] border border-[#8B7355]/15 flex items-center justify-center">
                  <Icon icon="ph:graduation-cap-bold" className="text-[#8B7355] text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-medium uppercase text-[#8B7355]" style={{ fontFamily: "'Oswald', sans-serif" }}>Eduverse</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9c8b7e]">Learning</span>
                </div>
              </div>
              <p className="text-[14px] text-[#9c8b7e] leading-relaxed">School calendar, homework tracking, exam prep, parent-teacher communication.</p>
            </div>
          </div>

          {/* Selfverse - Coming soon */}
          <div className="eco-card rounded-2xl overflow-hidden">
            <EcoIllustration icon="ph:heart-half-bold" color="#8B7355" label="Wellbeing" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#F7EDE4] border border-[#8B7355]/15 flex items-center justify-center">
                  <Icon icon="ph:heart-half-bold" className="text-[#8B7355] text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-medium uppercase text-[#8B7355]" style={{ fontFamily: "'Oswald', sans-serif" }}>Selfverse</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9c8b7e]">Wellbeing</span>
                </div>
              </div>
              <p className="text-[14px] text-[#9c8b7e] leading-relaxed">Mental health check-ins, mood tracking, journaling, therapist access.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
