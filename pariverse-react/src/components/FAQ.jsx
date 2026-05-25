import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'

const FAQS = [
  { q: 'What is Pariverse?', a: "India's first home management app by Mummaverse, for urban moms in nuclear families. Meal planning, nutrition tracking, first aid, and a mom community." },
  { q: 'What is Mummaverse?', a: 'A product company building apps for urban Indian moms. Pariverse is the first. Eduverse and Selfverse are coming next.' },
  { q: 'Is it free?', a: 'Yes. Core features will always be free. Optional premium may come later.' },
  { q: 'Can my partner use it?', a: 'Absolutely. Chore delegation shifts from "helping mom" to "sharing responsibility."' },
  { q: 'Is my data safe?', a: 'End-to-end encryption. No data selling. DPDPA compliant. Delete anytime.' },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="faq-item bg-white border border-[#8B7355]/10 rounded-xl overflow-hidden">
      <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpen(o => !o)}>
        <span className="text-[16px] font-semibold pr-4 text-[#2C1810]">{q}</span>
        <Icon icon="ph:caret-down-bold" className={`faq-chevron text-[#9c8b7e] text-xl flex-shrink-0 ${open ? 'rotated' : ''}`} />
      </button>
      <div className={`faq-answer px-5 ${open ? 'open' : ''}`}>
        <p className="text-[15px] text-[#6b5c50] leading-relaxed pb-5">{a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const headRef = useReveal()
  const listRef = useReveal()

  return (
    <section id="faq" className="relative py-24 md:py-32 bg-[#FDF8F3]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200/50 bg-orange-50/50 mb-6">
            <Icon icon="ph:chat-circle-text-bold" className="text-orange-600 text-[15px]" />
            <span className="text-[12px] font-medium text-orange-700 uppercase tracking-widest">Questions</span>
          </div>
          <h2 className="font-oswald text-3xl md:text-[2.75rem] font-500 uppercase leading-[.9] tracking-tight text-[#2C1810]">FAQ</h2>
        </div>
        <div ref={listRef} className="space-y-3 reveal">
          {FAQS.map(f => <FaqItem key={f.q} {...f} />)}
        </div>
      </div>
    </section>
  )
}
