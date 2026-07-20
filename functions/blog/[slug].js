import { getPost, listPosts, renderMarkdown, escapeHtml, html } from '../_lib.js';
import { page, SITE, endcap } from '../_layout.js';

// GET /blog/:slug — one server-rendered post per URL, so each is indexable on its own
export async function onRequestGet(context) {
  const { slug } = context.params;
  const post = await getPost(context.env, slug);

  if (!post || post.published === false) {
    return html(page({
      title: 'Post not found — Mummaverse',
      description: 'That post has moved or never existed.',
      canonical: `${SITE.origin}/blog/${slug}`,
      body: `<main class="wrap" style="padding:80px 24px;">
        <div class="eyebrow">404</div>
        <h1 style="font-size:44px; letter-spacing:-.025em; margin:14px 0 12px;">That post isn't here.</h1>
        <p style="font-size:18px; color:#5c4636;">It may have been renamed or unpublished.</p>
        <p style="margin-top:28px;"><a class="cta" href="/blog/">See all posts</a></p>
      </main>`,
    }), 404);
  }

  const others = (await listPosts(context.env)).filter(p => p.slug !== slug).slice(0, 3);
  const more = others.length ? `
    <section style="margin-top:64px;">
      <div class="eyebrow">KEEP READING</div>
      <div class="grid" style="margin-top:18px;">
        ${others.map(p => `
          <a class="glass" href="/blog/${escapeHtml(p.slug)}" style="padding:22px;">
            <div class="pill" style="margin-bottom:12px;">${escapeHtml(p.tag || 'NOTES')}</div>
            <div style="font-weight:700; font-size:17px; line-height:1.3;">${escapeHtml(p.title)}</div>
            <div class="meta" style="margin-top:10px;">${escapeHtml(p.date || '')} &middot; ${escapeHtml(String(p.mins || 4))} min read</div>
          </a>`).join('')}
      </div>
    </section>` : '';

  const body = `
  <main class="wrap" style="padding-top:48px;">
    <p style="margin:0 0 24px;"><a href="/blog/">← All posts</a></p>
    <article>
      <div class="eyebrow">${escapeHtml(post.tag || 'NOTES')}</div>
      <h1>${escapeHtml(post.title)}</h1>
      <p class="meta" style="margin:0 0 8px;">${escapeHtml(post.date || '')} &middot; ${escapeHtml(String(post.mins || 4))} min read</p>
      ${post.excerpt ? `<p style="font-size:21px; line-height:1.55; color:#5c4636; margin:20px 0 0;">${escapeHtml(post.excerpt)}</p>` : ''}
      <hr style="border:none; border-top:1px solid #e6d7c4; margin:32px 0;">
      ${renderMarkdown(post.body)}
    </article>
    ${endcap()}
    ${more}
  </main>`;

  return html(page({
    title: `${post.title} — Mummaverse`,
    description: post.excerpt || post.title,
    canonical: `${SITE.origin}/blog/${post.slug}`,
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt || '',
      datePublished: post.date,
      dateModified: (post.updatedAt || '').slice(0, 10) || post.date,
      mainEntityOfPage: `${SITE.origin}/blog/${post.slug}`,
      author: { '@type': 'Organization', name: 'Pariverse' },
      publisher: { '@type': 'Organization', name: 'Pariverse', url: SITE.origin + '/' },
    },
  }), 200, { 'Cache-Control': 'public, max-age=60' });
}
