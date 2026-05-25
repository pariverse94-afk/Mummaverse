import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'
import placeholderImg from '../assets/nutrition2.png'
import choreLonelinessImg from '../assets/chore_loneliness.png'
import villageSupportImg from '../assets/village support.png'


const PROBLEMS = [
  {
    img: '/mental_load_stress_1778434639310.png',
    alt: 'A cinematic portrait of a modern Indian woman looking thoughtful and slightly overwhelmed in a stylish home office.',
    title: 'The Invisible Mental Load',
    desc: 'Remembering what is in the fridge, whose uniform needs ironing, when the milk runs out - this constant checklist never turns off.',
  },
  {
    img: '/meal_planning_modern_kitchen_1778435040106.png',
    alt: 'A premium, cinematic shot of a woman in a modern Indian kitchen, planning meals while looking at her phone.',
    title: 'Meal Planning Exhaustion',
    desc: '"Aaj kya banau?" - asked every single day. Planning balanced meals everyone eats is a full-time job nobody pays you for.',
    delay: '.08s',
  },
  {
    img: '/late_night_care_child_1778435058692.png',
    alt: 'A cinematic, low-light shot of a mother checking her child’s temperature at night with a worried but calm expression.',
    title: 'Panic at 2 AM',
    desc: 'Child gets a fever. You Google. Ten different answers. No quick, reliable first aid built for Indian homes.',
    delay: '.16s',
  },
  {
    img: placeholderImg,
    alt: 'Placeholder image for nutrition',
    title: 'Nutrition Blind Spots',
    desc: 'Is your child getting enough iron? Is your husband skipping proteins? Are you eating at all? Without tracking, you are guessing.',
    delay: '.24s',
  },
  {
    img: choreLonelinessImg,
    alt: 'A cinematic shot representing the isolation and scale of household chores in nuclear families.',
    title: 'Chore Loneliness',
    desc: 'In a nuclear family, you cannot ask your sister-in-law to watch the kids. There is no one to share the load with.',
    delay: '.32s',
  },
  {
    img: villageSupportImg,
    alt: 'A cinematic shot of modern Indian women connecting and supporting each other.',
    title: 'No Village, No Support',
    desc: '"It takes a village" is not just cute - it is biology. You need other moms who have been through what you are going through.',
    delay: '.4s',
  },
]

function ProblemCard({ img, alt, title, desc, delay }) {
  const ref = useReveal()
  return (
    <article ref={ref} className="problem-card rounded-2xl p-6 md:p-7 reveal" style={delay ? { transitionDelay: delay } : {}}>
      <div className="rounded-xl overflow-hidden h-44 mb-5">
        <img src={img} alt={alt} className="w-full h-full object-cover block" loading="lazy" />
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
          <h2 className="font-oswald text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-500 uppercase leading-[.9] tracking-tight mb-6 text-[#2C1810]">
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
