import { getImage, json } from '../../_lib.js';

// GET /api/image/:slug — the post's cover image bytes. Public, like the post itself.
export async function onRequestGet(context) {
  const img = await getImage(context.env, context.params.slug);
  if (!img) return json({ error: 'Not found' }, 404);
  return new Response(img.bytes, {
    headers: {
      'Content-Type': img.contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
