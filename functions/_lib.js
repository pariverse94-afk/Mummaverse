// Shared helpers for the Pages Functions.
// Files under functions/ that start with "_" are not routed, so this is safe to import.

const ENC = new TextEncoder();
const SESSION_HOURS = 8;

/* ── session tokens ──────────────────────────────────────────────────────────
   A token is  <base64url(payload)>.<base64url(hmac)>  signed with SESSION_SECRET.
   The secret never leaves the worker, so a token can't be forged in the browser. */

function b64urlEncode(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str) {
  const pad = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(pad + '='.repeat((4 - (pad.length % 4)) % 4));
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}

async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', ENC.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function createToken(secret) {
  const payload = ENC.encode(JSON.stringify({ exp: Date.now() + SESSION_HOURS * 3600_000 }));
  const key = await hmacKey(secret);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, payload));
  return b64urlEncode(payload) + '.' + b64urlEncode(sig);
}

export async function verifyToken(token, secret) {
  if (!token || !secret) return false;
  const [p, s] = token.split('.');
  if (!p || !s) return false;
  try {
    const key = await hmacKey(secret);
    const ok = await crypto.subtle.verify('HMAC', key, b64urlDecode(s), b64urlDecode(p));
    if (!ok) return false;
    const { exp } = JSON.parse(new TextDecoder().decode(b64urlDecode(p)));
    return typeof exp === 'number' && Date.now() < exp;
  } catch {
    return false;
  }
}

/* Compares two strings without leaking their difference through timing. */
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const A = ENC.encode(a), B = ENC.encode(b);
  let diff = A.length ^ B.length;
  const n = Math.max(A.length, B.length);
  for (let i = 0; i < n; i++) diff |= (A[i] || 0) ^ (B[i] || 0);
  return diff === 0;
}

export function readCookie(request, name) {
  const raw = request.headers.get('Cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

export function sessionCookie(token) {
  return `mv_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_HOURS * 3600}`;
}

export const clearedCookie = 'mv_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0';

/* Guard for every write route. Returns null when the caller is authenticated. */
export async function requireAuth(context) {
  const token = readCookie(context.request, 'mv_session');
  if (await verifyToken(token, context.env.SESSION_SECRET)) return null;
  return json({ error: 'Not authenticated' }, 401);
}

/* ── responses ─────────────────────────────────────────────────────────────── */

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

export function html(body, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...headers },
  });
}

/* ── posts ─────────────────────────────────────────────────────────────────── */

export function slugify(s) {
  return (s || '')
    .toLowerCase()
    .replace(/['"’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'post';
}

export function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* Minimal, deliberately strict markdown. Everything is escaped first, so a post
   can never inject script — the only HTML present is what this function emits. */
export function renderMarkdown(md) {
  const blocks = escapeHtml(md || '').replace(/\r\n/g, '\n').split(/\n{2,}/);
  return blocks.map(block => {
    const b = block.trim();
    if (!b) return '';
    if (/^###\s+/.test(b)) return `<h3>${inline(b.replace(/^###\s+/, ''))}</h3>`;
    if (/^##\s+/.test(b))  return `<h2>${inline(b.replace(/^##\s+/, ''))}</h2>`;
    // note: escapeHtml has already turned "> " into "&gt; ", so match that
    if (/^&gt;\s+/.test(b)) return `<blockquote>${inline(b.replace(/^&gt;\s+/gm, ''))}</blockquote>`;
    if (/^[-*]\s+/m.test(b) && b.split('\n').every(l => /^[-*]\s+/.test(l.trim())))
      return `<ul>${b.split('\n').map(l => `<li>${inline(l.trim().replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`;
    if (b.split('\n').every(l => /^\d+[.)]\s+/.test(l.trim())))
      return `<ol>${b.split('\n').map(l => `<li>${inline(l.trim().replace(/^\d+[.)]\s+/, ''))}</li>`).join('')}</ol>`;
    return `<p>${inline(b).replace(/\n/g, '<br>')}</p>`;
  }).join('\n');
}

function inline(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

/* Metadata rides along with the KV entry so the index page needs one list call
   rather than one read per post. KV caps metadata at 1024 bytes. */
export function toMetadata(post) {
  return {
    title: (post.title || '').slice(0, 160),
    excerpt: (post.excerpt || '').slice(0, 300),
    tag: (post.tag || '').slice(0, 40),
    date: post.date || '',
    mins: post.mins || 4,
    emoji: post.emoji || '📝',
    blobColor: post.blobColor || '#d97a34',
    hasImage: !!post.hasImage,
    published: post.published !== false,
    updatedAt: post.updatedAt || '',
  };
}

/* Cover-image URL, versioned by updatedAt so a replaced image busts browser and
   edge caches the moment the post is saved (the bytes are cached for an hour). */
export function imageUrl(post) {
  const v = post.updatedAt || post.date || '';
  return `/api/image/${encodeURIComponent(post.slug)}` + (v ? `?v=${encodeURIComponent(v)}` : '');
}

/* ── cover images ────────────────────────────────────────────────────────────
   Images are too big for KV metadata (1024-byte cap), so each lives under its
   own key `image:<slug>`. The post keeps only a `hasImage` flag, which rides in
   metadata so the blog index can still render every card from one list() call. */

export function dataUrlToBytes(dataUrl) {
  const m = /^data:([^;,]+);base64,([\s\S]+)$/.exec(dataUrl || '');
  if (!m) return null;
  const bin = atob(m[2]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { contentType: m[1], bytes };
}

export async function putImage(env, slug, contentType, bytes) {
  await env.BLOG_KV.put('image:' + slug, bytes, { metadata: { contentType } });
}

export async function getImage(env, slug) {
  const res = await env.BLOG_KV.getWithMetadata('image:' + slug, 'arrayBuffer');
  if (!res || !res.value) return null;
  return { bytes: res.value, contentType: (res.metadata && res.metadata.contentType) || 'application/octet-stream' };
}

export async function deleteImage(env, slug) {
  await env.BLOG_KV.delete('image:' + slug);
}

export async function listPosts(env, { includeDrafts = false } = {}) {
  const out = [];
  let cursor;
  do {
    const res = await env.BLOG_KV.list({ prefix: 'post:', cursor });
    for (const k of res.keys) {
      const m = k.metadata || {};
      if (!includeDrafts && m.published === false) continue;
      out.push({ slug: k.name.slice(5), ...m });
    }
    cursor = res.list_complete ? null : res.cursor;
  } while (cursor);
  return out.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

export async function getPost(env, slug) {
  return env.BLOG_KV.get('post:' + slug, 'json');
}

export async function putPost(env, post) {
  await env.BLOG_KV.put('post:' + post.slug, JSON.stringify(post), { metadata: toMetadata(post) });
}
