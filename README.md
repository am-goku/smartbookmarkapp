# 📑 Smart Bookmark App

A real-time bookmark manager built with **Next.js 16 (App Router)**, **Supabase**, and **Tailwind CSS 4**. Save, organize, and access your bookmarks from anywhere — synced instantly across all open tabs.

## Features

- **Google OAuth** — Sign in securely with your Google account (no email/password)
- **Add & Delete Bookmarks** — Save any URL with a title, remove bookmarks you no longer need
- **Private by Default** — Row Level Security ensures each user's bookmarks are visible only to them
- **Real-time Sync** — Bookmarks update instantly across all open tabs via Supabase Realtime
- **Cross-tab Sign-out** — Signing out of one tab automatically signs out all other tabs
- **Optimistic UI** — Deletes and inserts reflect immediately, no waiting for server round-trips
- **Responsive Design** — Fully responsive dark-themed UI that works across all screen sizes

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Framework  | Next.js 16 (App Router)             |
| Language   | TypeScript                          |
| Auth & DB  | Supabase (Auth, Postgres, Realtime) |
| Styling    | Tailwind CSS 4                      |
| Auth Flow  | Google OAuth via Supabase PKCE      |
| Deployment | Vercel (recommended)                |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page / Dashboard (server component)
│   └── auth/callback/route.ts # OAuth callback handler
├── components/
│   ├── BookmarkDashboard.tsx  # Main dashboard (client component)
│   └── GoogleSignInButton.tsx # Google sign-in button
├── lib/
│   └── supabase/
│       ├── client.ts          # Browser Supabase client
│       └── server.ts          # Server Supabase client
├── middleware.ts              # Session refresh middleware
└── types/
    └── types.ts               # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- Google OAuth credentials configured in Supabase Dashboard

### Setup

1. Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd smartbookmarkapp
npm install
```

2. Create a `.env.development` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the SQL schema in your Supabase Dashboard → SQL Editor (see `supabase/schema.sql`).

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Problems & Solutions

### 1. Supabase OAuth Flow vs Direct OAuth

**Problem:** This was my first time using Supabase for authentication, and configuring Google OAuth _through_ Supabase rather than directly was surprisingly complex. With direct OAuth (e.g., using NextAuth or Firebase), you configure the Google Client ID/Secret in your app and handle the token exchange yourself. With Supabase, the OAuth flow is proxied — Google credentials go into the Supabase Dashboard, and Supabase manages the entire PKCE flow behind the scenes. This added an extra layer of indirection that was confusing at first:

- The Google Console redirect URI must point to **Supabase's callback URL** (`https://<project>.supabase.co/auth/v1/callback`), not your app's URL — this was unintuitive.
- The app then needs its own `/auth/callback` route to exchange the Supabase auth code for a session using `exchangeCodeForSession()`.
- Debugging auth failures was harder because errors could originate from Google, Supabase, or the app's callback handler.

**Solution:** Following the [Supabase Auth with Google guide](https://supabase.com/docs/guides/auth/social-login/auth-google) step by step and understanding the two-hop redirect flow (Google → Supabase → App) made the setup clear. Once configured, the benefit is that Supabase handles token refresh, session management, and RLS integration automatically — which is less code than managing OAuth tokens directly.

### 2. Real-time Updates Not Working Across Tabs

**Problem:** After enabling Supabase Realtime on the `bookmarks` table, changes made in one tab were not appearing in other tabs. The real-time subscription with a `user_id` filter was silently dropping events.

**Solution:** The issue was that `postgres_changes` filters require `REPLICA IDENTITY FULL` on the table for non-primary-key column filters to work. As a robust fallback, a `visibilitychange` event listener was also added to refetch bookmarks whenever a tab regains focus — ensuring cross-tab sync even if the WebSocket connection drops.

### 3. Cross-tab Sign-out Not Propagating

**Problem:** Signing out in one browser tab did not affect other open tabs — they continued showing the dashboard as if the user was still logged in.

**Solution:** Added a `supabase.auth.onAuthStateChange()` listener in the dashboard component that listens for `SIGNED_OUT` events. When one tab signs out, Supabase's internal cross-tab communication triggers this event in all other tabs, which then redirect to the home page.
