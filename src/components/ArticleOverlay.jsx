import { Icon } from '@iconify/react'
import { ARTICLES } from '../data/articles'

const WAITLIST_URL = 'https://forms.gle/DEMO-REPLACE-THIS-LINK'

export default function ArticleOverlay({ articleId, onClose }) {
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
            <img src={article.img} alt={article.alt} className="w-full h-full object-cover block" />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className={`text-[11px] uppercase tracking-widest ${article.categoryColor} font-medium`}>{article.category}</span>
            <span className="text-[11px] text-[#9c8b7e]">-</span>
            <time className="text-[11px] text-[#9c8b7e]">{article.date}</time>
            <span className="text-[11px] text-[#9c8b7e]">-</span>
            <span className="text-[11px] text-[#9c8b7e]">{article.readTime} read</span>
          </div>

          <h1 className="font-oswald text-2xl md:text-3xl lg:text-4xl font-500 uppercase leading-[.95] tracking-tight mb-6 text-[#2C1810]">
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
