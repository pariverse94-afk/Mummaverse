import { requireAuth, json, getPost } from '../../_lib.js';

// GET /api/posts/:slug — used by the editor to load a post for editing
export async function onRequestGet(context) {
  const post = await getPost(context.env, context.params.slug);
  if (!post) return json({ error: 'Not found' }, 404);
  return json({ post });
}

// DELETE /api/posts/:slug
export async function onRequestDelete(context) {
  const denied = await requireAuth(context);
  if (denied) return denied;

  await context.env.BLOG_KV.delete('post:' + context.params.slug);
  return json({ ok: true });
}
