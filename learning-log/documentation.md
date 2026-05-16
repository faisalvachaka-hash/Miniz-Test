# Mini Z and Me — Living Documentation

> This document is written in plain English for beginners.
> It is a living document — update it every time something new is built.

---

## 1. Project Overview

**Mini Z and Me** is a web app designed for parents and carers of young children aged 0–5. The goal is to make early years play and learning easy and fun. Parents can browse curated activity ideas organised by their child's age, or type in their own activity idea and the app will generate a full plan — including what materials they'll need, step-by-step instructions, how long to expect the activity to last, and how it links back to an earlier stage of their child's development.

The name comes from the brand **Mini Z and Me**, which is built around early years education.

---

## 2. Tech Stack

These are the tools and technologies the app is built with:

| Technology | What it is | Why we use it |
|---|---|---|
| **Next.js** | A framework for building websites with React | Gives us fast page loads, routing (moving between pages), and modern web app structure |
| **React** | A JavaScript library for building user interfaces | Lets us build interactive components like the age tiles, activity cards, and forms |
| **TypeScript** | JavaScript with added type checking | Catches mistakes in code before they become bugs |
| **Tailwind CSS** | A styling framework | Lets us style the app quickly using short class names instead of writing lots of CSS from scratch |
| **Supabase** | A backend-as-a-service platform | Gives us a database and authentication (signup/login) without having to build a server from scratch |

---

## 3. Folder Structure

Below is a map of the important files and folders in this project, explained in plain English.

```
Project 1 - Mini Z App/
│
├── src/                        ← All the source code lives here
│   ├── app/                    ← Each folder here = a page on the website
│   │   ├── page.tsx            ← The public landing page (/) — marketing, features, CTAs
│   │   ├── layout.tsx          ← The wrapper that wraps every page (sets font, title, etc.)
│   │   ├── not-found.tsx       ← The custom 404 "Lost in the woods" page
│   │   ├── globals.css         ← Global styles — colours, animations, shared CSS classes
│   │   ├── app/
│   │   │   ├── layout.tsx      ← Sets the browser tab title for /app
│   │   │   └── page.tsx        ← The protected activity browser (/app) — age tiles, cards, builder
│   │   ├── signup/
│   │   │   ├── layout.tsx      ← Browser tab title
│   │   │   └── page.tsx        ← The signup page (/signup)
│   │   ├── login/
│   │   │   ├── layout.tsx      ← Browser tab title
│   │   │   └── page.tsx        ← The login page (/login)
│   │   ├── forgot-password/
│   │   │   ├── layout.tsx      ← Browser tab title
│   │   │   └── page.tsx        ← Request a password reset link (/forgot-password)
│   │   ├── reset-password/
│   │   │   ├── layout.tsx      ← Browser tab title
│   │   │   └── page.tsx        ← Set a new password from the email link (/reset-password)
│   │   ├── onboarding/
│   │   │   ├── layout.tsx      ← Browser tab title
│   │   │   └── page.tsx        ← First-time setup — add your first child (/onboarding)
│   │   └── dashboard/
│   │       ├── layout.tsx      ← Browser tab title
│   │       └── page.tsx        ← Library + child profile management + personalised greeting (/dashboard)
│   │
│   ├── components/             ← Reusable building blocks used across pages
│   │   ├── MinizApp.tsx        ← The main activity app (age tiles, cards, builder)
│   │   ├── ActivityModal.tsx   ← The pop-up that shows full details for an activity
│   │   └── AuthLayout.tsx      ← The shared card/background layout used by all auth pages
│   │
│   └── lib/                    ← Shared utilities and connections
│       ├── supabase.ts         ← Creates the connection to Supabase (used by all auth pages)
│       └── data.ts             ← Type definitions, age groups, keywords, and the activity generator function
│
├── supabase/                   ← SQL files that set up the database
│   ├── seed.sql                ← Activities table CREATE + RLS + original 13 curated activities
│   ├── seed_water_play.sql     ← 120 Water Play activities (ages 0–5, 20 per age)
│   ├── seed_sand_play.sql      ← 120 Sand Play activities (ages 0–5, 20 per age)
│   ├── seed_arts_crafts.sql    ← 120 Arts & Crafts activities (ages 0–5, 20 per age)
│   ├── seed_nature.sql         ← 120 Outdoor / Nature activities (ages 0–5, 20 per age)
│   ├── children_table.sql      ← Children table CREATE + RLS for child profiles
│   ├── saved_activities_table.sql ← Join table tracking which curated activities each user has saved
│   ├── completed_activities_table.sql ← Records each activity a child has completed (powers "Today's adventure")
│   └── activity_notes_table.sql ← Private memory notes per (child, activity) — the journal
│
├── prototype/
│   └── index.html              ← The original single-file HTML prototype (kept for reference)
│
├── learning-log/
│   ├── documentation.md        ← This file — the living documentation for the project
│   └── roadmap.md              ← Running list of what's been built + the feature backlog
│
├── public/                     ← Static files (images, icons) that are served directly
│   └── logo.png                ← The Mini Z and Me brand mark (used by the logo on every page)
│
├── .env.local                  ← Secret environment variables (NOT on GitHub — see section 9)
├── .gitignore                  ← Tells Git which files to never upload to GitHub
├── package.json                ← Lists all the packages (tools) this project depends on
├── tsconfig.json               ← TypeScript configuration
├── next.config.ts              ← Next.js configuration
└── tailwind.config / postcss   ← Tailwind CSS configuration
```

---

## 4. Pages Built So Far

### Landing Page — `/`

The homepage is now a **public marketing landing page** — the front door of the product, designed to convert new visitors into signups. It starts with a hero section ("Turn playtime into learning time") and two big call-to-action buttons: **Get started free** (goes to `/signup`) and **Log in** (goes to `/login`). Below the hero, there is a "How it works" section with three numbered steps, a features grid that highlights what the app offers (expert-curated activities, subject filters, build-your-own, save to library), a preview strip showing three sample activity cards, a development-rooted section explaining the educational philosophy, and a final gradient CTA banner. The page ends with a footer. This page does **not** require login.

### Activity Browser — `/app`

The activity browser is what used to live on the homepage. It is now a **protected page** — only logged-in users can see it. When the page loads, it first checks with Supabase whether there is a logged-in user; if not, it redirects to `/login`. It then loads the user's **child profiles** — if the user has no children yet, it sends them to `/onboarding` to add one. Once inside, a row of **child chips** appears at the top ("Showing for: 👶 Zara · 3"), with an active child highlighted. The matching age tile is pre-selected and the builder dropdown is pre-set to that child's age, but every age tile remains visible and clickable so a parent can switch any time. Clicking another child chip changes the active filter instantly; a dashed **+ Add child** chip links to the dashboard. The header still shows **My Library** (goes to `/dashboard`) and **Log Out**.

Below the chip row, the experience is unchanged in shape: six colourful age tiles, subject filter chips, the activity card grid (when an age is selected), modals with full activity details, and the "Build your own activity" tool at the bottom.

**Age-gated browsing** — the activity grid is **hidden by default**. A friendly dashed-border panel ("☝️ Pick an age to begin") fills the space until the parent taps one of the age blocks (or clicks a child chip, which selects that child's age). This keeps the page calm and intentional — every browsing session starts with a deliberate "we're playing with this age today" moment, rather than dumping 493 activities on the screen at once. Tapping the same age tile again toggles back to the empty state.

**Visual unity** — every activity card uses the colour of its **age tile** (dusty rose for 0, mustard for 1, clay for 2, sage for 3, dusty blue for 4, olive for 5). So when a parent filters to a single age, the whole grid reads as a cohesive set of stickers in that age's colour. The icon block, top-edge stripe and modal header all match.

A few quality-of-life touches:

- **Subject chip counts** — each subject filter shows how many activities it contains, e.g. "💧 Water Play (120)"
- **🎲 Surprise me! button** — picks a random activity from the current filter (or the whole library if no filter) and opens its modal. Great for indecisive Tuesdays
- **Tickable steps in the activity modal** — every step under "How to play" is clickable. Tap to mark it done (greys out + strikethrough); tap again to un-tick. A live progress line shows "2 of 4 done — keep going!" → "🎉 All done! Great play." once everything's ticked. The ticks reset when the modal closes — this is a live play-along helper, not a saved progress tracker
- **Activity notes / journal** — a private "📓 How it went · [child's name]" section in the modal. Parents can jot quick memories ("Zara loved squishing the foam — wanted to do it twice") which are saved per `(child, activity)` pair in the `activity_notes` table. Notes are listed newest-first with a date stamp, and a small `×` button removes each one. Each note appears as a paper card with a coloured left edge matching the activity's age tile

**Saving curated activities** — every curated activity card has a small star button in the top-right corner. An outlined star (☆) means the activity isn't in your library yet; a filled star (★) means it is. Clicking the star toggles the saved state instantly (no page reload) and adds a "★ saved" chip to the card. The activity then shows up in your library on the dashboard. Custom activities you built yourself don't show a star — they're always in your library by definition.

The same save toggle also lives **inside the activity modal**, mirroring the close button at the top-left of the header (mustard ★ when saved, paper ☆ when not). A small "★ in your library" chip appears in the modal subtitle when the activity is in the user's library. The two save buttons stay in sync — toggling either one updates the card chip on `/app` and the library list on `/dashboard` immediately.

### Signup Page — `/signup`

The signup page is where a new user creates their account. It shows a simple form with an email address field and a password field (minimum 6 characters). When the user clicks **Sign Up**, the app sends their details to Supabase which creates the account and sends a confirmation email. Once submitted, the page switches to a success screen telling the user to check their inbox and click the link to verify their email address. There is also a link at the bottom for users who already have an account to go straight to login instead.

### Login Page — `/login`

The login page is where existing users sign in. It has the same clean card design as signup. The user enters their email and password and clicks **Log In**. If the details are correct, Supabase confirms the session and the app checks whether the user has any child profiles set up: if they already have at least one child, they go straight to `/app` (the activity browser); if not, they're sent to `/onboarding` to add their first child. If the login details are wrong, an error message appears below the form. There are two links at the bottom: one to the signup page for new users, and a **Forgot password?** link to start the password reset flow.

### Forgot Password — `/forgot-password`

This page is where a user can request a password reset link if they have forgotten their password. The user enters their email address and clicks **Send reset link**. The app calls `supabase.auth.resetPasswordForEmail()` which sends an email containing a special link. The page then switches to a "Check your inbox 📬" confirmation screen. The link in the email takes the user to `/reset-password`.

### Reset Password — `/reset-password`

When the user clicks the email link, they land on `/reset-password`. The page reads a special `code` from the URL and exchanges it with Supabase for a temporary session that lets the user update their password. The user then enters their new password twice and submits. If successful, the user is automatically logged in and routed to `/app` (or to `/onboarding` if they don't yet have a child profile). If the link has expired or is invalid, an error screen appears with a button to request a new link.

### Onboarding — `/onboarding`

The onboarding page is a one-time setup screen for new users. It appears the first time a user logs in (or signs up) before they reach the activity browser, so the very first thing the app knows about them is who their child is. The form asks for the **child's name** and **age** (0–5, picked from a friendly dropdown). When submitted, the profile is saved to Supabase's `children` table. The user is then taken straight to `/app` with the child already active. If a logged-in user visits `/onboarding` after already having children, the page silently redirects to `/app` — there is no way to get stuck here. More children can be added later from the dashboard.

### Dashboard — `/dashboard`

The dashboard is a protected page — only logged-in users can see it. When the page loads, it checks for a logged-in user; if none, it redirects to `/login`. The page is organised into four cards:

1. **Welcome card** — a personalised greeting built from the user's child profiles:
   - No children → "Welcome back!"
   - One child → "Playing with Zara today?"
   - Two children → "Playing with Zara & Sam today?"
   - Three or more → "Playing with Zara, Sam & Mia today?" (Oxford-style joining)

   The user's email appears underneath as small secondary text ("Signed in as you@example.com") so they can still confirm which account they're in
2. **Today's adventure card** — a prominent terracotta block that suggests one activity a day for the active child. The pick is **deterministic per (date, child)** — it stays the same all day, then changes at midnight — so the dashboard feels like a daily news feed. Two CTAs:
   - **✓ We did this!** records a completion in the `completed_activities` table and flips the card to a "🎉 Nicely done, [child's name]!" success state
   - **Not feeling it** / **🎲 Try another** reshuffles to a different activity for the same age, without recording anything

   If the user has multiple children, a small chip switcher in the card header lets them flip between kids. The active child is shared with `/app` via the same `miniz_active_child_id` localStorage key, so switching on either page is reflected everywhere
3. **My children card** — lists every child profile (avatar + name + age stage). Each row has an **Edit** button which switches the row into an inline editor showing both name and age fields, with **Save** and **Cancel** buttons. Enter saves, Escape cancels. There's also a **Remove** button (with confirmation). At the top of the card, a **+ Add child** button reveals a small form for name and age. Brand-new users will see an empty state if they delete all their children
4. **My library card** — a single merged list of everything in the user's library: activities they've built with the builder (tagged "✨ custom") plus curated activities they've starred (tagged "★ saved"). Every card has an `×` button in the top-right. For a starred curated activity, the `×` simply unsaves it (the activity itself stays in the public library on `/app`). For a custom activity, the `×` asks for confirmation and then permanently deletes it. If the library is empty, an encouraging empty state points the user back to `/app`

There is a **Log out** button in the top-right and quick links at the bottom that jump back to the activity library or the landing page.

### 404 Page — anything else

If anyone visits a URL that doesn't exist, they get a warm "🐾 Lost in the woods" paper card instead of Next's default 404. Two buttons: **Back home →** (to `/`) and **Go to activities** (to `/app`). The card uses the same Caveat handwritten font and slight rotation as the rest of the app, so even an error page feels on-brand.

---

## 5. How Authentication Works

Authentication is the system that handles signing up, logging in, and logging out. Here is what happens behind the scenes:

**Signing up:**
1. The user fills in their email and password on `/signup`
2. The app sends those details to Supabase using `supabase.auth.signUp()`
3. Supabase creates a new user account and sends a confirmation email
4. The user clicks the link in that email to verify their address
5. The account is now active

**Logging in:**
1. The user fills in their email and password on `/login`
2. The app sends those details to Supabase using `supabase.auth.signInWithPassword()`
3. Supabase checks if the details match — if yes, it creates a session (think of it like a wristband that proves you're allowed in)
4. The app redirects the user to `/dashboard`

**Staying logged in / protecting pages:**
- Supabase stores the session in the browser automatically
- When the dashboard loads, it calls `supabase.auth.getUser()` to check if a valid session exists
- If no session → redirect to `/login`
- If session found → show the dashboard

**Logging out:**
1. The user clicks the Log Out button
2. The app calls `supabase.auth.signOut()` which deletes the session
3. The app redirects to `/` (the landing page) or `/login` depending on where the user was

**Forgotten password (reset flow):**
1. On `/login` the user clicks **Forgot password?** and lands on `/forgot-password`
2. The user types their email and the app calls `supabase.auth.resetPasswordForEmail()`
3. Supabase emails them a special link containing a one-time `code`
4. Clicking the link sends them to `/reset-password?code=…`
5. The app calls `supabase.auth.exchangeCodeForSession(code)` which exchanges the code for a temporary session
6. The user types a new password and the app calls `supabase.auth.updateUser({ password })`
7. The user is automatically logged in and sent to `/app`

---

## 6. The Activity Library

The app's activity content lives in a Supabase database table called `activities`. Every card the user sees in the activity browser comes from this table. There are two kinds of activities:

- **Curated activities** — official content shipped with the app. These have `is_custom = false` and `user_id = NULL`. They are visible to every user.
- **Custom activities** — activities a logged-in user creates using the "Build your own" tool. These have `is_custom = true` and `user_id = <the user's id>`. Row-Level Security (RLS) policies in Supabase make sure users only see their own custom activities, never anyone else's.

**Seed files (in `/supabase/`)**

The library is built up by running SQL "seed" files in the Supabase SQL Editor. Each one inserts a batch of curated activities:

| Seed file | Subject | Rows |
|---|---|---|
| `seed.sql` | Mixed — original 13 curated activities + table CREATE + RLS policies | 13 |
| `seed_water_play.sql` | Water Play 💧 | 120 (ages 0–5, 20 per age) |
| `seed_sand_play.sql` | Sand Play 🏖️ | 120 (ages 0–5, 20 per age) |
| `seed_arts_crafts.sql` | Arts & Crafts 🎨 | 120 (ages 0–5, 20 per age) |
| `seed_nature.sql` | Outdoor 🌿 | 120 (ages 0–5, 20 per age) |

In total there are around **493 curated activities** across six subjects (Science, Maths, Writing, Sensory Play, Arts & Crafts, Outdoor, Water Play, Sand Play).

**Subject chips and emojis** — the activity browser auto-discovers which subjects exist in the database and shows them as filter chips at the top. A small lookup table in `MinizApp.tsx` called `SUBJECT_EMOJIS` maps each subject name to the emoji that appears on its chip. New subjects appear automatically — if no emoji is mapped, a default 📚 is used.

**The `saved_activities` join table**

When a user "stars" a curated activity, we don't copy the activity — we just record that this user saved that activity. This lives in a separate table called `saved_activities`:

| Column | What it is |
|---|---|
| `user_id` | Who saved it. Links to `auth.users` |
| `activity_id` | What they saved. Links to `activities` |
| `created_at` | When they saved it |

The primary key is the combination of `(user_id, activity_id)` — meaning a user can save any activity at most once. If the user is deleted, all their saves go with them. If a curated activity is ever deleted, the save records disappear cleanly too.

Row-Level Security on this table means users can only read, insert and delete their own saves — never anyone else's. There's no UPDATE policy because there's nothing to update; you either have a save or you don't.

When the dashboard loads the user's library, it pulls custom activities and saved curated activities in parallel (`Promise.all`), tags each one with its source, and merges them into a single list for display.

---

## 7. Personalisation: Child Profiles

A parent can save one or more child profiles to their account. The app uses this to pre-filter activities for the right age, so the parent doesn't have to re-pick the age tile every time they open the app.

**The `children` table**

Child profiles live in a Supabase table called `children`. Each row stores:

| Column | What it is |
|---|---|
| `id` | A unique identifier (UUID), generated automatically |
| `user_id` | Who the child belongs to. Links to the parent's account in `auth.users`. If the parent deletes their account, their children's profiles are deleted too |
| `name` | The child's first name |
| `age` | A whole number from 0 to 5 |
| `created_at` | When the profile was added |

Row-Level Security (RLS) policies on this table mean a user can only ever read, insert, update or delete **their own** children — never anyone else's.

**The first-run experience**

When a brand-new user logs in for the first time, the login page checks if they have any children:
- **Yes** → straight to `/app`
- **No** → off to `/onboarding` to add their first child

`/onboarding` is a single-screen form (name + age dropdown). Once submitted, the child is saved to Supabase and the user is sent into the activity browser. If a user with no children somehow visits `/app` directly, the same redirect happens there too — there's no way to use the activity browser without at least one child profile.

**The active child**

The activity browser remembers which child is "active" (the one being filtered for). The active child's id is saved to `localStorage` in the browser under the key `miniz_active_child_id`, so it persists across page reloads. When the user switches child by clicking a chip, the localStorage value updates instantly.

If the localStorage value is missing (first visit) or points to a child that's been deleted, the app falls back to the first child in the user's list.

**What pre-filtering means in practice**

When `/app` opens:
- The age tile matching the active child's age is **pre-selected** (the card grid below is already filtered)
- The "Build your own" age dropdown is **pre-set** to the active child's age

All six age tiles stay visible and clickable — pre-filtering is a smart default, never a lock. The parent can browse activities for any age at any time, then click their child's chip again to return to the personalised view.

---

## 8. Design System: Hand-Crafted, Tactile, Warm

Mini Z and Me is styled to feel like a Montessori toy — warm, hand-made, emotionally safe — not like a typical software dashboard. The visual language is built around a few simple ideas:

**Colours**

The palette is taken straight from the brand logo:

| Token | Hex | Used for |
|---|---|---|
| `--clay` | `#b85a40` | Primary terracotta — buttons, brand mark, big numbers |
| `--clay-dark` | `#8c4530` | The "wood block" shadow beneath terracotta buttons |
| `--cream` | `#f5e8d3` | Page background |
| `--paper` | `#fbf3e3` | Cards and surfaces — a touch lighter than the background |
| `--paper-edge` | `#e9d9bd` | Soft borders and shadows for paper-like depth |
| `--ink` | `#4a3424` | Body text, warm dark brown (never pure black) |
| `--ink-soft` | `#8a6e5a` | Secondary text |
| `--sage` `--mustard` `--dusty-rose` `--dusty-blue` `--olive` | various | Accent colours — wooden-toy tones, used for category buttons, child avatars, decorative shapes |

**Typography**

Two fonts, used for different jobs:

- **Caveat** (`var(--font-display)`) — a handwritten cursive used for headings, big numbers, brand wordmarks. Adds warmth and personality.
- **Nunito** (`var(--font-body)`) — a rounded, friendly sans-serif used for body text, buttons, labels. Easy to read at any size.

**Imperfect, hand-cut shapes**

Cards and badges use uneven border-radii (e.g. `24px 28px 22px 30px` instead of one round number) so each corner is slightly different — it looks cut by hand rather than generated by a computer. Reusable radius tokens are defined as `--r1`, `--r2`, `--r3`, `--r4` and `--r-pill`. Avatars and small icons use lopsided "blob" radii to look like wooden pebbles instead of perfect circles.

Many cards on the page are also rotated by a tiny amount (`-0.5deg`, `0.3deg`) so the layout feels like things were laid down by hand on a table, not snapped to a grid.

**Chunky wooden-block buttons**

The primary call-to-action button is a solid terracotta block with a darker terracotta "shadow" underneath it (`box-shadow: 0 5px 0 var(--clay-dark)`). When the user hovers, the button lifts slightly. When clicked, it presses down 4 pixels and the bottom shadow disappears — the same satisfying motion you'd get pushing a real wooden block.

**Paper feel**

The whole page sits on a faint paper-grain noise texture (added via a tiny inline SVG in `body::before`). Soft layered drop-shadows on cards mimic the way a paper card casts shadow on a table, rather than the harsh box-shadow look of typical web UI. Decorative pastel blob shapes drift in the background to add depth without distraction.

**No-no list**

The design deliberately avoids: gradients (especially neon ones), glassmorphism / frosted-glass effects, pure white surfaces, perfectly symmetrical shapes, generic SaaS-style "cards in a grid", and high-contrast / startup-aesthetic palettes.

---

## 9. Environment Variables

Environment variables are settings that are kept secret and stored locally on your machine — they are **never uploaded to GitHub**. This project uses a file called `.env.local` (in the root of the project) to store them.

The `.gitignore` file contains the rule `.env*` which ensures this file is always excluded from Git.

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | The unique web address of your Supabase project. Found in: Supabase Dashboard → Project Settings → Data API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The public/anon key that allows the browser to talk to Supabase safely. Found in the same place. **Important:** use the `anon public` key — NOT the `service_role` secret key |

> **Why NEXT_PUBLIC_?** Any variable that starts with `NEXT_PUBLIC_` is intentionally made available in the browser. The anon key is designed to be public. The service role key should never start with `NEXT_PUBLIC_` and should never be used in the browser.

---

## 10. How to Run the App Locally

Follow these steps to run the project on your own computer:

**Step 1 — Make sure you have Node.js installed**
Open a terminal and type `node --version`. You should see a version number (e.g. `v24.x.x`). If not, download Node.js from [nodejs.org](https://nodejs.org).

**Step 2 — Open the project folder in your terminal**
```
cd "C:\Users\faisa\Documents\Project\Project 1 - Mini Z App"
```

**Step 3 — Install dependencies (first time only)**
```
npm install
```
This downloads all the packages listed in `package.json`. You only need to do this once (or after pulling new changes from GitHub that added new packages).

**Step 4 — Make sure your `.env.local` file exists**
The file should be in the root of the project and contain:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```
Get these values from your Supabase dashboard (Project Settings → Data API).

**Step 5 — Start the development server**
```
npm run dev
```

**Step 6 — Open the app**
Go to [http://localhost:3000](http://localhost:3000) in your browser.

To stop the server, press `Ctrl + C` in the terminal.

---

## 11. How to Save Changes to GitHub

Every time you finish a piece of work, save it to GitHub with these three commands:

```
git add .
git commit -m "Describe what you changed"
git push
```

- `git add .` — stages all changed files (but never `.env.local` — it's blocked)
- `git commit -m "..."` — takes a snapshot with a message describing the change
- `git push` — uploads the snapshot to GitHub

---

## 12. What Still Needs to Be Built

These features are planned but not yet built:

| Feature | Description |
|---|---|
| **Activity images** | Add illustrations or photos to each activity card to make it more visually engaging |
| **Deployment** | Deploy the app to Vercel (free) so it has a real public web address anyone can visit |
| **Email verification on signup** | Currently the signup flow shows a "check your inbox" screen, but verification could be polished — e.g. resending the link, custom email design |
| **Activity favourites** | Let users heart/star curated activities as well as save custom ones |
| **"Today's activity" surface** | A single daily suggestion on the dashboard, picked based on the active child's age |

✅ **Recently completed (May 2026):**
- Public marketing landing page at `/`
- Protected activity browser moved to `/app`
- Password reset flow (`/forgot-password` and `/reset-password`)
- 480 new curated activities across four new subject seeds (Water Play, Sand Play, expanded Arts & Crafts, expanded Outdoor)
- Saving custom activities to Supabase (per-user with RLS)
- Personal activity library on `/dashboard`
- **Child profiles** — onboarding screen, active-child chip switcher, pre-filtered age, dashboard management
- **Save curated activities to library** — star button on each card, unified library view on the dashboard, remove/delete controls
- **Hand-crafted Montessori-toy redesign** — new warm terracotta + cream palette, handwritten Caveat headings, paper-feel cards with imperfect corners, chunky "wooden block" buttons, brand logo image
- **Personalised dashboard greeting** — "Playing with Zara today?" instead of "Welcome back, [email]"
- **Quick wins batch** — 🎲 Surprise me button, subject chip counts, inline edit-name-and-age for children, tickable steps in the activity modal with progress message, per-route browser tab titles, custom 🐾 "Lost in the woods" 404 page
- **Today's adventure** — one daily activity suggestion per child on the dashboard, with "We did this!" tracking in a new `completed_activities` table. Deterministic daily pick that resets at midnight
- **Toy-like UI pass v2** — solid wooden-block age tiles with a corner "name tag" and chunky depth shadow, sticker-style cards with colour confined to the top edge, hand-drawn SVG doodles sprinkled into `/app`, drifting blob shapes, confetti burst on "We did this!"
- **Age-matched activity colours** — every activity adopts its age tile's colour, so a filtered library reads as a cohesive set
- **Age-gated activity grid** — the activity grid only appears once a parent has selected an age (intentional browsing, calmer first paint)
- **Activity notes / journal** — private memory journal per `(child, activity)` inside the activity modal. Notes are saved to a new `activity_notes` Supabase table with RLS
- **Save toggle inside the activity modal** — mirrors the card-level star button, syncs with the rest of the UI

---

## 13. End of Session Checklist

Run through these three steps at the end of every coding session to keep your work saved, your learning recorded, and your documentation up to date.

**Step 1 — Save your work**

Tell Claude:
> "Commit all changes to GitHub with the message: 'Built: [what you built today]'"

**Step 2 — Update your learning diary**

Tell Claude:
> "Add to learning-log/notes.md: Today I learned [what clicked today]. Commit with message: 'Learned: [summary]'"

**Step 3 — Update documentation**

Tell Claude:
> "Update learning-log/documentation.md to reflect what we built today. Commit with message: 'Docs: [what changed]'"

---

*Last updated: 16 May 2026 — save toggle now lives inside the activity modal too*
