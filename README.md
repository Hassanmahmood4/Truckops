# TruckOps

TruckOps is a full-stack truck dispatching platform with:

- A **Next.js App Router web app** (marketing + authenticated dashboard)
- A **Node.js/Express API**
- A **Supabase Postgres database**
- **Clerk authentication**

The product is built with a clean, monochrome SaaS UI style and supports light/dark theme switching.

---

## Tech Stack

### Frontend (`client/`)
- Next.js (App Router)
- Tailwind CSS
- shadcn-style UI components
- Framer Motion (hero + loader animation)
- next-themes (light/dark mode)
- Clerk (`@clerk/nextjs`)

### Backend (`server/`)
- Node.js + Express
- `@supabase/supabase-js`
- `express-validator`
- Clerk token verification (`@clerk/backend`)

### Database (`database/`)
- PostgreSQL (Supabase)
- SQL schema for:
  - `drivers`
  - `loads`
  - `assignments`
  - `quotes`

---

## Monorepo Structure

```text
Truckops/
├── client/                # Next.js web app
│   ├── src/app/           # App Router routes/layouts
│   ├── src/components/    # UI + marketing + dashboard components
│   └── src/lib/           # API client utilities
├── server/                # Express API
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── config/
├── database/
│   └── schema.sql         # Initial Supabase schema
├── landing/               # Separate Vite marketing workspace
├── docs/                  # Project docs and checklists
├── .env.example
└── package.json           # Root scripts (run API + web together)
```

---

## Architecture

Request flow:

**Browser → Next.js UI → Express API → Supabase**

- The browser does **not** talk directly to Supabase.
- Clerk session tokens are sent to the API as Bearer tokens.
- API validates auth and performs all DB access.

---

## Features

### Marketing + UX
- Premium monochrome landing page
- Animated SaaS hero section
- Pricing section
- Theme toggle (light/dark)
- Global loader screen and initial loader gate

### Dashboard
- Protected routes under `/dashboard`
- Overview stats
- Drivers management
- Loads management
- Assignments flow

### API
- Drivers CRUD
- Loads CRUD (with delivery status handling)
- Assignments API
- Quotes API (distance/rate based)

---

## Environment Variables

Copy and fill:

```bash
cp .env.example .env
```

Required variables:

```env
# API
PORT=3001
SUPABASE_URL=
SUPABASE_KEY=
CLERK_SECRET_KEY=
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
QUOTE_RATE_PER_UNIT=2.5

# Web (Next.js)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
API_URL=http://localhost:3001
```

Notes:
- `SUPABASE_KEY` must be the **service role key** for server-side DB access.
- Do **not** commit real secrets.

---

## Local Development

Install dependencies at repo root:

```bash
npm install
```

Run web + API together:

```bash
npm run dev
```

Default local URLs:
- Web: `http://localhost:3000`
- API: `http://localhost:3001`

Useful scripts:

```bash
npm run dev:api       # only Express API
npm run dev:web       # only Next web
npm run dev:landing   # Vite marketing workspace
npm run build         # build Next app
```

---

## API Endpoints

### Drivers
- `POST /api/drivers`
- `GET /api/drivers`
- `PUT /api/drivers/:id`
- `DELETE /api/drivers/:id`

### Loads
- `POST /api/loads`
- `GET /api/loads`
- `PUT /api/loads/:id`

### Assignments
- `POST /api/assignments`
- `GET /api/assignments`

### Quotes
- `POST /api/quotes`
- `GET /api/quotes`

Health check:
- `GET /health`

---

## Route & Auth Flow (Web)

- `/` → public landing page
- `/sign-in` and `/sign-up` → Clerk auth pages
- `/dashboard/*` → protected routes

Protection is enforced via:
- Clerk middleware matcher for dashboard routes
- Server-side auth check in dashboard layout

---

## Database Setup (Supabase)

1. Open Supabase SQL Editor
2. Run:

```sql
-- from database/schema.sql
```

3. Verify tables:
- `drivers`
- `loads`
- `assignments`
- `quotes`

---

## Build & Production

Web build:

```bash
npm run build --prefix client
```

API start:

```bash
npm run start --prefix server
```

Web start:

```bash
npm run start --prefix client
```

---

## Contribution Notes

- Keep commits focused and small
- Keep UI monochrome and minimal
- Validate auth and API behavior before PRs
- Never commit `.env` values or credentials

---

## License

MIT (add/update as needed).
