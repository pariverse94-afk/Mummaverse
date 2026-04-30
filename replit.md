# Parivaar — Family App for Urban India

A mobile app built with Expo for nuclear families in urban India. Parivaar means "family" in Hindi.

## Architecture

**Monorepo (pnpm workspaces)**

- `artifacts/mobile` — Expo (SDK 54, expo-router v6) mobile app
- `artifacts/api-server` — Express API server (TypeScript, ESBuild)
- `lib/api-spec` — OpenAPI spec + Orval codegen
- `lib/api-client-react` — Generated React Query hooks
- `lib/integrations-anthropic-ai` — Replit AI integrations (Anthropic/Claude)
- `lib/db` — Drizzle ORM schema (PostgreSQL, DATABASE_URL in env)

## Features

### 1. Home / Chore Assignment
- Family member management (parents + children)
- Daily/weekly chore assignment with colored avatars
- Progress bar showing completion rate
- AsyncStorage persistence

### 2. AI-Assisted Meal Planning (`POST /api/ai/meals`)
- Weekly meal planner with Mon–Sun day tabs
- Inventory-aware suggestions using pantry items
- Dietary preferences (Vegetarian, Vegan, etc.)
- Nutritional goals (High Protein, Low Oil, etc.)
- Claude-powered Indian cuisine meal suggestions with Hindi names

### 3. Mom's Corner (Community)
- Social feed for moms with categories: Recipes, Parenting, Health, General
- Create, like, save posts
- Pre-seeded with realistic Indian parenting content
- AsyncStorage persistence

### 4. AI First Aid (`POST /api/ai/firstaid` — SSE streaming)
- Grid of 10 common childhood conditions
- Streaming AI guidance from Claude
- Child age + severity inputs
- Emergency helpline references (108, 1800-180-1104)
- Medical disclaimer throughout

## AI Setup

Uses **Replit AI Integrations** (Anthropic) — no user API key needed.

Environment variables auto-provided:
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL`
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY`

Model: `claude-sonnet-4-6`

## Design System

**Color Palette (Warm Indian):**
- Primary: `#E07B39` (saffron orange)
- Secondary: `#2D6A4F` (forest green)
- Background: `#FFF8F0` (warm cream)
- Accent: `#C44B2B` (russet)
- Supports light + dark mode

**Typography:** Inter (400, 500, 600, 700)

## Mobile App Structure

```
app/
├── _layout.tsx          # Root stack + providers
├── (tabs)/
│   ├── _layout.tsx      # 4-tab navigator (NativeTabs or Tabs)
│   ├── index.tsx        # Home (chores + family)
│   ├── meals.tsx        # Meal planner
│   ├── community.tsx    # Mom's social feed
│   └── firstaid.tsx     # First aid categories
├── firstaid/
│   └── chat.tsx         # AI first aid chat (streaming)
└── meals/
    └── suggest.tsx      # AI meal suggestion generator
context/
├── FamilyContext.tsx    # Members + chores state
├── MealContext.tsx      # Meals + inventory state
└── CommunityContext.tsx # Posts state
components/
├── ChoreCard.tsx
├── MealCard.tsx
├── PostCard.tsx
└── ErrorBoundary.tsx
```

## API Routes

- `GET /api/healthz` — Health check
- `POST /api/ai/meals` — Generate meal suggestions (JSON)
- `POST /api/ai/firstaid` — First aid guidance (SSE stream)

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (set)
- `SESSION_SECRET` — Session secret (set)
- `EXPO_PUBLIC_DOMAIN` — Set to `$REPLIT_DEV_DOMAIN` by Expo workflow
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` — Auto by Replit AI integrations
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — Auto by Replit AI integrations

## Known Notes

- Supabase integration not yet connected (user offered to provide)
- All mobile state persists via AsyncStorage (no backend DB for mobile data yet)
- The `lib/db` conversations/messages schema is present but not pushed yet
