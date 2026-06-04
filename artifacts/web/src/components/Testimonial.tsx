import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'

export default function Testimonial() {
  const ref = useReveal()

  return (
    <section className="relative py-20 md:py-28 bg-transparent">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
        <Icon icon="ph:quotes-bold" className="text-5xl text-orange-200 mb-6 block mx-auto" />
        <blockquote className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed mb-8 text-[#4A3728]">
          "I manage everything - cooking, cleaning, my kid's classes, my in-laws' medicines. Pariverse made me realise{' '}
          <span className="text-orange-600 font-medium">I was doing five people's jobs alone</span>."
        </blockquote>
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-sm font-bold text-white">P</div>
          <div className="text-left">
            <div className="text-[15px] font-semibold text-[#2C1810]">Priya S.</div>
            <div className="text-[14px] text-[#8B7355]">Working mom, Pune</div>
          </div>
        </div>
      </div>
    </section>
  )
}
