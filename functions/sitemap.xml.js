import { listPosts, escapeHtml } from './_lib.js';
import { SITE } from './_layout.js';

// GET /sitemap.xml — generated from KV so new posts appear without a manual edit.
// Replaces the old static file, which only ever listed the homepage. Static assets
// take precedence over Functions, so the file at the repo root had to be removed for
// this route to run.
export async function onRequestGet(context) {
  const posts = await listPosts(context.env); // published only, newest-first

  // A post's lastmod is its date; the homepage and index move whenever a post does,
  // so give them the freshest post date (falling back to today).
  const today = new Date().toISOString().slice(0, 10);
  const newest = (posts[0] && posts[0].date) || today;

  const url = (loc, lastmod, changefreq, priority, extra = '') =>
    `  <url>\n    <loc>${escapeHtml(loc)}</loc>\n    <lastmod>${escapeHtml(lastmod)}</lastmod>\n` +
    `    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n${extra}  </url>`;

  const urls = [
    url(SITE.origin + '/', newest, 'weekly', '1.0',
      `    <image:image>\n      <image:loc>${SITE.origin}/assets/hero_kitchen_clean.jpg</image:loc>\n` +
      `      <image:title>Mummaverse — a sunlit Indian flat as an interactive interface</image:title>\n    </image:image>\n`),
    url(SITE.origin + '/blog/', newest, 'weekly', '0.8'),
    ...posts.map(p => url(
      `${SITE.origin}/blog/${p.slug}`,
      p.date || today,
      'monthly',
      '0.7',
      p.hasImage
        ? `    <image:image>\n      <image:loc>${SITE.origin}/api/image/${escapeHtml(p.slug)}</image:loc>\n    </image:image>\n`
        : '')),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    urls.join('\n') + `\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
