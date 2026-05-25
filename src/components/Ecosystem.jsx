import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'
import rebuildImg from '../assets/rebuilding_lost_villages.png'
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
          <h2 className="font-oswald text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-500 uppercase leading-[.9] tracking-tight mb-4 text-[#2C1810]">
            One Company. <span className="text-orange-600">Many Solutions.</span>
          </h2>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
          <div className="feature-card rounded-2xl overflow-hidden">
            <div className="h-40 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=250&fit=crop&auto=format&q=80" alt="A cinematic shot representing the Pariverse home management ecosystem." className="w-full h-full object-cover block" loading="lazy" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <Icon icon="ph:house-simple-bold" className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-oswald text-lg font-500 uppercase text-[#2C1810]">Pariverse</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-600">Home Management</span>
                </div>
              </div>
              <p className="text-[14px] text-[#6b5c50] leading-relaxed mb-3">Meal planning, nutrition, first aid, chore delegation, community.</p>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />In Development
              </span>
            </div>
          </div>

          <div className="eco-card rounded-2xl overflow-hidden">
            <div className="h-40 overflow-hidden">
              <img src="https://plus.unsplash.com/premium_photo-1661601051515-e2a2296e625a?w=600&h=250&fit=crop&auto=format&q=80" alt="A cinematic shot of a child in a learning environment, representing the Eduverse learning ecosystem." className="w-full h-full object-cover block" loading="lazy" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#F7EDE4] border border-[#8B7355]/15 flex items-center justify-center">
                  <Icon icon="ph:graduation-cap-bold" className="text-[#8B7355] text-lg" />
                </div>
                <div>
                  <h3 className="font-oswald text-lg font-500 uppercase text-[#8B7355]">Eduverse</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9c8b7e]">Learning</span>
                </div>
              </div>
              <p className="text-[14px] text-[#9c8b7e] leading-relaxed">School calendar, homework tracking, exam prep, parent-teacher communication.</p>
            </div>
          </div>

          <div className="eco-card rounded-2xl overflow-hidden">
            <div className="h-40 overflow-hidden">
              <img src="{rebuildImg}" alt="A cinematic portrait representing self-care and wellbeing in the Selfverse ecosystem." className="w-full h-full object-cover block" loading="lazy" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#F7EDE4] border border-[#8B7355]/15 flex items-center justify-center">
                  <Icon icon="ph:heart-half-bold" className="text-[#8B7355] text-lg" />
                </div>
                <div>
                  <h3 className="font-oswald text-lg font-500 uppercase text-[#8B7355]">Selfverse</h3>
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
