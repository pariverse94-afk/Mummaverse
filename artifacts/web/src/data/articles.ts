export interface Article {
  id: number
  category: string
  categoryColor: string
  date: string
  readTime: string
  icon: string
  iconColor: string
  gradientFrom: string
  gradientTo: string
  alt: string
  title: string
  summary: string
  ctaBg: string
  ctaText: string
  content: string
}

export const ARTICLES: Article[] = [
  {
    id: 1,
    category: 'Mental Load',
    categoryColor: 'text-orange-600',
    date: 'June 10, 2025',
    readTime: '8 min',
    icon: 'ph:brain-bold',
    iconColor: '#ea580c',
    gradientFrom: '#FFF3E8',
    gradientTo: '#FFE4C8',
    alt: 'Mental load illustration',
    title: 'Why Indian Moms Carry 95% of the Mental Load',
    summary: 'Research shows Indian mothers shoulder an overwhelming share of invisible household management. Here is the data and five steps to redistribute it.',
    ctaBg: 'bg-orange-50/30 border-orange-200/30',
    ctaText: 'Want to see how Pariverse makes mental load visible?',
    content: `
      <p>If you have ever woken up at 3 AM thinking about whether you bought enough milk, or felt anxiety because you cannot remember if you switched off the gas - you already know what mental load is.</p>
      <h2>What Exactly Is Mental Load?</h2>
      <p>Mental load is the invisible work of managing a household. It is not the physical act of cooking - it is the mental process of deciding what to cook, checking ingredients, remembering who does not eat onions, adjusting for a school trip tomorrow. It is planning, anticipating, remembering, and adjusting - constantly, endlessly, without recognition.</p>
      <p>A 2019 study found that women shoulder significantly more cognitive household labour than men - even in dual-income households. In India, where gender role norms are stronger and joint family support is eroding, this gap is even wider.</p>
      <h2>Why It Is Worse for Indian Nuclear Families</h2>
      <p>In a joint family, mental load was distributed. Your mother-in-law remembered puja items. Your sister-in-law tracked homework. In a nuclear family, all of that lands on one person - almost always the mother.</p>
      <ul>
        <li><strong>Meal management:</strong> Planning three meals for 3-5 people with different preferences, seasonal ingredients, festival fasting days.</li>
        <li><strong>Health monitoring:</strong> Doctor appointments, medicine refills, vaccination schedules, blood pressure checks.</li>
        <li><strong>School logistics:</strong> Exam schedules, permission slips, sports day vs annual day, uniform prep, bag packing.</li>
        <li><strong>Social obligations:</strong> Birthdays, festival gifting, neighbour relations, maintaining family ties.</li>
        <li><strong>Household maintenance:</strong> Water purifier filters, deep cleaning, AC servicing, maid coordination.</li>
      </ul>
      <p>None of this shows up on a to-do list. None of it gets "done" in a visible way. That is what makes it so exhausting.</p>
      <h2>The Data</h2>
      <p>A 2023 survey found 78% of urban Indian moms reported being the sole household planner. 64% could not remember the last day they did not think about household tasks. 52% said their partner was unaware of the mental load they carried.</p>
      <h2>Five Steps to Redistribute</h2>
      <h3>1. Name It</h3>
      <p>Say: "The work is not doing the dishes. The work is knowing the dishes need to be done, when, and whether detergent exists."</p>
      <h3>2. Make It Visible</h3>
      <p>Write down everything you manage mentally for one week. The list will shock both of you.</p>
      <h3>3. Divide by Category, Not Task</h3>
      <p>Assign "own all things laundry - detergent to folding to dry-clean items." That is the whole mental load for that category.</p>
      <h3>4. Use a Tool</h3>
      <p>Pariverse creates visual boards, reminders, and a weekly fairness check showing whether the load is balanced.</p>
      <h3>5. Accept Imperfection</h3>
      <p>The rice might be overcooked. Let it go. A badly-done chore by someone else is still one less chore for you.</p>
      <h2>Final Word</h2>
      <p>Carrying 95% of the mental load does not make you a supermom. It makes you an unsupported mom. You deserve tools and a partner who shares the invisible work - not because you cannot handle it, but because you were never supposed to handle it alone.</p>
    `,
  },
  {
    id: 2,
    category: 'Meal Planning',
    categoryColor: 'text-amber-600',
    date: 'June 5, 2025',
    readTime: '7 min',
    icon: 'ph:cooking-pot-bold',
    iconColor: '#d97706',
    gradientFrom: '#FFFBEB',
    gradientTo: '#FEF3C7',
    alt: 'Meal planning illustration',
    title: 'Aaj Kya Banau? End the Daily Struggle',
    summary: 'Decision fatigue by 6 PM is real. This five-step Sunday system ends the "aaj kya banau" spiral and cuts daily cooking stress in half.',
    ctaBg: 'bg-orange-50/30 border-orange-200/30',
    ctaText: 'Let Pariverse handle "aaj kya banau" for you.',
    content: `
      <p>"Aaj kya banau" is not about food. It is about decision fatigue. By 6 PM you have already made fifty decisions. This one - what four people will eat, whether it is nutritious, whether anyone will complain - feels like the heaviest.</p>
      <h2>The Weekly System</h2>
      <h3>Step 1: Take Inventory (5 min)</h3>
      <p>Open fridge and pantry. Write what you have.</p>
      <h3>Step 2: Pick Backbone (5 min)</h3>
      <p>Plan dal + sabzi combos: Monday (moong dal + aloo gobi), Tuesday (rajma + bhindi), Wednesday (toor dal + palak paneer).</p>
      <h3>Step 3: Fill Breakfast (5 min)</h3>
      <p>Rotate 5-7 standards: poha, upma, paratha, idli, oats, eggs, toast.</p>
      <h3>Step 4: Grocery List (10 min)</h3>
      <p>Compare plan against inventory. Write missing items sorted by store section.</p>
      <h3>Step 5: Prep Night Before (5 min)</h3>
      <p>Soak dal, chop vegetables. Cuts cooking time 30-40%.</p>
      <h2>How Pariverse Does This</h2>
      <p>Enter preferences once. Pariverse generates weekly plans, auto-generates grocery lists, suggests leftover recycling. Swap with one tap.</p>
    `,
  },
  {
    id: 3,
    category: 'First Aid',
    categoryColor: 'text-blue-600',
    date: 'May 28, 2025',
    readTime: '9 min',
    icon: 'ph:first-aid-kit-bold',
    iconColor: '#2563eb',
    gradientFrom: '#EFF6FF',
    gradientTo: '#DBEAFE',
    alt: 'First aid illustration',
    title: 'First Aid at Home: What Every Mom Should Know',
    summary: 'Burns, fevers, choking, head bumps — a doctor-reviewed Indian home guide so you never have to Google at 2 AM again.',
    ctaBg: 'bg-blue-50/30 border-blue-200/30',
    ctaText: 'No more Googling at 2 AM.',
    content: `
      <p>Your 4-year-old wakes up at 11 PM with 102F fever. You Google and get conflicting results. This happens in thousands of Indian homes every night.</p>
      <p><strong>Disclaimer: First-response guidance, not medical advice.</strong></p>
      <h2>Top 6 Emergencies</h2>
      <h3>1. Kitchen Burns</h3>
      <p>Cool water 10-20 min. No toothpaste, turmeric, butter, or oil. Clean dressing. See doctor if larger than a coin, on face, or blistering.</p>
      <h3>2. Child Fever Below 103F</h3>
      <p>Paracetamol by weight. Hydrate with ORS. Dress lightly. <strong>Red flags:</strong> above 103F not responding, lasting 3+ days, unusual drowsiness.</p>
      <h3>3. Cuts</h3>
      <p>Running water (not dettol directly). Pressure with clean cloth. Povidone-iodine + band-aid. <strong>Red flags:</strong> bleeding 10+ min pressure, deep cut.</p>
      <h3>4. Choking</h3>
      <p>If coughing, let them. If not: face-down, 5 back blows between shoulder blades. Call emergency if no improvement.</p>
      <h3>5. Head Bump</h3>
      <p>Ice pack in cloth, 10 min. Observe 24 hrs. <strong>Red flags:</strong> unconsciousness, repeated vomiting, unequal pupils.</p>
      <h3>6. Mosquito Bites</h3>
      <p>Soap + calamine. Fever + body aches 2-7 days after bite = dengue test immediately.</p>
      <h2>Your Kit</h2>
      <ul>
        <li>Paracetamol syrup + tablets</li>
        <li>ORS packets</li>
        <li>Povidone-iodine, band-aids, gauze</li>
        <li>Digital thermometer</li>
        <li>Scissors, tweezers</li>
        <li>Burnol, antihistamine</li>
        <li>Doctor + hospital contact card</li>
      </ul>
    `,
  },
  {
    id: 4,
    category: 'Nutrition',
    categoryColor: 'text-emerald-600',
    date: 'May 20, 2025',
    readTime: '6 min',
    icon: 'ph:leaf-bold',
    iconColor: '#059669',
    gradientFrom: '#ECFDF5',
    gradientTo: '#D1FAE5',
    alt: 'Nutrition illustration',
    title: "Your Child's Nutrition: The Gaps No One Talks About",
    summary: '"My child eats well" can still mean iron, vitamin D, calcium or B12 deficiency. Here are the signs to spot and the simple kitchen fixes.',
    ctaBg: 'bg-emerald-50/30 border-emerald-200/30',
    ctaText: 'Know what your family eats - without obsessing.',
    content: `
      <p>"My child eats well" is dangerous. Your child might finish roti but still be deficient in iron, calcium, vitamin D, or B12.</p>
      <h2>The Big Four</h2>
      <h3>1. Iron (50%+ Indian Kids)</h3>
      <p>Signs: tiredness, pale lower eyelids, frequent infections. Fix: iron foods (spinach, jaggery, ragi) + vitamin C (lemon, amla). Avoid tea/milk with iron meals.</p>
      <h3>2. Vitamin D (70-90%)</h3>
      <p>Despite sunshine, urban kids are severely deficient. Fix: 15-20 min morning sun. Fortified milk. Ask paediatrician about supplementation.</p>
      <h3>3. Calcium</h3>
      <p>Milk only has ~300mg (need 600-1000mg). Fix: ragi, sesame, curd, paneer, almonds.</p>
      <h3>4. B12 (Vegetarian Families)</h3>
      <p>Signs: tingling, memory issues, fatigue. Fix: daily dairy. Fortified cereals. B12 blood test if symptoms.</p>
      <h2>How Pariverse Helps</h2>
      <p>Not obsessive tracking - gentle awareness. "Iron was low this week, here are three dishes to fix it."</p>
    `,
  },
  {
    id: 5,
    category: 'Mental Health',
    categoryColor: 'text-purple-600',
    date: 'May 15, 2025',
    readTime: '7 min',
    icon: 'ph:heart-bold',
    iconColor: '#9333ea',
    gradientFrom: '#FAF5FF',
    gradientTo: '#EDE9FE',
    alt: 'Mental health illustration',
    title: 'Nuclear Family Guilt: Why You Feel Like Failing',
    summary: 'That constant feeling of not doing enough — it is not a personal failure. It is a structural problem. Here is why, and what actually helps.',
    ctaBg: 'bg-purple-50/30 border-purple-200/30',
    ctaText: 'You deserve systems that support you, not guilt that drains you.',
    content: `
      <p>Seen a mom posting organic snacks on Instagram and felt inadequate? This is for you.</p>
      <h2>What It Actually Is</h2>
      <p>A cocktail: not doing enough for your child, your in-laws, not earning enough if home or not present enough if working, house not clean enough, meals not healthy enough. The belief that if you tried harder, you could manage everything perfectly.</p>
      <h2>The Structural Problem</h2>
      <p>In a joint family, emotional labour was shared. A crying baby was handed to three people. In a nuclear family, that entire load lands on one person. Society still judges by joint-family standards while removing the infrastructure that made those standards achievable.</p>
      <h2>The Guilt Traps</h2>
      <h3>"I should cook from scratch"</h3>
      <p>In a joint family, three women cooked together. Pre-cut vegetables and ready-made rotis are not failure - it is resource management.</p>
      <h3>"I should spend more time with my child"</h3>
      <p>30 minutes of fully present, phone-free playtime beats 3 hours of distracted, guilty presence.</p>
      <h3>"My house should always be clean"</h3>
      <p>A lived-in house with a happy mom beats a spotless house with an exhausted one.</p>
      <h3>"I should handle this alone"</h3>
      <p>Your grandmother was not self-sufficient. She had support. You deserve support too - your partner, tools like Pariverse, or a community of moms.</p>
      <h2>Final Thought</h2>
      <p>The guilt is not because you are inadequate. It is because you are adequate in an inadequate system. You are doing the job of three people with recognition of zero.</p>
    `,
  },
]
