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
| **Themed / seasonal activity collections** | Curated bundles tied to a time of year or celebration — Christmas, Eid, Diwali, Hanukkah, summer, winter, Halloween. Filter chip + landing tiles that surface the right activities at the right time |
| **Worksheets & printable resources per activity** | For each activity, attach optional supporting materials — keyword cards, colouring sheets, image prompts, vocabulary lists — that parents can print or view |
| **Book recommendations per activity** | Suggest 2–3 picture books that pair thematically with each activity ("Water Sensory Play" → *Splash!*, *The Rainbow Fish*). Adds depth and gives parents a follow-on |
| **Day-out suggestions linked to activities** | Real-world tie-ins — visit a local farm to extend a barnyard sensory tray, a museum for a fossil-making activity, a park for a nature treasure hunt. Could start as hand-curated text, later become location-aware |
| **Search across activities** | Search bar in `/app` that filters by title or material. Useful as the library grows past 500 activities |
| **Email verification polish** | Resend confirmation link, custom-branded confirmation email |
| **Recently viewed** | A small "Recently viewed" strip on `/app` using localStorage |

---

## 🌳 Bigger projects

Real lift but high-impact. Plan carefully before starting.

| Idea | Why it matters |
|---|---|
| **Deploy to Vercel** | Get the app on a real public URL so others can use it. Currently postponed by user preference |
| **Real-life imagery throughout** | Replace emoji icons on the age tiles and activity cards with real photos / illustrations of children, materials and toys. Warm, tactile, authentic — matches the Montessori-toy aesthetic better than emoji ever can. Big content effort but high payoff |
| **Activity setup photos** | For each activity, add 1–3 photos showing how it's actually set up (the tray ready to go, the materials laid out, the child mid-play). Hugely useful for parents who are visual learners and want to know what "good" looks like before they start |
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

*Last updated: 16 May 2026 — added themed/seasonal, worksheets, book recs, day-outs, real-life imagery, setup photos*
