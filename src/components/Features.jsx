import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'
import nutritionImg from '../assets/nutritious_meal.png'
import firstAidImg from '../assets/first_Aid_image.png'
const FEATURES = [
  {
    img: 'https://images.unsplash.com/photo-1742281257687-092746ad6021?w=700&h=400&fit=crop&auto=format&q=80',
    alt: 'A premium, cinematic shot of a modern Indian thali, illustrating organized and nutritious meal planning.',
    iconBg: 'bg-amber-50 border-amber-200/50',
    icon: 'ph:cooking-pot-bold',
    iconColor: 'text-amber-600',
    tagColor: 'text-orange-600',
    tag: 'Never ask "aaj kya banau" again',
    title: 'Meal Planning',
    desc: 'Weekly Indian meal plans built around your family preferences. Auto-generates shopping lists sorted by section.',
    checkColor: 'text-amber-600',
    items: ['Seasonal ingredient suggestions', 'Leftover recycling recipes', 'Smart grocery list by aisle', 'Festival menus'],
    delay: undefined,
  },
  {
    img: nutritionImg,
    alt: 'A cinematic shot of nutritious Indian dishes, representing comprehensive family health tracking.',
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
    img: firstAidImg,
    alt: 'A cinematic shot of a mother providing care, representing reliable and doctor-reviewed first aid.',
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
    img: 'https://images.unsplash.com/photo-1571210862729-78a52d3779a2?w=700&h=400&fit=crop&auto=format&q=80',
    alt: 'A cinematic shot of modern Indian women connecting, representing the digital village community.',
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

function FeatureCard({ img, alt, iconBg, icon, iconColor, tagColor, tag, title, desc, checkColor, items, delay }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="feature-card rounded-2xl overflow-hidden reveal" style={delay ? { transitionDelay: delay } : {}}>
      <div className="h-48 md:h-56 overflow-hidden">
        <img src={img} alt={alt} className="w-full h-full object-contain block" loading="lazy" />
      </div>
      <div className="p-7 md:p-8">
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-12 h-12 rounded-xl ${iconBg} border flex items-center justify-center flex-shrink-0`}>
            <Icon icon={icon} className={`${iconColor} text-xl`} />
          </div>
          <div>
            <h3 className="font-oswald text-xl md:text-2xl font-500 uppercase tracking-tight mb-1 text-[#2C1810]">{title}</h3>
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
    <section id="features" className="relative py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="text-center mb-16 md:mb-20 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200/50 bg-orange-50/50 mb-6">
            <Icon icon="ph:sparkle-bold" className="text-orange-600 text-[15px]" />
            <span className="text-[12px] font-medium text-orange-700 uppercase tracking-widest">What Pariverse Does</span>
          </div>
          <h2 className="font-oswald text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-500 uppercase leading-[.9] tracking-tight mb-4 text-[#2C1810]">
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
