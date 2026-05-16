# Mini Z and Me — Roadmap & Backlog

> Living list of everything built so far and everything still to do.
> Updated whenever we discuss new features or ship something.

---

## ✅ Built

Most recent first. Each entry is a feature that's live in the app.

| Date | Feature | Notes |
|---|---|---|
| 16 May 2026 | **Montessori-toy redesign** | Warm terracotta + cream palette, handwritten Caveat headings, paper-feel cards with imperfect corners, chunky "wooden block" buttons, brand logo image. See `documentation.md` §8 for the full design system |
| 16 May 2026 | **Save curated activities to library** | Star button on every curated card, unified library view on `/dashboard` with `×` remove buttons. New `saved_activities` join table with RLS |
| 16 May 2026 | **Child profiles** | Onboarding screen for first-time users, active-child chip switcher on `/app`, pre-filtered age, add/edit/delete children from dashboard. New `children` table with RLS |
| 15 May 2026 | **480 new curated activities** | Four new SQL seed files: Water Play, Sand Play, Arts & Crafts, Outdoor / Nature (120 activities each, ages 0–5) |
| 15 May 2026 | **Public landing page + protected `/app`** | Marketing landing at `/`, activity browser moved to `/app` behind auth |
| 15 May 2026 | **Password reset flow** | `/forgot-password` and `/reset-password` pages using Supabase magic-link |
| 14 May 2026 | **Custom activity saving** | "Build your own" tool persists activities to Supabase per user with RLS |
| 14 May 2026 | **Login + signup + dashboard** | Email/password auth via Supabase, protected `/dashboard` with personal library |
| 13 May 2026 | **Activity browser MVP** | Age tiles, subject filters, activity cards, modal with materials/steps/prior stage, "Build your own" generator |

---

## 🚀 Quick wins (low effort — under 20 min each)

Small bites that punch above their weight. Pick freely.

| Idea | Effort | Why |
|---|---|---|
| **Personalised dashboard greeting** | ~10 min | Replace "Welcome back, [email]" with "Playing with Zara today?" using the active child's name. Makes the app feel personal |
| **"Surprise me!" button** | ~15 min | A button on `/app` that picks a random activity for the active child's age and opens the modal. Pure delight |
| **Subject chip counts** | ~10 min | Show "(120)" after each subject filter chip so parents see how big each category is |
| **Edit child's name** | ~15 min | Extend the existing inline edit-age pattern on `/dashboard` to also edit the name |
| **Tick steps done in the modal** | ~20 min | Checkboxes next to each step that strike through when ticked. Local-only, no DB. Makes the modal useful during play |
| **Page titles per route** | ~10 min | `<title>` per page (e.g. "Log in · Mini Z and Me") so browser tabs are readable |
| **404 page** | ~15 min | Custom warm "lost in the woods" page instead of Next's default |

---

## 🌱 Medium features (a session each)

| Idea | Why it matters |
|---|---|
| **"Today's activity" surface** | A single daily suggestion on the dashboard, picked from the active child's age, with a "we did this!" button. Single biggest engagement lever — turns the app from a one-time visit into a daily habit |
| **Activity notes / journal** | After a parent does an activity, let them jot a quick note ("Zara loved the foil bit, hated the wet sponge"). Builds a private journal per child. Strong emotional payoff |
| **Search across activities** | Search bar in `/app` that filters by title or material. Useful as the library grows past 500 activities |
| **Email verification polish** | Resend confirmation link, custom-branded confirmation email |
| **Recently viewed** | A small "Recently viewed" strip on `/app` using localStorage |

---

## 🌳 Bigger projects

Real lift but high-impact. Plan carefully before starting.

| Idea | Why it matters |
|---|---|
| **Deploy to Vercel** | Get the app on a real public URL so others can use it. Currently postponed by user preference |
| **Activity images / illustrations** | Replace the emoji icons with small custom illustrations on each card. Big visual upgrade, but slow because each of ~493 activities needs an image |
| **"You might also like…" suggestions** | After viewing or starring activities, suggest related ones based on subject + age + what other parents enjoyed |
| **Child progress timeline** | Visualise per-child what's been done, with photos and notes. Long-form keepsake |
| **Multi-language support** | Translate UI and (eventually) activity content. Big undertaking |
| **Mobile PWA install prompt** | Make the app installable as a home-screen icon on phones |

---

## 🧊 Parking lot

Ideas captured but not yet evaluated. Move up the list when a real reason appears.

- Sharing an activity with another parent (link or QR)
- Print / PDF an individual activity
- Activity ratings ("we'd do this again") aggregated across users
- Activity difficulty ratings beyond "Ease of prep"
- Filtering by available materials ("show me activities I can do with stuff in the kitchen")
- Sibling pairs — activities that work for two children of different ages at once
- Audio narration of steps for busy parents
- Reminders / push notifications for daily activity
- Family accounts (multiple adults, shared library)

---

*Last updated: 16 May 2026*
