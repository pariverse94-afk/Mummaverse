import { useState } from 'react'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Problem from './components/Problem'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Village from './components/Village'
import Chores from './components/Chores'
import Blog from './components/Blog'
import Ecosystem from './components/Ecosystem'
import Testimonial from './components/Testimonial'
import FAQ from './components/FAQ'
import Waitlist from './components/Waitlist'
import Footer from './components/Footer'
import ArticleOverlay from './components/ArticleOverlay'

export default function App() {
  const [articleId, setArticleId] = useState<number | null>(null)

  const openArticle = (id: number) => {
    setArticleId(id)
    document.body.style.overflow = 'hidden'
    document.getElementById('article-overlay')?.scrollTo(0, 0)
  }

  const closeArticle = () => {
    setArticleId(null)
    document.body.style.overflow = ''
  }

  return (
    <ThemeProvider>
      <Navbar onLogoClick={closeArticle} />
      <main id="main-page">
        <Hero />
        <Stats />
        <Problem />
        <Features />
        <HowItWorks />
        <Village />
        <Chores />
        <Blog onOpenArticle={openArticle} />
        <Ecosystem />
        <Testimonial />
        <FAQ />
        <Waitlist />
        <Footer />
      </main>
      <ArticleOverlay articleId={articleId} onClose={closeArticle} />
    </ThemeProvider>
  )
}
