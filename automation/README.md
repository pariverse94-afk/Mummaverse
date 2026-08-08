# Daily blog generator

A GitHub Actions cron job runs `generate-post.js` once a day. It signs in to the
site's admin API, asks **Claude Sonnet** to write one SEO post (voice + rules
matched to the existing blog), fetches a relevant cover photo from **Pexels**,
and saves it through `/api/posts`.

By default each post is saved as a **hidden draft** — you review and edit it in
`/admin/`, then publish. Nothing goes live without you. (Set `PUBLISH_LIVE=true`
to auto-publish instead.)

## Where the keys live

All three secrets live in **GitHub → your repo → Settings → Secrets and
variables → Actions → New repository secret**. They are never written into any
file in the repo.

| Secret | What it is |
|---|---|
| `ANTHROPIC_API_KEY` | From console.anthropic.com. Billed via API credits. |
| `ADMIN_PASSWORD` | The **same** value as the Cloudflare Pages `ADMIN_PASSWORD` (your `/admin/` password). |
| `PEXELS_API_KEY` | Free key from https://www.pexels.com/api/ (for the cover image). |

Two optional **Variables** (same page, "Variables" tab): `SITE_URL`
(defaults to `https://mummaverse.in`) and `PUBLISH_LIVE` (`false` by default;
set to `true` to publish live instead of as a draft).

## Changing your Claude account later

The API key is referenced in exactly one place (`ANTHROPIC_API_KEY`, read by the
SDK). To switch accounts:

1. In the **new** account's console (console.anthropic.com), create an API key.
2. In GitHub → Settings → Secrets and variables → Actions, **update** the
   `ANTHROPIC_API_KEY` secret with the new value.
3. Done. No code change, no redeploy. Billing follows whichever org owns the key.

The same pattern applies to `ADMIN_PASSWORD` if the site password ever changes.

## Schedule

`.github/workflows/daily-blog.yml` runs at 03:30 UTC (~09:00 IST) daily, and can
be triggered manually from the Actions tab ("Run workflow"). Change the cron line
to adjust the time or cadence (e.g. `30 3 * * 1,3,5` for Mon/Wed/Fri).

## Topics

`topics.json` holds the planned keyword-targeted topics (aligned with the SEO
content plan). Each run picks the first topic whose slug isn't already published;
once the list is exhausted, the model proposes a fresh long-tail keyword that
doesn't overlap existing posts. Add more entries to `topics.json` to steer it.

## Run it locally

```bash
cd automation
cp .env.example .env      # fill in real values
npm install
node --env-file=.env generate-post.js
```
