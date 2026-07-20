import { escapeHtml } from './_lib.js';

export const SITE = {
  name: 'Mummaverse',
  origin: 'https://mummaverse.in',
  waitlist: 'https://forms.gle/davzCPixvMJhS6C46',
  appStore: 'https://forms.gle/davzCPixvMJhS6C46',   // swap for the real listing at launch
  googlePlay: 'https://forms.gle/davzCPixvMJhS6C46', // swap for the real listing at launch
  email: 'pariverse94@gmail.com',
};

const APPLE_PATH = 'M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z';
const PLAY_PATH  = 'M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60-34.1c18-14.3 18-46.5-1.1-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z';

export function storeButtons({ size = 'md' } = {}) {
  const pad = size === 'lg' ? '12px 22px' : '7px 15px';
  const big = size === 'lg' ? '17px' : '14px';
  const sm  = size === 'lg' ? '10px' : '9px';
  const ico = size === 'lg' ? '24px' : '19px';
  const btn = (href, label, small, large, path, box) => `
    <a class="store-btn" href="${href}" target="_blank" rel="noopener" aria-label="${escapeHtml(label)}"
       style="padding:${pad};">
      <svg viewBox="${box}" aria-hidden="true" focusable="false" style="width:${ico};height:${ico};"><path d="${path}"/></svg>
      <span><span class="sb-sm" style="font-size:${sm};">${small}</span><span class="sb-lg" style="font-size:${big};">${large}</span></span>
    </a>`;
  return `<div class="store-row">
    ${btn(SITE.appStore, 'Download Pariverse on the App Store', 'Download on the', 'App Store', APPLE_PATH, '0 0 384 512')}
    ${btn(SITE.googlePlay, 'Get Pariverse on Google Play', 'Get it on', 'Google Play', PLAY_PATH, '0 0 512 512')}
  </div>`;
}

const STYLES = `
  :root { color-scheme: light; }
  * { box-sizing:border-box; }
  body { margin:0; background:#f8f0e5; color:#2a1b13; font-family:'Space Grotesk',system-ui,sans-serif; line-height:1.6; }
  a { color:#a8501a; text-decoration:none; }
  a:hover { color:#7d3409; }
  .wrap { max-width:760px; margin:0 auto; padding:0 24px; }
  .wide { max-width:1100px; }

  header.bar {
    position:sticky; top:0; z-index:40; display:flex; justify-content:space-between; align-items:center;
    gap:16px; padding:14px 24px; background:rgba(248,240,229,0.93); backdrop-filter:blur(10px);
    border-bottom:1px solid #e6d7c4; flex-wrap:wrap;
  }
  header.bar .brand { font-weight:700; font-size:18px; color:#2a1b13; letter-spacing:-0.01em; }
  header.bar nav { display:flex; align-items:center; gap:14px; font-size:13px; letter-spacing:0.05em; }

  .store-row { display:flex; gap:10px; flex-wrap:wrap; }
  .store-btn {
    display:inline-flex; align-items:center; gap:9px; flex:none;
    background:linear-gradient(180deg,#3a2618,#241812); color:#fff4e4 !important;
    border:1px solid #4d3422; border-radius:9px; white-space:nowrap;
    box-shadow:0 3px 10px rgba(60,35,15,0.24);
    transition:transform .25s cubic-bezier(.34,1.4,.64,1), box-shadow .25s, background .25s;
  }
  .store-btn:hover { transform:translateY(-2px); color:#fff !important;
    background:linear-gradient(180deg,#4b3220,#302014); box-shadow:0 9px 22px rgba(60,35,15,0.34); }
  .store-btn:active { transform:translateY(0); }
  .store-btn:focus-visible { outline:3px solid rgba(217,122,52,.6); outline-offset:3px; }
  .store-btn svg { fill:currentColor; flex:none; }
  .store-btn .sb-sm { display:block; line-height:1.2; letter-spacing:.09em; text-transform:uppercase; opacity:.82; }
  .store-btn .sb-lg { display:block; line-height:1.25; font-weight:700; letter-spacing:-.01em; }

  .cta {
    display:inline-block; background:linear-gradient(180deg,#f0a45e,#d97a34); color:#241812 !important;
    font-weight:700; padding:12px 22px; border-radius:8px; white-space:nowrap;
    transition:transform .25s cubic-bezier(.34,1.4,.64,1), box-shadow .25s;
  }
  .cta:hover { transform:translateY(-2px); box-shadow:0 10px 24px rgba(180,120,60,.32); color:#241812 !important; }

  .eyebrow { font-size:14px; font-weight:700; letter-spacing:.2em; color:#a8501a; }
  article h1 { font-size:52px; line-height:1.05; letter-spacing:-.025em; margin:14px 0 16px; }
  article h2 { font-size:30px; line-height:1.2; letter-spacing:-.02em; margin:44px 0 12px; }
  article h3 { font-size:22px; line-height:1.25; margin:32px 0 10px; }
  article p, article li { font-size:18px; line-height:1.7; color:#3f2d20; }
  article blockquote {
    margin:32px 0; padding:6px 0 6px 24px; border-left:3px solid #d97a34;
    font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:26px; line-height:1.35; color:#2a1b13;
  }
  article code { background:#f1e3d2; padding:2px 6px; border-radius:4px; font-size:.9em; }
  .meta { color:#5c4636; font-size:14px; }

  .glass {
    display:block; background:linear-gradient(152deg, rgba(255,255,255,.78), rgba(255,247,236,.44));
    backdrop-filter:blur(14px) saturate(1.3); border:1px solid rgba(255,255,255,.8); border-radius:16px;
    box-shadow:0 6px 22px rgba(150,100,50,.10), inset 0 1px 0 rgba(255,255,255,.95), inset 0 -1px 0 rgba(214,170,120,.22);
    overflow:hidden; color:#2a1b13 !important;
    transition:transform .32s cubic-bezier(.34,1.4,.64,1), box-shadow .32s, border-color .32s;
  }
  .glass:hover { transform:translateY(-4px); border-color:rgba(240,164,94,.9); color:#2a1b13 !important;
    box-shadow:0 18px 42px rgba(180,120,60,.22), inset 0 1px 0 #fff; }

  .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
  .cover { height:170px; display:flex; align-items:center; justify-content:center; font-size:44px; }
  .pill { display:inline-block; background:rgba(36,24,18,.78); color:#f0a45e; font-size:11px; font-weight:700;
          letter-spacing:.14em; padding:6px 12px; border-radius:999px; }

  .endcap { margin:64px 0 0; padding:36px; border-radius:16px;
            background:linear-gradient(160deg,#f0a45e,#d97a34); color:#241812; }
  .endcap h2 { margin:0 0 8px; font-size:30px; letter-spacing:-.02em; }
  .endcap .store-btn { border-color:rgba(0,0,0,.25); }

  footer.site { border-top:1px solid #e6d7c4; margin-top:64px; padding:28px 24px; color:#5c4636; font-size:13px; }
  footer.site .wrap { display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; }

  @media (max-width:820px) {
    .grid { grid-template-columns:1fr; }
    article h1 { font-size:34px; }
    header.bar nav .hide-sm { display:none; }
  }
`;

export function page({ title, description, canonical, body, ogImage, jsonLd }) {
  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<meta name="theme-color" content="#f8f0e5">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:image" content="${escapeHtml(ogImage || SITE.origin + '/assets/hero_kitchen_clean.jpg')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>${STYLES}</style>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body>

<header class="bar">
  <a class="brand" href="/">${SITE.name}</a>
  <nav>
    <a href="/" class="hide-sm">← Back to the site</a>
    <a href="/blog/" class="hide-sm">All posts</a>
    ${storeButtons()}
    <a class="cta" href="${SITE.waitlist}" target="_blank" rel="noopener" style="padding:9px 16px;">JOIN THE WAITLIST</a>
  </nav>
</header>

${body}

<footer class="site">
  <div class="wrap wide">
    <div>&copy; 2026 PARIVERSE &middot; <a href="mailto:${SITE.email}">${SITE.email}</a></div>
    <div><a href="/">mummaverse.in</a> &middot; <a href="/blog/">Blog</a></div>
  </div>
</footer>

</body>
</html>`;
}

/* The block that closes every post: the two badges plus a route back to the site. */
export function endcap() {
  return `
  <div class="endcap">
    <h2>Get Pariverse on your phone</h2>
    <p style="margin:0 0 20px; max-width:52ch;">Split the kaam ka bojh across the whole family — chores, meals, midnight fevers. Launching soon on both stores.</p>
    ${storeButtons({ size: 'lg' })}
    <p style="margin:22px 0 0;">
      <a href="/" style="color:#241812; font-weight:700; text-decoration:underline;">← Back to mummaverse.in</a>
      &nbsp;&middot;&nbsp;
      <a href="${SITE.waitlist}" target="_blank" rel="noopener" style="color:#241812; font-weight:700; text-decoration:underline;">Join the waitlist</a>
    </p>
  </div>`;
}
