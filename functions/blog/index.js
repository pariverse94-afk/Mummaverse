import { listPosts, escapeHtml, html } from '../_lib.js';
import { page, SITE, endcap } from '../_layout.js';

// GET /blog/ — the index, rendered on the server so crawlers see real HTML
export async function onRequestGet(context) {
  const posts = await listPosts(context.env);

  const cards = posts.length ? posts.map(p => `
    <a class="glass" href="/blog/${escapeHtml(p.slug)}">
      <div class="cover" style="background:radial-gradient(ellipse 260px 160px at 40% 25%, ${escapeHtml(p.blobColor || '#d97a34')}44, transparent 70%), linear-gradient(160deg,#f6e6d6,#efdcc6); position:relative;">
        <span style="position:absolute; top:14px; left:14px; z-index:1;" class="pill">${escapeHtml(p.tag || 'NOTES')}</span>
        ${p.hasImage
          ? `<img src="/api/image/${escapeHtml(p.slug)}" alt="" loading="lazy" style="width:100%; height:100%; object-fit:cover;">`
          : `<span>${escapeHtml(p.emoji || '📝')}</span>`}
      </div>
      <div style="padding:22px 22px 24px;">
        <div style="font-weight:700; font-size:19px; line-height:1.3; margin-bottom:10px;">${escapeHtml(p.title)}</div>
        <div style="font-size:14px; line-height:1.55; color:#5c4636; margin-bottom:16px;">${escapeHtml(p.excerpt || '')}</div>
        <div class="meta">${escapeHtml(p.date || '')} &middot; ${escapeHtml(String(p.mins || 4))} min read</div>
      </div>
    </a>`).join('') : `
    <div class="glass" style="padding:36px; grid-column:1/-1;">
      <p style="margin:0; color:#5c4636;">No posts yet. Write the first one in the <a href="/admin/">editor</a>.</p>
    </div>`;

  const body = `
  <main class="wrap wide" style="padding-top:56px;">
    <div class="eyebrow">SHARING THE MENTAL LOAD</div>
    <h1 style="font-size:56px; line-height:1.05; letter-spacing:-0.025em; margin:14px 0 12px;">THE MUMMAVERSE BLOG</h1>
    <p style="font-size:18px; color:#5c4636; max-width:60ch; margin:0 0 40px;">On the mental load, splitting chores without starting a war, and running an Indian home without one person carrying all of it.</p>
    <div class="grid">${cards}</div>
    ${endcap()}
  </main>`;

  return html(page({
    title: 'The Mummaverse Blog — Notes on the Mental Load',
    description: 'Essays on the mental load, fair chore splits and running an Indian home without one person carrying all of it.',
    canonical: SITE.origin + '/blog/',
    ogType: 'website',
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'The Mummaverse Blog',
      url: SITE.origin + '/blog/',
      blogPost: posts.slice(0, 20).map(p => ({
        '@type': 'BlogPosting',
        headline: p.title,
        datePublished: p.date,
        url: `${SITE.origin}/blog/${p.slug}`,
      })),
    },
  }), 200, { 'Cache-Control': 'public, max-age=60' });
}
