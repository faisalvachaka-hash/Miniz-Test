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
│   │   ├── page.tsx            ← The homepage (/)
│   │   ├── layout.tsx          ← The wrapper that wraps every page (sets font, title, etc.)
│   │   ├── globals.css         ← Global styles — colours, animations, shared CSS classes
│   │   ├── signup/
│   │   │   └── page.tsx        ← The signup page (/signup)
│   │   ├── login/
│   │   │   └── page.tsx        ← The login page (/login)
│   │   └── dashboard/
│   │       └── page.tsx        ← The protected dashboard page (/dashboard)
│   │
│   ├── components/             ← Reusable building blocks used across pages
│   │   ├── MinizApp.tsx        ← The main activity app (age tiles, cards, builder, modal)
│   │   └── AuthLayout.tsx      ← The shared card/background layout used by login and signup
│   │
│   └── lib/                    ← Shared utilities and connections
│       ├── supabase.ts         ← Creates the connection to Supabase (used by all auth pages)
│       └── data.ts             ← All the activity content, age groups, keywords, and the activity generator function
│
├── prototype/
│   └── index.html              ← The original single-file HTML prototype (kept for reference)
│
├── learning-log/
│   └── documentation.md        ← This file — the living documentation for the project
│
├── public/                     ← Static files (images, icons) that are served directly
│
├── .env.local                  ← Secret environment variables (NOT on GitHub — see section 6)
├── .gitignore                  ← Tells Git which files to never upload to GitHub
├── package.json                ← Lists all the packages (tools) this project depends on
├── tsconfig.json               ← TypeScript configuration
├── next.config.ts              ← Next.js configuration
└── tailwind.config / postcss   ← Tailwind CSS configuration
```

---

## 4. Pages Built So Far

### Homepage — `/`

The homepage is the main activity browser. It shows six colourful age tiles across the top (0 years through to 5 years). Clicking a tile filters the activity cards below to only show activities for that age group. Each activity card shows the activity name, age range, focus area (e.g. "Sensory · Fine motor"), and how long it takes. Clicking a card opens a pop-up modal with full details: a materials list, step-by-step instructions, expected duration, and a section explaining how the activity links to an earlier stage of development. At the bottom of the page there is a "Build your own activity" tool — the parent types in a play idea (e.g. "water sensory play for my 2 year old"), picks the age, and the app generates a full activity plan. In the top-right corner there are **Log In** and **Sign Up** buttons linking to the auth pages.

### Signup Page — `/signup`

The signup page is where a new user creates their account. It shows a simple form with an email address field and a password field (minimum 6 characters). When the user clicks **Sign Up**, the app sends their details to Supabase which creates the account and sends a confirmation email. Once submitted, the page switches to a success screen telling the user to check their inbox and click the link to verify their email address. There is also a link at the bottom for users who already have an account to go straight to login instead.

### Login Page — `/login`

The login page is where existing users sign in. It has the same clean card design as signup. The user enters their email and password and clicks **Log In**. If the details are correct, Supabase confirms the session and the app automatically takes the user to the dashboard. If the details are wrong, an error message appears below the form. There is a link at the bottom for new users to go to the signup page instead.

### Dashboard — `/dashboard`

The dashboard is a protected page — only logged-in users can see it. When the page loads, the first thing it does is ask Supabase "is there a logged-in user right now?" If the answer is no, the app immediately redirects to `/login`. If the answer is yes, the page loads and shows a welcome message with the user's email address, along with quick links back to the activity library. There is a **Log Out** button in the top-right corner — clicking it tells Supabase to end the session and sends the user back to the login page.

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
3. The app redirects to `/login`

---

## 6. Environment Variables

Environment variables are settings that are kept secret and stored locally on your machine — they are **never uploaded to GitHub**. This project uses a file called `.env.local` (in the root of the project) to store them.

The `.gitignore` file contains the rule `.env*` which ensures this file is always excluded from Git.

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | The unique web address of your Supabase project. Found in: Supabase Dashboard → Project Settings → Data API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The public/anon key that allows the browser to talk to Supabase safely. Found in the same place. **Important:** use the `anon public` key — NOT the `service_role` secret key |

> **Why NEXT_PUBLIC_?** Any variable that starts with `NEXT_PUBLIC_` is intentionally made available in the browser. The anon key is designed to be public. The service role key should never start with `NEXT_PUBLIC_` and should never be used in the browser.

---

## 7. How to Run the App Locally

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

## 8. How to Save Changes to GitHub

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

## 9. What Still Needs to Be Built

These features are planned but not yet built:

| Feature | Description |
|---|---|
| **Saved activities** | When a logged-in user creates a custom activity in the builder, save it to Supabase so it persists across sessions and devices |
| **Child profiles** | Let parents add their child's name and age so the app can personalise the experience |
| **Personal activity library** | A section of the dashboard showing only the activities saved by that user |
| **Activity images** | Add illustrations or photos to each activity card to make it more visually engaging |
| **Deployment** | Deploy the app to Vercel (free) so it has a real public web address anyone can visit |
| **Password reset** | A "Forgot password?" flow so users can recover their account via email |

---

*Last updated: May 2026*
