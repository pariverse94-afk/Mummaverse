import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'
import { ARTICLES, Article } from '../data/articles'

function ArticleIllustration({ article }: { article: Article }) {
  return (
    <div
      className="w-full h-full relative overflow-hidden flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${article.gradientFrom}, ${article.gradientTo})` }}
    >
      {/* Decorative rings — 3 layers */}
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 70 + i * 65,
            height: 70 + i * 65,
            border: `1px solid ${article.iconColor}${i === 0 ? '35' : i === 1 ? '22' : '12'}`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `ringPulse ${2.2 + i * 0.6}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      {/* Floating accent dots */}
      {[
        { top: '18%', left: '15%', size: 6, delay: '0s' },
        { top: '70%', left: '80%', size: 5, delay: '1.2s' },
        { top: '75%', left: '18%', size: 4, delay: '0.7s' },
        { top: '20%', left: '78%', size: 7, delay: '1.8s' },
      ].map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full float-slow"
          style={{
            width: dot.size,
            height: dot.size,
            background: `${article.iconColor}50`,
            top: dot.top,
            left: dot.left,
            animationDelay: dot.delay,
          }}
        />
      ))}

      {/* Central icon */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div
          className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center shadow-xl"
          style={{ background: `linear-gradient(135deg, ${article.iconColor}90, ${article.iconColor})` }}
        >
          <Icon icon={article.icon} className="text-white text-[32px]" />
        </div>
        <div
          className="px-4 py-1.5 rounded-full text-[13px] font-semibold backdrop-blur-sm"
          style={{ background: `${article.iconColor}18`, color: article.iconColor, border: `1px solid ${article.iconColor}30` }}
        >
          {article.category}
        </div>
      </div>
    </div>
  )
}

function BlogCard({ article, onOpen, delay, large }: { article: Article; onOpen: () => void; delay?: string; large?: boolean }) {
  const ref = useReveal()
  const { category, categoryColor, date, readTime, title, summary } = article

  if (large) {
    return (
      <article ref={ref} className="blog-card rounded-2xl sm:col-span-2 lg:col-span-2 reveal" style={delay ? { transitionDelay: delay } : {}} onClick={onOpen}>
        <div className="h-[240px] md:h-[300px] overflow-hidden blog-img">
          <ArticleIllustration article={article} />
        </div>
        <div className="p-6 md:p-8 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-[13px] uppercase tracking-widest ${categoryColor} font-semibold`}>{category}</span>
            <span className="text-[13px] text-[#9c8b7e]">-</span>
            <time className="text-[13px] text-[#9c8b7e]">{date}</time>
            <span className="text-[13px] text-[#9c8b7e]">-</span>
            <span className="text-[13px] text-[#9c8b7e]">{readTime} read</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-medium uppercase tracking-tight mb-4 leading-tight text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>{title}</h3>
          <p className="text-[17px] text-[#6b5c50] leading-relaxed">{summary}</p>
        </div>
      </article>
    )
  }

  return (
    <article ref={ref} className="blog-card rounded-2xl reveal" style={delay ? { transitionDelay: delay } : {}} onClick={onOpen}>
      <div className="h-[200px] overflow-hidden blog-img">
        <ArticleIllustration article={article} />
      </div>
      <div className="p-5 bg-white">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-[13px] uppercase tracking-widest ${categoryColor} font-semibold`}>{category}</span>
          <span className="text-[13px] text-[#9c8b7e]">-</span>
          <time className="text-[13px] text-[#9c8b7e]">{date}</time>
        </div>
        <h3 className="text-xl font-medium uppercase tracking-tight mb-3 leading-tight text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>{title}</h3>
        <p className="text-[15px] text-[#6b5c50] leading-relaxed">{summary}</p>
      </div>
    </article>
  )
}

export default function Blog({ onOpenArticle }: { onOpenArticle: (id: number) => void }) {
  const headRef = useReveal()

  return (
    <section id="blog" className="relative py-24 md:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="mb-12 md:mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200/50 bg-orange-50/50 mb-6">
            <Icon icon="ph:article-bold" className="text-orange-600 text-[15px]" />
            <span className="text-[12px] font-medium text-orange-700 uppercase tracking-widest">From the Blog</span>
          </div>
          <h2 className="text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-medium uppercase leading-[.9] tracking-tight text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Real Talk. <span className="text-orange-600">Real Help.</span>
          </h2>
          <p className="text-[17px] text-[#6b5c50] mt-3 max-w-lg">Honest, research-backed articles for Indian moms. Click any article to read the full piece.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard article={ARTICLES[0]} onOpen={() => onOpenArticle(1)} large />
          {ARTICLES.slice(1).map((a, i) => (
            <BlogCard key={a.id} article={a} onOpen={() => onOpenArticle(a.id)} delay={`${(i + 1) * 0.05}s`} />
          ))}
        </div>
      </div>
    </section>
  )
}
