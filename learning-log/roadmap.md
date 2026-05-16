# Mini Z and Me — Roadmap & Backlog

> Living list of everything built so far and everything still to do.
> Updated whenever we discuss new features or ship something.

---

## ✅ Built

Most recent first. Each entry is a feature that's live in the app.

| Date | Feature | Notes |
|---|---|---|
| 16 May 2026 | **Developmental milestone chip in the activity modal** | A small coloured chip at the top of the "🌱 Links back to" block names which of the six milestones an activity targets (Cognitive growth, Social skills, Fine motor, Language, Creativity & imagination, Understanding the world). Auto-derived from each activity's `area` field through a new `milestoneFor()` helper in `data.ts`. Works for all 490+ seeded activities and any custom ones with no data migration. Landing page badge grid now reads from the same `MILESTONES` source, so the six milestones live in one place |
| 16 May 2026 | **`seed.sql` made safely re-runnable** | Added `CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS` guards on the RLS policies, and a `DELETE FROM activities WHERE user_id IS NULL;` step before the inserts. You can now paste the whole file into Supabase any time to refresh the curated content, without errors and without touching custom activities |
| 16 May 2026 | **Humanised all app copy + SQL seed activities** | Full sweep of every user-facing string across landing, /app, /dashboard, activity modal, onboarding, auth pages, 404, the small fallback activities in `data.ts`, and all 5 SQL seed files (490 activities). Em dashes removed from prose, formal phrasing swapped for plain English, sentence rhythm varied, voice warmed up to sound like a real parent wrote it |
| 16 May 2026 | **Two new developmental-milestone cards on landing** | Added 🎨 Creativity & imagination (dusty-blue) and 🌍 Understanding the world (olive) to the "Built on research" grid, rounding out the EYFS-aligned six milestones alongside the existing Cognitive growth, Social skills, Fine motor and Language |
| 16 May 2026 | **Friendlier signup error for existing emails** | When someone tries to sign up with an email that already has an account, the signup page now shows "An account with this email already exists. Try logging in instead." (Supabase, for security, doesn't return a clear error in this case — it returns a user object with an empty `identities` array, which we now detect and translate) |
| 16 May 2026 | **"How to play" emoji updated** | Changed the section heading in the activity modal from ▶️ (looked like a video play button) to 👣 (footprints), which better communicates "follow these steps" for hands-on play |
| 16 May 2026 | **Save toggle inside the activity modal** | A second save button now lives in the modal header (top-left, mirroring close). Outline star ☆ when unsaved, mustard ★ when saved, plus an "in your library" chip in the subtitle. Custom activities don't show it. State syncs both ways: toggling in the modal updates the card chip on `/app` and the library list on `/dashboard` |
| 16 May 2026 | **Activity notes / journal** | Private memory book per (child, activity). New "📓 How it went" section inside the activity modal lets a parent jot notes — "Zara loved squishing the foam, hated the wet sponge" — and they're saved to a new `activity_notes` table with RLS. Notes for the active child only. Add via textarea + button; delete via `×` on each card. Newest first |
| 16 May 2026 | **Hide activities until age picked** | `/app` no longer shows the activity grid by default. A friendly dashed-border "☝️ Pick an age to begin" panel fills the space until a parent taps an age block or a child chip |
| 16 May 2026 | **Activity cards match their age tile colour** | Every activity's accent colour now comes from its age tile (dusty rose / mustard / clay / sage / dusty blue / olive) instead of the per-subject DB colour — unified palette across the library |
| 16 May 2026 | **Toy-like UI pass v2** | Activity cards: thinner outline, colour only on the top edge (toned down from earlier sticker-borders-all-around). Age tiles became solid wooden blocks with chunky depth shadow, paper "name tag" peeking from a corner, cream typography, and wobble-on-hover. Chips got a 3D depth shadow. Background blobs gently drift. Hand-drawn SVG doodles sprinkled across `/app`. "We did this!" got a confetti emoji burst + bounce-in celebrate animation |
| 16 May 2026 | **Today's adventure** | Big terracotta card at the top of `/dashboard` that picks one activity per day for the active child. Deterministic seed (date + child id) so it stays the same until midnight. "We did this!" records the completion in a new `completed_activities` table; "Try another" / "Not feeling it" reshuffles. Child chip switcher shows when there are 2+ kids |
| 16 May 2026 | **"Tap each step to tick it off" hint** | Small italic line below "How to play" in the activity modal so users discover that steps are tickable |
| 16 May 2026 | **Quick wins batch** | 🎲 Surprise me button, subject chip counts, full edit (name + age) for children, tickable steps in the activity modal with progress message, per-route page titles, custom "Lost in the woods" 404 page |
| 16 May 2026 | **Personalised dashboard greeting** | "Welcome back, [email]" replaced with "Playing with Zara today?" using the active child's name. Handles 0, 1, 2 and 3+ children with Oxford-style joining |
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

_(Backlog empty — add new ideas here as they come up.)_

---

## 🌱 Medium features (a session each)

| Idea | Why it matters |
|---|---|
| **Themed / seasonal activity collections** | Curated bundles tied to a time of year or celebration — Christmas, Eid, Diwali, Hanukkah, summer, winter, Halloween. Filter chip + landing tiles that surface the right activities at the right time |
| **Worksheets & printable resources per activity** | For each activity, attach optional supporting materials — keyword cards, colouring sheets, image prompts, vocabulary lists — that parents can print or view |
| **Book recommendations per activity** | Suggest 2–3 picture books that pair thematically with each activity ("Water Sensory Play" → *Splash!*, *The Rainbow Fish*). Adds depth and gives parents a follow-on |
| **Day-out suggestions linked to activities** | Real-world tie-ins — visit a local farm to extend a barnyard sensory tray, a museum for a fossil-making activity, a park for a nature treasure hunt. Could start as hand-curated text, later become location-aware |
| **Search across activities** | Search bar in `/app` that filters by title or material. Useful as the library grows past 500 activities |
| **Custom-branded confirmation email (from Minizandme domain)** | Replace the default Supabase sender with a branded "no-reply@minizandme.com" address. Looks professional, less likely to land in spam, and reinforces the brand. Needs an SMTP provider (Resend, SendGrid or similar), DNS records (SPF, DKIM, DMARC) on the minizandme domain, and a custom email template wired into Supabase Auth |
| **Personalised landing page for logged-in users** | When a parent who's already signed in lands on `/`, swap the marketing copy for a personalised view: "Welcome back, Zara is 2 — here are 5 ideas for today", a quick stat ("you've played 14 activities together this month"), and shortcuts back into the app. Different value prop for first-time visitors vs returning families |
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
| **Smart recommendations from activity notes** | Read each child's saved notes ("Zara loved squishing the foam, hated wet sponges") and use them to recommend the next batch of activities. Could match keywords, themes, materials they reacted to. Eventually grows into a per-child "what works for us" intelligence layer that gets better the more notes you add |
| **Badges & rewards for completing activity sets** | Gamify the play journey. Earn a badge for completing 5 outdoor activities, all 6 milestones in a month, a full age tier, a themed seasonal set, etc. New `badges` and `earned_badges` tables, achievement-trigger logic, a "trophy shelf" on the dashboard and a tasteful celebration when one unlocks. Motivates families without turning the app into a checklist |
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

*Last updated: 16 May 2026 · synced the Built log up to today + added four new backlog ideas (branded confirmation email, personalised landing for logged-in users, smart recommendations from notes, badges & rewards)*
