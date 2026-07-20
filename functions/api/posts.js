import { requireAuth, json, listPosts, getPost, putPost, slugify, readCookie, verifyToken } from '../_lib.js';

// GET /api/posts — published posts. Drafts are included only for a signed-in editor.
export async function onRequestGet(context) {
  const authed = await verifyToken(readCookie(context.request, 'mv_session'), context.env.SESSION_SECRET);
  return json({ posts: await listPosts(context.env, { includeDrafts: authed }) });
}

// POST /api/posts — create or update. Auth required.
export async function onRequestPost(context) {
  const denied = await requireAuth(context);
  if (denied) return denied;

  let body;
  try { body = await context.request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }

  const title = (body.title || '').trim();
  if (!title) return json({ error: 'A title is required.' }, 400);
  if (!(body.body || '').trim()) return json({ error: 'The post body is empty.' }, 400);

  const slug = slugify(body.slug || title);

  // Refuse to silently overwrite a different post that happens to share a slug.
  if (!body.allowOverwrite) {
    const existing = await getPost(context.env, slug);
    if (existing && existing.createdAt !== body.createdAt) {
      return json({ error: `A post already lives at /blog/${slug}. Change the slug, or save again to overwrite.`, slugTaken: true }, 409);
    }
  }

  const now = new Date().toISOString();
  const post = {
    slug,
    title,
    tag: (body.tag || 'NOTES').trim().toUpperCase().slice(0, 40),
    excerpt: (body.excerpt || '').trim().slice(0, 300),
    body: body.body,
    emoji: body.emoji || '📝',
    blobColor: body.blobColor || '#d97a34',
    mins: Math.max(1, Math.min(60, parseInt(body.mins, 10) || Math.ceil(String(body.body).split(/\s+/).length / 200))),
    date: body.date || now.slice(0, 10),
    published: body.published !== false,
    createdAt: body.createdAt || now,
    updatedAt: now,
  };

  await putPost(context.env, post);
  return json({ ok: true, post });
}
