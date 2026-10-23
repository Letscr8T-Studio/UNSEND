# Unsend landing page

The Unsend waitlist site: Next.js (App Router) + TypeScript + Tailwind CSS v4, with Supabase for storing
waitlist emails and a Tally popup for the priority-access survey.

## How the waitlist works

1. A visitor enters their email and clicks **Join the waitlist**.
2. The page sends it to `/api/waitlist`, which saves it to the `waitlist` table in Supabase.
   Joining twice with the same email is treated as success, and a hidden honeypot field filters out simple bots.
3. The form changes to **"You're on the list. Want to skip the line?"** with a **Get priority access** button.
4. That button opens your Tally survey as a popup, with their email passed in as a hidden field.
5. When they submit the survey, the page calls `/api/survey-complete`, which sets `did_survey = true` for that email.
6. The browser remembers they joined, so returning visitors see the "on the list" state instead of the form.

---

## Setup (about 15 minutes)

### 1. Install

```bash
npm install
cp .env.example .env.local
```

You need Node 20 or newer.

### 2. Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor → New query**, paste everything from `supabase/schema.sql`, and click **Run**.
   This creates the `waitlist` table, locks it down so it can't be read from the browser, and adds a
   `waitlist_stats` view.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** secret → `SUPABASE_SERVICE_ROLE_KEY`

   Keep the service role key secret. It only ever runs on the server (inside the API routes), never in the browser.

### 3. Tally

1. Open your survey in Tally and add a **Hidden field** block named exactly `email`.
2. Remove the "leave your email address" question (Q15). The hidden field already captures it.
3. Publish, then copy the form ID from the share link (`tally.so/r/XXXXXX` → `XXXXXX`) into
   `NEXT_PUBLIC_TALLY_FORM_ID`.

Before you send traffic, fix two things in the survey itself: Q9 lists the same option twice, and
Q14 should skip the email question when someone answers "No".

### 4. Run it

```bash
npm run dev
```

Open http://localhost:3000, join with a test email, and check it appears in Supabase under
**Table Editor → waitlist**.

---

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo. Vercel detects Next.js automatically.
3. Under **Environment Variables**, add the same four values from your `.env.local`.
4. Click **Deploy**.
5. Add your domain under **Project → Settings → Domains** (for example `unsend.io`), then add the DNS records
   Vercel shows you at your domain registrar.

Every push to the main branch redeploys automatically.

---

## Checking your numbers

In Supabase, open **SQL Editor** and run:

```sql
select * from waitlist_stats;
```

That gives you total signups, how many did the survey, the survey rate, and signups in the last 7 days.
To export the list: **Table Editor → waitlist → Export → CSV**.

The `source` column records where each signup came from: a `?utm_source=` or `?ref=` value in the link,
otherwise the referring site, otherwise `direct`. Use tagged links in your posts
(for example `unsend.io/?ref=linkedin`) to see which channel works best.

---

## Project structure

```
app/
  layout.tsx              Fonts, page title, social share tags
  page.tsx                Puts the sections together, in order
  globals.css             Brand colours, fonts and all animations
  api/waitlist/           Saves an email to Supabase
  api/survey-complete/    Marks did_survey = true
components/
  Hero.tsx                Announcement bar, header, hero, floating cards
  Inboxes.tsx             "Works with every inbox" row
  Feeling.tsx             "You know the feeling" cards
  ProductShot.tsx         Blue panel with the Outbox cards and phone mockup
  HowItWorks.tsx  Compare.tsx  Extras.tsx  Faq.tsx
  Join.tsx                Final call to action + email status cards
  WaitlistForm.tsx        The form, success state and Tally popup
  Footer.tsx
lib/
  supabase-admin.ts       Server-only Supabase client + email validation
  tally.ts                Opens the Tally popup
supabase/schema.sql       Database table, security and stats view
```

### Editing

- **Copy:** each section's text lives in its component file, in plain JSX.
- **Colours:** change the tokens at the top of `app/globals.css` (for example `--color-brand`) and every
  `bg-brand`, `text-brand`, etc. updates.
- **Fonts:** Bricolage Grotesque (headings), Inter (body) and JetBrains Mono (labels) are self-hosted
  from npm, so there are no requests to Google.
- **Inbox logos:** `components/Inboxes.tsx` uses text chips. To show real logos, use the official SVGs
  each company publishes (the [Simple Icons](https://simpleicons.org) set packages many of them) and check
  each brand's guidelines on how a "works with" mention may show their mark.

### Animations

The scroll animations use CSS scroll-driven animations (`animation-timeline: view()`). They play in Chrome,
Edge and recent Safari. Browsers without support, and anyone with "reduce motion" turned on, see the finished
page with nothing hidden or stuck. All motion lives in `app/globals.css` under the `anim-` classes.

---

## Optional: tamper-proof survey tracking

`/api/survey-complete` trusts the browser to say the survey was submitted, which is fine for a waitlist.
If you want it bulletproof, add a webhook in Tally (**Integrations → Webhooks**) pointing to a new route
that checks Tally's signing secret, reads the `email` hidden field from the payload, and updates the row.

---

## Founders dashboard

A private, founders-only dashboard lives at `/owner/dashboard` (stat cards, signups per day, sources,
a searchable signups table and a CSV export). It is not linked from the public site, is marked
`noindex`, and `/owner` is disallowed in `robots.txt`.

**Set these env vars** in `.env.local` locally, and under **Project → Settings → Environment Variables** in Vercel
(then redeploy):

| Variable | What it is |
| --- | --- |
| `ADMIN_EMAILS` | Comma-separated founder emails allowed to sign in |
| `ADMIN_PASSWORD` | The shared password |
| `ADMIN_SESSION_SECRET` | 32+ random characters that sign the login cookie. Generate with `openssl rand -base64 32` |

**Log in:** go to `/owner/login` (locally http://localhost:3000/owner/login), enter one of the `ADMIN_EMAILS`
and the password. The session lasts 7 days. Use **Log out** in the top right to end it. After 5 wrong
attempts from one IP, login is blocked for 15 minutes (the counter is per server instance and resets on redeploy).
Changing `ADMIN_SESSION_SECRET` logs everyone out.
