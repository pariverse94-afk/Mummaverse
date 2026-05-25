import { Icon } from '@iconify/react'
import { ARTICLES, Article } from '../data/articles'

const WAITLIST_URL = 'https://forms.gle/DEMO-REPLACE-THIS-LINK'

function ArticleHeroIllustration({ article }: { article: Article }) {
  return (
    <div
      className="w-full h-full relative overflow-hidden flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${article.gradientFrom}, ${article.gradientTo})` }}
    >
      {/* Decorative rings */}
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 100 + i * 90,
            height: 100 + i * 90,
            border: `1px solid ${article.iconColor}20`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `ringPulse ${2.5 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
      {/* SVG dots scattered */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 720 300" fill="none">
        {[
          { cx: 60, cy: 40, r: 3 }, { cx: 660, cy: 60, r: 2 },
          { cx: 680, cy: 220, r: 4 }, { cx: 40, cy: 240, r: 2.5 },
          { cx: 360, cy: 20, r: 2 }, { cx: 540, cy: 260, r: 3 },
        ].map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={`${article.iconColor}50`}
            style={{ animation: `particleDrift ${4 + i}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }} />
        ))}
      </svg>
      {/* Central icon */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl"
          style={{ background: `linear-gradient(135deg, ${article.iconColor}90, ${article.iconColor})` }}
        >
          <Icon icon={article.icon} className="text-white" style={{ fontSize: 36 }} />
        </div>
        <div className="px-4 py-1.5 rounded-full text-[12px] font-semibold" style={{ background: `${article.iconColor}15`, color: article.iconColor, border: `1px solid ${article.iconColor}25` }}>
          {article.category}
        </div>
      </div>
    </div>
  )
}

export default function ArticleOverlay({ articleId, onClose }: { articleId: number | null; onClose: () => void }) {
  const article = ARTICLES.find(a => a.id === articleId)
  const isOpen = !!article

  return (
    <div className={`article-overlay ${isOpen ? 'open' : ''}`} id="article-overlay">
      {article && (
        <div className="ai">
          <button onClick={onClose} className="flex items-center gap-2 text-[15px] text-[#8B7355] hover:text-[#2C1810] transition-colors mb-8 mt-4">
            <Icon icon="ph:arrow-left-bold" className="text-orange-600" />
            Back to all posts
          </button>

          <div className="rounded-2xl overflow-hidden h-[240px] md:h-[300px] mb-8">
            <ArticleHeroIllustration article={article} />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className={`text-[11px] uppercase tracking-widest ${article.categoryColor} font-medium`}>{article.category}</span>
            <span className="text-[11px] text-[#9c8b7e]">-</span>
            <time className="text-[11px] text-[#9c8b7e]">{article.date}</time>
            <span className="text-[11px] text-[#9c8b7e]">-</span>
            <span className="text-[11px] text-[#9c8b7e]">{article.readTime} read</span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium uppercase leading-[.95] tracking-tight mb-6 text-[#2C1810]" style={{ fontFamily: "'Oswald', sans-serif" }}>
            {article.title}
          </h1>

          <div dangerouslySetInnerHTML={{ __html: article.content }} />

          <div className={`mt-10 p-6 rounded-xl ${article.ctaBg} border text-center`}>
            <p className="text-[15px] text-[#4A3728] mb-4">{article.ctaText}</p>
            <a href={WAITLIST_URL} target="_blank" rel="noreferrer" onClick={onClose} className="btn-primary text-[15px] font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2">
              Join the Waitlist <Icon icon="ph:arrow-up-right-bold" className="text-base" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
