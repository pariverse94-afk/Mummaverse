import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'

const IMAGES = [
  { url: 'https://images.unsplash.com/photo-1594910413528-944510d54023?w=400&h=520&fit=crop&auto=format&q=80', alt: 'A premium, cinematic shot of modern Indian women laughing and supporting each other.', mt: '' },
  { url: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=400&h=520&fit=crop&auto=format&q=80', alt: 'A cinematic shot of a modern Indian home, highlighting warmth and connection.', mt: 'mt-6' },
  { url: 'https://images.unsplash.com/photo-1578496780896-7081cc23c111?w=400&h=520&fit=crop&auto=format&q=80', alt: 'A modern Indian family in a cozy, authentic home setting.', mt: '-mt-6' },
  { url: 'https://images.unsplash.com/photo-1632848171114-af1763e5bd78?w=400&h=520&fit=crop&auto=format&q=80', alt: 'A cinematic shot of a modern Indian mother staying connected and supported.', mt: 'mt-6' },
]

export default function Village() {
  const gridRef = useReveal()
  const textRef = useReveal()

  return (
    <section id="village" className="relative py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div ref={gridRef} className="reveal order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              {IMAGES.map(({ url, alt, mt }) => (
                <div key={url} className={`rounded-2xl overflow-hidden h-64 ${mt}`}>
                  <img
                    src={url}
                    alt={alt}
                    className="w-full h-full object-cover block"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <div ref={textRef} className="reveal order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200/50 bg-orange-50/50 mb-6">
              <Icon icon="ph:heart-bold" className="text-orange-600 text-[15px]" />
              <span className="text-[12px] font-medium text-orange-700 uppercase tracking-widest">The Village</span>
            </div>
            <h2 className="font-oswald text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-500 uppercase leading-[.9] tracking-tight mb-6 text-[#2C1810]">
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
