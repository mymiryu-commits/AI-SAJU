# CLAUDE.md - AI-SAJU Codebase Guide

## Project Overview

AI-SAJU is a multi-service AI monetization platform built with **Next.js 16**, **React 19**, and **TypeScript 5**. It combines three core products:

1. **AI Tools Ranking** - Curated rankings of AI tools across categories (chat, image, video, code)
2. **Fortune Services** - Saju (Four Pillars of Destiny), face reading, astrology, and compatibility analysis
3. **Lotto Analyzer** - Smart number generation with pattern analysis, filters, optimization, and backtesting

The platform is monetized through subscriptions, coin-based purchases, referral rewards, and daily check-in engagement mechanics.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.1 (App Router) |
| UI | React 19.2.3, Radix UI, Tailwind CSS 4 |
| Language | TypeScript 5 (strict mode) |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (OAuth + email) |
| State | Zustand (client), React Query (server) |
| i18n | next-intl 4.7 (ko, ja, en) |
| Animation | Framer Motion 12 |
| PDF | jsPDF 4 |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Project Structure

```
AI-SAJU/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Dynamic locale routing
│   │   ├── (auth)/               # Auth pages (login, signup)
│   │   ├── (main)/               # Main app pages
│   │   │   ├── fortune/          # Fortune services (saju, face, compatibility)
│   │   │   ├── lotto/            # Lotto analyzer
│   │   │   ├── ranking/          # AI tools ranking by category
│   │   │   ├── my/               # User dashboard, settings, history, referral
│   │   │   ├── pricing/          # Pricing page
│   │   │   └── page.tsx          # Home page
│   │   └── layout.tsx            # Root layout
│   └── api/                      # API route handlers
│       ├── auth/                 # OAuth callback
│       ├── fortune/              # Fortune analysis endpoints
│       ├── lotto/                # Lotto generation, stats, history
│       ├── payment/              # Payment create & webhooks
│       ├── subscription/         # Subscription management
│       ├── checkin/              # Daily check-in rewards
│       ├── referral/             # Referral tracking
│       └── retention/            # Churn risk & retention offers
├── components/                   # React components
│   ├── ui/                       # Radix-based primitives (button, card, dialog, etc.)
│   ├── layout/                   # Header, Footer
│   ├── fortune/                  # Fortune-specific components
│   ├── lotto/                    # Lotto-specific components
│   ├── payment/                  # Payment modal
│   └── subscription/             # Subscription management UI
├── lib/                          # Core business logic
│   ├── fortune/saju/             # Saju calculation engine
│   │   ├── index.ts              # Main calculateSaju() entry point
│   │   ├── calculator.ts         # Pillar calculations
│   │   ├── oheng.ts              # Five elements balance
│   │   ├── analysis/             # Premium analysis modules
│   │   ├── conversion/           # Data conversion templates
│   │   └── export/               # PDF & audio generation
│   ├── lotto/                    # Lotto engine
│   │   ├── generator.ts          # Number generation algorithms
│   │   ├── analyzer.ts           # Pattern analysis (hot/cold, trends)
│   │   ├── filters.ts            # Filter validation (10+ constraints)
│   │   ├── optimizer.ts          # Multi-game optimization
│   │   ├── simulator.ts          # Backtesting & Monte Carlo
│   │   ├── data.ts               # History management
│   │   └── index.ts              # Public API exports
│   ├── payment/pricing.ts        # Multi-currency pricing config
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Auth middleware (session refresh)
│   └── utils/                    # Shared utilities
├── types/                        # TypeScript type definitions
│   ├── database.ts               # Supabase auto-generated types
│   ├── saju.ts                   # Fortune-related types
│   └── lotto.ts                  # Lottery-related types
├── i18n/                         # Internationalization config
│   ├── config.ts                 # Locale definitions (ko, ja, en)
│   ├── routing.ts                # i18n routing config
│   └── request.ts                # Request-level locale
├── messages/                     # Translation JSON files
│   ├── ko.json                   # Korean (default)
│   ├── ja.json                   # Japanese
│   └── en.json                   # English
├── supabase/migrations/          # Database migration SQL files
├── data/lotto-history.json       # Historical lotto winning numbers
├── middleware.ts                  # Root middleware (auth + i18n)
├── next.config.ts                # Next.js config with next-intl plugin
├── vercel.json                   # Vercel cron jobs
└── tsconfig.json                 # TypeScript config (strict, ES2017)
```

---

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build (also serves as type-check)
npm run start     # Start production server
npm run lint      # Run ESLint (next core-web-vitals + TypeScript rules)
```

There is no separate test runner configured. Use `npm run build` to catch type errors.

---

## Architecture & Patterns

### Routing

- **App Router** with dynamic `[locale]` segment for i18n
- Route groups: `(auth)` for login/signup, `(main)` for app pages
- API routes under `app/api/` use Next.js route handlers (`GET`, `POST` exports)
- Middleware at `middleware.ts` handles both Supabase session refresh and next-intl routing

### Component Conventions

- **Server Components** (default): Layouts, page shells. Call `setRequestLocale(locale)` at the top.
- **Client Components**: Interactive UI. Marked with `'use client'` directive at file top.
- **UI primitives** in `components/ui/` wrap Radix UI with Tailwind styling via `class-variance-authority`.
- Use the `cn()` utility from `lib/utils/cn.ts` to merge Tailwind classes.

### State Management

- **Zustand** for client-side state (stores)
- **React Query** (`@tanstack/react-query`) for server data fetching and caching
- **Supabase** for persistent data (PostgreSQL)

### Authentication

- Supabase Auth with OAuth and email login
- Server-side session validation via `lib/supabase/server.ts`
- Cookie-based session managed by middleware
- OAuth callback handled at `app/api/auth/callback/route.ts`

### Internationalization

- Three locales: `ko` (default), `ja`, `en`
- Translation files in `messages/*.json`
- Use `useTranslations('namespace')` in client components
- Use `getTranslations('namespace')` in server components
- All user-facing strings must be translated; never hardcode display text

### Path Alias

- `@/*` maps to the project root (e.g., `import { cn } from '@/lib/utils/cn'`)

---

## Database

### Provider
PostgreSQL via **Supabase**. Schema defined in `supabase/migrations/`.

### Key Tables

| Table | Purpose |
|-------|---------|
| `users` | Profiles, birth data, membership, coin balance, referral info |
| `fortune_analyses` | Saju/face/compatibility results with scores and PDF/audio URLs |
| `daily_fortunes` | Daily fortune readings with category scores |
| `ai_tools` | AI tool listings with multi-language fields and affiliate data |
| `lotto_history` | Historical winning numbers and prize data |
| `lotto_recommendations` | User-generated number sets with match tracking |
| `lotto_winning_stats` | Aggregated statistics per draw round |
| `checkins` | Daily check-in records with streak tracking |

### Supabase Client Usage

- **Browser** (client components): `import { createClient } from '@/lib/supabase/client'`
- **Server** (server components, API routes): `import { createClient } from '@/lib/supabase/server'`
- Types are auto-generated in `types/database.ts`

---

## Key Business Logic

### Saju Engine (`lib/fortune/saju/`)

The core fortune calculation engine converts birth date/time into Chinese astrological pillars (year, month, day, hour), computes Five Elements (oheng) balance, and generates personality/career/health analysis. Premium modules add peer comparison, career matching, family impact analysis, and monthly action plans.

### Lotto Engine (`lib/lotto/`)

Number generation with 8+ strategies and 10+ configurable filters (sum range, odd/even ratio, consecutive limits, AC value, etc.). Includes pattern analyzer for hot/cold numbers, multi-game optimizer for coverage, and backtesting simulator with Monte Carlo support.

### Pricing (`lib/payment/pricing.ts`)

Multi-currency pricing (KRW, JPY, USD) for subscriptions (Basic/Pro/Premium), fortune products (5 tiers), and coin packages. Includes discount calculations and tier feature gates.

---

## Conventions for AI Assistants

### Code Style

- TypeScript strict mode is enabled; never use `any` without justification
- Use functional components with hooks; no class components
- Prefer named exports for components; default exports only for Next.js pages/layouts
- Use `cn()` for conditional Tailwind classes, not string concatenation
- Keep API route handlers focused: validate input, call business logic, return response

### File Organization

- New pages go in `app/[locale]/(main)/` or `app/[locale]/(auth)/`
- New API endpoints go in `app/api/`
- Business logic goes in `lib/`, not in components or API routes
- Shared types go in `types/`
- Reusable UI components go in `components/ui/`
- Feature-specific components go in `components/<feature>/`

### When Adding New Features

1. Add types to `types/` first
2. Implement business logic in `lib/`
3. Create API routes in `app/api/` if needed
4. Build UI components in `components/`
5. Create page in `app/[locale]/`
6. Add translations to all three `messages/*.json` files
7. Run `npm run build` to verify no type errors

### When Modifying the Database

- Add migration files in `supabase/migrations/` with sequential numbering (e.g., `004_*.sql`)
- Update `types/database.ts` to match schema changes
- Use Row Level Security (RLS) policies for user data access

### Common Pitfalls

- Always call `setRequestLocale(locale)` at the top of server component pages
- The `middleware.ts` handles both auth AND i18n; changes here affect all routes
- Supabase server client must be created per-request (it reads cookies)
- Translations are namespaced; check existing `messages/*.json` structure before adding keys
- The lotto cron job runs on Vercel cron (Saturday 1PM UTC / 10PM KST); see `vercel.json`

### Environment Variables

Required environment variables (not committed to git):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- Additional Supabase service role keys for server operations
- Payment provider API keys

---

## Deployment

- Hosted on **Vercel**
- Cron job configured in `vercel.json`: fetches winning lotto numbers every Saturday at 1PM UTC
- Remote images allowed from `*.supabase.co` and `lh3.googleusercontent.com`
- No custom build configuration beyond the next-intl plugin
