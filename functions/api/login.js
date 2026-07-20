import { createToken, safeEqual, sessionCookie, clearedCookie, json, verifyToken, readCookie } from '../_lib.js';

// GET /api/login — cheap check the admin page uses to decide login vs editor
export async function onRequestGet(context) {
  const ok = await verifyToken(readCookie(context.request, 'mv_session'), context.env.SESSION_SECRET);
  return json({ authenticated: ok });
}

// POST /api/login  { password }
export async function onRequestPost(context) {
  const { env, request } = context;

  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
    return json({ error: 'Server not configured. Set ADMIN_PASSWORD and SESSION_SECRET.' }, 500);
  }

  let password = '';
  try { ({ password } = await request.json()); } catch { /* falls through to the failure below */ }

  if (!safeEqual(password || '', env.ADMIN_PASSWORD)) {
    // Slow every failure down a little so the endpoint is a poor brute-force target.
    await new Promise(r => setTimeout(r, 600));
    return json({ error: 'Wrong password.' }, 401, { 'Set-Cookie': clearedCookie });
  }

  const token = await createToken(env.SESSION_SECRET);
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(token) });
}

// DELETE /api/login — sign out
export async function onRequestDelete() {
  return json({ ok: true }, 200, { 'Set-Cookie': clearedCookie });
}
