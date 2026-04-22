# 🦉 Buho Workshop

A full-stack mock e-commerce application built with modern web technologies. This is a personal project for learning and experimenting — no real transactions, no real data.

> 🚧 Live demo coming soon.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | NextAuth v5 + Prisma Adapter |
| Database | PostgreSQL via Prisma ORM |
| Payments | Stripe (mock) |
| State | Redux Toolkit |
| Validation | Zod |
| Unit tests | Jest + React Testing Library |
| E2E tests | Playwright |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL running locally (or a connection string from a service like Supabase/Neon)
- A Stripe account (test mode keys are fine)

### Installation

```bash
git clone https://github.com/SebastianPellitero/buho-workshop.git
cd buho-workshop
npm install
```

### Environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

```env
DATABASE_URL=""                        # PostgreSQL connection string
NEXTAUTH_SECRET=""                     # Random secret, e.g. output of: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"   # Base URL of the app
STRIPE_SECRET_KEY=""                   # From Stripe dashboard (test mode)
STRIPE_WEBHOOK_SECRET=""               # From Stripe CLI or dashboard webhook settings
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""  # From Stripe dashboard (test mode)
```

### Database setup

```bash
npm run db:migrate   # Run migrations
npm run db:seed      # Seed with mock data
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:push` | Push schema without migration |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:coverage` | Unit tests with coverage report |
| `npm run test:e2e` | Run Playwright e2e tests |
| `npm run test:e2e:ui` | Run Playwright with UI mode |

---

## Project Structure

```
buho-workshop/
├── prisma/           # Schema, migrations, seed
├── public/           # Static assets
├── src/              # App source code
├── tests/e2e/        # Playwright tests
├── .env.example
└── ...config files
```

---

## Notes

- All Stripe interactions use test mode keys — no real charges happen.
- Auth is handled via NextAuth v5 with Prisma as the session adapter.
- Passwords are hashed with bcryptjs.

---

## License

MIT
