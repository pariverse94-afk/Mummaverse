// Daily blog generator.
//
// Flow: sign in to the admin API -> read existing posts (drafts included) ->
// pick the next planned topic (or ask the model for a fresh keyword) ->
// generate an SEO post with Sonnet -> fetch a relevant cover photo from Pexels ->
// publish it through /api/posts as a DRAFT (or live, if PUBLISH_LIVE=true).
//
// It writes NOTHING to the repo or KV directly — everything goes through the
// same authenticated admin endpoints the /admin editor uses, so all the server
// side slug/metadata/validation logic is reused.
//
// Credentials come from the environment (never hardcode): ANTHROPIC_API_KEY,
// ADMIN_PASSWORD, PEXELS_API_KEY, plus optional SITE_URL / PUBLISH_LIVE.

import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

const SITE_URL = (process.env.SITE_URL || 'https://mummaverse.in').replace(/\/$/, '');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PUBLISH_LIVE = String(process.env.PUBLISH_LIVE || 'false').toLowerCase() === 'true';

// The user chose Sonnet for generation. Pin it here so it's easy to change.
const MODEL = 'claude-sonnet-5';

function die(msg) {
  console.error('✗ ' + msg);
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) die('ANTHROPIC_API_KEY is not set.');
if (!ADMIN_PASSWORD) die('ADMIN_PASSWORD is not set.');

const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

/* ── admin API ──────────────────────────────────────────────────────────── */

async function login() {
  const res = await fetch(SITE_URL + '/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: ADMIN_PASSWORD }),
  });
  if (res.status === 500) die('Server not configured (ADMIN_PASSWORD/SESSION_SECRET missing at runtime).');
  if (res.status === 401) die('Login failed — the ADMIN_PASSWORD secret does not match the site password.');
  if (!res.ok) die(`Login failed with HTTP ${res.status}.`);
  const raw = res.headers.get('set-cookie') || '';
  const m = /mv_session=([^;]+)/.exec(raw);
  if (!m) die('Login succeeded but no session cookie was returned.');
  return 'mv_session=' + m[1];
}

async function listPosts(cookie) {
  const res = await fetch(SITE_URL + '/api/posts', { headers: { Cookie: cookie } });
  if (!res.ok) die(`Could not list posts (HTTP ${res.status}).`);
  const data = await res.json();
  return Array.isArray(data.posts) ? data.posts : [];
}

async function createPost(cookie, post) {
  const res = await fetch(SITE_URL + '/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify(post),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) die(`Publish failed (HTTP ${res.status}): ${data.error || 'unknown error'}`);
  return data.post;
}

/* ── topic selection ────────────────────────────────────────────────────── */

function slugify(s) {
  return (s || '').toLowerCase().replace(/['"’]/g, '').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 80) || 'post';
}

function uniqueSlug(base, taken) {
  let slug = slugify(base), n = 2;
  while (taken.has(slug)) slug = slugify(base) + '-' + n++;
  return slug;
}

async function loadTopics() {
  try {
    return JSON.parse(await readFile(join(HERE, 'topics.json'), 'utf8'));
  } catch {
    return [];
  }
}

/* ── generation ─────────────────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You write for The Mummaverse Blog (mummaverse.in), the content arm of Pariverse — an app that helps Indian nuclear families share the household mental load and split chores fairly. Every post is one SEO article.

VOICE — match the three existing posts exactly:
- Direct second person, warm but not preachy, grounded in real urban Indian nuclear-family life.
- Natural code-switched Hindi where it fits (kaam ka bojh, bartan, sabzi, "maid nahi aayi", beta), never forced.
- No filler, no listicle fluff, no fabricated statistics, no invented studies. If you don't have a real number, don't cite one.

SEO RULES:
- Put the primary keyword in the title, in the first ~100 words, and in the slug.
- Title <= 60 characters. Excerpt (meta description) benefit-led, <= 155 characters.
- 900-1300 words. Structure: a hook, then 3-5 "##" sections, at least one ">" pull-quote, and at least one bullet or numbered list. A short close.

MARKDOWN — the renderer supports ONLY: "##"/"###" headings, ">" blockquote, "-" or "1." lists, **bold**, *italic*, \`code\`, and [text](https://…) links (https only). No tables, no images in the body, no H1 (the title IS the h1).

INTERNAL LINKS: include 2 links to other existing posts using their real URLs from the list provided. Never link to a slug that isn't in that list.

DO NOT add an app download / store / waitlist call-to-action in the body — the site appends one automatically.

Return the fields requested. imageQuery: 2-4 plain words for a stock-photo search that would make a relevant, tasteful cover (e.g. "indian family kitchen", "mother laptop home") — no text, no logos.`;

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    slug: { type: 'string' },
    tag: { type: 'string' },
    excerpt: { type: 'string' },
    emoji: { type: 'string' },
    blobColor: { type: 'string' },
    imageQuery: { type: 'string' },
    body: { type: 'string' },
  },
  required: ['title', 'slug', 'tag', 'excerpt', 'emoji', 'blobColor', 'imageQuery', 'body'],
};

async function generatePost(topic, existing) {
  const linkList = existing
    .filter(p => p.published !== false)
    .slice(0, 12)
    .map(p => `- ${p.title} -> ${SITE_URL}/blog/${p.slug}`)
    .join('\n') || '(no other posts yet — skip internal links this time)';

  const titles = existing.map(p => `- ${p.title}`).join('\n') || '(none yet)';

  const brief = topic
    ? `Write today's post on this planned topic:
- Primary keyword / intent: ${topic.primaryKeyword}
- Suggested title angle: ${topic.title}
- Suggested slug: ${topic.slug}
- Tag: ${topic.tag}
- Emoji: ${topic.emoji}  Accent hex: ${topic.blobColor}`
    : `All planned topics are used. Propose a FRESH India-specific long-tail keyword about the mental load / sharing household chores / running an Indian home that does NOT overlap the existing titles below, and write that post. Pick your own tag, emoji, and a warm accent hex.`;

  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
    messages: [{
      role: 'user',
      content: `${brief}

EXISTING POST TITLES (do not duplicate these topics):
${titles}

POSTS YOU MAY LINK TO (use real URLs, pick 2):
${linkList}`,
    }],
  });

  if (msg.stop_reason === 'refusal') die('The model declined to generate this post.');
  const text = msg.content.find(b => b.type === 'text');
  if (!text) die('The model returned no text block.');
  return JSON.parse(text.text);
}

/* ── cover image (Pexels) ───────────────────────────────────────────────── */

async function fetchCover(query) {
  if (!PEXELS_API_KEY) {
    console.warn('! PEXELS_API_KEY not set — publishing with the emoji cover instead.');
    return null;
  }
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&size=medium&per_page=1`;
    const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
    if (!res.ok) throw new Error(`Pexels HTTP ${res.status}`);
    const data = await res.json();
    const photo = data.photos && data.photos[0];
    if (!photo) throw new Error('no results');
    const imgRes = await fetch(photo.src.landscape);
    if (!imgRes.ok) throw new Error(`image HTTP ${imgRes.status}`);
    const bytes = Buffer.from(await imgRes.arrayBuffer());
    if (bytes.length > 2_000_000) throw new Error('image over 2MB');
    return {
      dataUrl: 'data:image/jpeg;base64,' + bytes.toString('base64'),
      credit: `\n\n*Photo by [${photo.photographer}](${photo.photographer_url}) on [Pexels](https://www.pexels.com).*`,
    };
  } catch (e) {
    console.warn('! Cover image failed (' + e.message + ') — publishing with the emoji cover instead.');
    return null;
  }
}

/* ── main ───────────────────────────────────────────────────────────────── */

async function main() {
  const cookie = await login();
  const existing = await listPosts(cookie);
  const taken = new Set(existing.map(p => p.slug));
  console.log(`• ${existing.length} existing post(s).`);

  const topics = await loadTopics();
  const topic = topics.find(t => !taken.has(t.slug)) || null;
  console.log(topic ? `• Topic: ${topic.title}` : '• All planned topics used — asking the model for a fresh one.');

  const post = await generatePost(topic, existing);
  const slug = uniqueSlug(post.slug || post.title, taken);
  console.log(`• Generated: "${post.title}" (${post.body.split(/\s+/).length} words)`);

  const cover = await fetchCover(post.imageQuery);
  const body = cover ? post.body + cover.credit : post.body;

  const saved = await createPost(cookie, {
    title: post.title,
    slug,
    tag: post.tag,
    excerpt: post.excerpt,
    emoji: post.emoji,
    blobColor: post.blobColor,
    body,
    published: PUBLISH_LIVE,           // false => saved as a hidden draft
    image: cover ? cover.dataUrl : undefined,
    hasImage: !!cover,
  });

  const where = PUBLISH_LIVE ? `LIVE at ${SITE_URL}/blog/${saved.slug}` : `a DRAFT — review it in ${SITE_URL}/admin/`;
  console.log(`✓ Saved ${where}`);
}

main().catch(e => die(e.stack || String(e)));
