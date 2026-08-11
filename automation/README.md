# Daily blog generator

A GitHub Actions cron job runs `generate-post.js` once a day. It signs in to the
site's admin API, asks **Claude Sonnet** (through the **Claude Code CLI**, billed
against a Claude Pro/Max **subscription** — no API credits) to write one SEO post
(voice + rules matched to the existing blog), fetches a relevant cover photo from
**Pexels**, and saves it through `/api/posts`.

By default each post is saved as a **hidden draft** — you review and edit it in
`/admin/`, then publish. Nothing goes live without you. (Set `PUBLISH_LIVE=true`
to auto-publish instead.)

## Where the keys live

All three secrets live in **GitHub → your repo → Settings → Secrets and
variables → Actions → New repository secret**. They are never written into any
file in the repo.

| Secret | What it is |
|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | Subscription token. Run `claude setup-token` locally (while logged in to your Pro/Max account) and paste the value. Billed against the subscription, not API credits. |
| `ADMIN_PASSWORD` | The **same** value as the Cloudflare Pages `ADMIN_PASSWORD` (your `/admin/` password). |
| `PEXELS_API_KEY` | Free key from https://www.pexels.com/api/ (for the cover image). |

Two optional **Variables** (same page, "Variables" tab): `SITE_URL`
(defaults to `https://mummaverse.in`) and `PUBLISH_LIVE` (`false` by default;
set to `true` to publish live instead of as a draft).

## Changing your Claude account later

The token is referenced in exactly one place (`CLAUDE_CODE_OAUTH_TOKEN`, read by
the `claude` CLI). To switch accounts:

1. Log in to the **new** Claude account locally (`claude` → `/login`), then run
   `claude setup-token` to mint a token for that account.
2. In GitHub → Settings → Secrets and variables → Actions, **update** the
   `CLAUDE_CODE_OAUTH_TOKEN` secret with the new value.
3. Done. No code change, no redeploy. Usage follows whichever subscription the
   token belongs to.

The token is tied to the subscription of whoever ran `claude setup-token`, and it
can expire or be revoked — if a run suddenly fails auth, mint a fresh token and
update the secret. The same "update one secret" pattern applies to
`ADMIN_PASSWORD` if the site password ever changes.

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

Generation shells out to the `claude` CLI, so install it once:

```bash
npm install -g @anthropic-ai/claude-code
claude          # then /login to your Pro/Max account (or `claude setup-token`)
```

Then:

```bash
cd automation
cp .env.example .env      # fill in ADMIN_PASSWORD + PEXELS_API_KEY (token optional if already logged in)
node --env-file=.env generate-post.js
```

There are no npm dependencies to install for the script itself — it uses only
Node built-ins, `fetch`, and the `claude` CLI.

On **Windows**, Node can't spawn the `claude.cmd` shim (`spawn EINVAL`), so for
local runs point `CLAUDE_BIN` at the native binary instead, e.g.:

```
set CLAUDE_BIN=<npm-prefix>\node_modules\@anthropic-ai\claude-code\bin\claude.exe
```

(`npm prefix -g` prints the prefix.) This is only for local testing — the GitHub
Actions runner is Linux, where `claude` is a normal executable and works as-is.
