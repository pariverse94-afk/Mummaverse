# Blog CMS — setup

The blog runs on Cloudflare Pages Functions with a KV namespace for storage.
Posts are written in `/admin/`, stored in KV, and rendered **on the server** at
`/blog/<slug>` — so Google sees real HTML, not JavaScript.

---

## 1. Create the KV namespace

```bash
npx wrangler kv namespace create BLOG_KV
```

Copy the `id` it prints into `wrangler.toml`, replacing `REPLACE_WITH_YOUR_KV_NAMESPACE_ID`.

Or do it in the dashboard: **Workers & Pages → KV → Create namespace**, name it
`BLOG_KV`, then bind it under **your Pages project → Settings → Functions → KV
namespace bindings** with the variable name `BLOG_KV`.

## 2. Set the two secrets

**Pages project → Settings → Variables and Secrets → Add → type: Secret.**
Add them for **Production** *and* **Preview**, or the preview branch won't log in.

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | The password you'll type at `/admin/`. Make it long. |
| `SESSION_SECRET` | 32+ random characters. Never reuse the password here. |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use **Secret**, not plaintext variable — secrets are encrypted at rest and hidden
from the dashboard after saving.

## 3. Deploy

Push to GitHub. Cloudflare Pages builds automatically. No build command needed;
the output directory is the repo root.

## 4. Seed the three homepage posts

Open `/admin/`, sign in, click **Seed the 3 homepage posts**. This creates the
posts the homepage blog cards already link to. It skips any that exist, so it's
safe to click twice.

---

## How the auth works

- The password lives only in Cloudflare's secret store. It is **never** sent to
  the browser — the browser POSTs a guess to `/api/login` and gets back yes or no.
- A correct password mints a session token signed with `SESSION_SECRET` using
  HMAC-SHA256, stored in an `HttpOnly; Secure; SameSite=Strict` cookie. JavaScript
  on the page cannot read it, which limits the damage from an XSS bug.
- Tokens expire after 8 hours.
- Every write route (`POST /api/posts`, `DELETE /api/posts/:slug`) verifies the
  signature server-side. Editing the cookie by hand fails the check.
- Failed logins are compared in constant time and delayed ~600 ms, so the endpoint
  is a poor brute-force target.

**What this does not do:** there is no rate limiting beyond that delay, no 2FA, and
no audit log. For a one-author blog that's proportionate. If more people get access,
add Cloudflare Access in front of `/admin/*` — it's free up to 50 users and gives you
real identity, SSO and logs.

## Routes

| Route | What it is |
|---|---|
| `/` | The marketing site |
| `/blog/` | Post index, server-rendered |
| `/blog/<slug>` | A post, server-rendered, own `<title>`/meta/JSON-LD |
| `/admin/` | The editor (marked `noindex`) |
| `/api/login` | `GET` session check · `POST` sign in · `DELETE` sign out |
| `/api/posts` | `GET` list · `POST` create/update *(auth)* |
| `/api/posts/<slug>` | `GET` one · `DELETE` *(auth)* |

## Notes

- **Drafts** are hidden from `/blog/` and return 404 on their own URL, but are
  visible in the editor list.
- **Markdown** is deliberately limited: headings, bold, italic, code, links, lists,
  blockquotes. Everything is HTML-escaped *before* formatting, so a post can't
  inject a `<script>` — the only tags that survive are the ones the renderer emits.
- **Store buttons** appear in the header and in the closing block of every post,
  alongside a link back to the main site. Their URLs are in `functions/_layout.js`
  under `SITE` — swap `appStore` and `googlePlay` for the real listings at launch.
- **Sitemap:** `sitemap.xml` is currently a static file listing only the homepage.
  Once you have posts worth indexing, tell me and I'll make it a Function that
  generates entries from KV automatically.
