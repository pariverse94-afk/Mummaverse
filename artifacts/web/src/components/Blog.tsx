import { Icon } from '@iconify/react'
import { useReveal } from '../hooks/useReveal'
import { ARTICLES, Article } from '../data/articles'

function ArticleIllustration({ article }: { article: Article }) {
  return (
    <div
      className="w-full h-full relative overflow-hidden flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${article.gradientFrom}, ${article.gradientTo})` }}
    >
      {/* Decorative rings */}
      {[0, 1].map(i => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 80 + i * 70,
            height: 80 + i * 70,
            border: `1px solid ${article.iconColor}20`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `ringPulse ${2.5 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
      {/* Central icon */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: `linear-gradient(135deg, ${article.iconColor}80, ${article.iconColor})` }}
        >
          <Icon icon={article.icon} className="text-white text-2xl" />
        </div>
        <div className="px-3 py-1 rounded-full text-[11px] font-semibold" style={{ background: `${article.iconColor}15`, color: article.iconColor }}>
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
        <div className="h-[220px] md:h-[280px] overflow-hidden blog-img">
          <ArticleIllustration article={article} />
        </div>
        <div className="p-6 md:p-8 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-[11px] uppercase tracking-widest ${categoryColor} font-medium`}>{category}</span>
            <span className="text-[11px] text-[#9c8b7e]">-</span>
            <time className="text-[11px] text-[#9c8b7e]">{date}</time>
            <span className="text-[11px] text-[#9c8b7e]">-</span>
            <span className="text-[11px] text-[#9c8b7e]">{readTime}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-medium uppercase tracking-tight mb-3 leading-tight text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>{title}</h3>
          <p className="text-[15px] text-[#6b5c50] leading-relaxed">{summary}</p>
        </div>
      </article>
    )
  }

  return (
    <article ref={ref} className="blog-card rounded-2xl reveal" style={delay ? { transitionDelay: delay } : {}} onClick={onOpen}>
      <div className="h-[180px] overflow-hidden blog-img">
        <ArticleIllustration article={article} />
      </div>
      <div className="p-5 bg-white">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-[11px] uppercase tracking-widest ${categoryColor} font-medium`}>{category}</span>
          <span className="text-[11px] text-[#9c8b7e]">-</span>
          <time className="text-[11px] text-[#9c8b7e]">{date}</time>
        </div>
        <h3 className="text-lg font-medium uppercase tracking-tight mb-2 leading-tight text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>{title}</h3>
        <p className="text-[14px] text-[#8B7355] leading-relaxed">{summary}</p>
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
