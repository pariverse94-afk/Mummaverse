# Pariverse - Infrastructure Requirements Summary

## What You Already Have

| Component | Service | Status |
|-----------|---------|--------|
| Mobile app | Expo (React Native) | Built |
| API server | Express (Node.js) | Built |
| Database | Supabase (PostgreSQL) | Live |
| AI | Anthropic Claude via Replit | Working |

---

## Additional Infrastructure Needed

### 1. API Hosting — Google Cloud Run
**Purpose:** Host the Express API server for production traffic, multi-user scale.

- Container runs your existing Express code unchanged
- Auto-scales from 0 to N instances based on traffic
- Built-in HTTPS, load balancing
- **Cost:** Free up to 2M requests/month, ~$0.40/million after

**What to set up:**
- Google Cloud account
- `Dockerfile` in `artifacts/api-server`
- Cloud Run service (1 command deploy)
- Point mobile app to Cloud Run URL

---

### 2. Secrets Management — Google Secret Manager
**Purpose:** Store API keys and credentials securely outside the codebase.

- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`
- Cloud Run reads secrets at runtime — no secrets in environment files
- **Cost:** $0.06 per 10,000 access operations (effectively free)

---

### 3. CDN + Security — Cloudflare
**Purpose:** Cache responses at the edge, protect against DDoS, rate-limit abusive requests.

- Sits in front of Cloud Run
- Free tier covers most of what you need at launch
- Add WAF rules to block scrapers and bot traffic
- **Cost:** Free tier sufficient to start

---

### 4. Crash Reporting — Sentry
**Purpose:** Know when users hit errors before they report them.

- Captures crashes in both the mobile app and the API server
- Shows stack traces, affected users, frequency
- **Cost:** Free up to 5,000 errors/month

**What to set up:**
- `@sentry/react-native` in the mobile app
- `@sentry/node` in the API server

---

### 5. Analytics — PostHog (or Mixpanel)
**Purpose:** Understand which features users actually use, track retention.

- Track events: onboarding completed, chore added, meal planned, AI chat used
- Funnels, retention charts, user paths
- **Cost:** PostHog free up to 1M events/month

---

### 6. Push Notifications — Firebase Cloud Messaging (FCM)
**Purpose:** Send reminders and alerts to users' devices.

- Chore reminders ("Arjun has a pending chore")
- Community activity ("Someone replied to your post")
- Works on both iOS and Android via Expo Push API
- **Cost:** Free (FCM is always free)

**What to set up:**
- Firebase project (Google Cloud)
- `expo-notifications` in the mobile app
- Notification route on the API server

---

### 7. CI/CD Pipeline — GitHub Actions
**Purpose:** Automate testing and deployment on every code change.

```
Push to main
    ├── TypeScript typecheck
    ├── Deploy API → Cloud Run
    └── EAS Update (OTA push to mobile users)

Tag a release (v1.x.x)
    └── EAS Build → Submit to App Store + Play Store
```

- **Cost:** Free for public repos, 2,000 minutes/month free for private

---

### 8. App Store Distribution — EAS (Expo Application Services)
**Purpose:** Build and submit the mobile app to Apple and Google.

- EAS Build: compiles iOS `.ipa` and Android `.aab` in the cloud
- EAS Submit: uploads directly to App Store Connect and Play Console
- EAS Update: ships JS-only fixes to users without store review
- **Cost:** Free tier available; $99/month for production builds at scale

**Accounts needed:**
- Apple Developer Program — $99/year
- Google Play Developer — $25 one-time

---

### 9. Supabase Upgrade — Pro Plan
**Purpose:** Remove free-tier limitations for live users.

- Free tier pauses the database after 1 week of inactivity
- Pro gives dedicated resources, no pause, daily backups, 8GB storage
- **Cost:** $25/month

---

## Summary by Priority

### Launch blockers (must have before going live)
| # | What | Service | Est. Cost |
|---|------|---------|-----------|
| 1 | API hosting | Google Cloud Run | ~$0–10/month |
| 2 | Secrets storage | Google Secret Manager | ~$0/month |
| 3 | App builds + submission | EAS + Developer accounts | $99/yr (Apple) + $25 (Google) |
| 4 | Database upgrade | Supabase Pro | $25/month |

### Add shortly after launch
| # | What | Service | Est. Cost |
|---|------|---------|-----------|
| 5 | Crash reporting | Sentry | Free |
| 6 | CDN + security | Cloudflare | Free |
| 7 | CI/CD pipeline | GitHub Actions | Free |
| 8 | Analytics | PostHog | Free |

### Add as you grow
| # | What | Service | Est. Cost |
|---|------|---------|-----------|
| 9 | Push notifications | Firebase Cloud Messaging | Free |
| 10 | Email (welcome, alerts) | Resend | Free up to 3k/month |
| 11 | Monitoring + alerts | Google Cloud Monitoring | Free tier |

---

## Estimated Monthly Cost at Launch

| Service | Cost |
|---------|------|
| Google Cloud Run | $0–5 |
| Supabase Pro | $25 |
| Cloudflare | $0 |
| Sentry | $0 |
| PostHog | $0 |
| Firebase | $0 |
| **Total** | **~$25–30/month** |

Scales gradually — Cloud Run, Supabase, and Sentry all have usage-based pricing that grows only as your user base grows.
