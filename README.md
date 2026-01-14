# Seasoners Starter

Seasoners is a Next.js app for trusted seasonal work and stays. We verify people, provide dual-language agreements, and let hosts, employers, and talent meet in one workflow (stays + jobs). 90-day free trial with card on file (no charges until day 91).

## Stack
- Next.js (App Router), React 18
- TailwindCSS
- Prisma + PostgreSQL
- NextAuth (email magic link + Google)
- Framer Motion, Lucide icons

## Quick Start
```bash
npm install
npx prisma generate
npm run dev
```

### Environment
Create `.env.local` with at least:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/seasoners"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret" # openssl rand -base64 32
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
RESEND_API_KEY="your-resend-api-key"
```

### Database
```bash
npx prisma migrate dev   # local
npx prisma db push       # sync schema without data loss (when appropriate)
```

### Run / Build
```bash
npm run dev
npm run build
npm start
```

### Tests
```bash
npm test          # Jest unit tests
npm run test:e2e  # Playwright (if configured)
```

### Production Smoke Check
CI workflow runs a smoke script against https://www.seasoners.eu:
- .github/workflows/prod-smoke-check.yml
- scripts/smoke-check.sh

Run locally:
```bash
BASE_URL=https://www.seasoners.eu ./scripts/smoke-check.sh
```

### Notable Features
- Dual-language, plain-language agreement flow for stays and jobs
- Verification signals (email, phone, ID) and trust scores
- Combined marketplace for seasonal stays and jobs with messaging
- Season-aware destinations (/destinations/[season])
- 90-day free trial flow and subscription tiers (card required to start)

### Deployment
- Vercel (see vercel.json for headers, rewrites, and cron config)
- Cron routes: /api/cron/trial-reminders, /api/cron/trial-ending

### Troubleshooting
- Ensure `prisma generate` after dependency installs
- Check env vars for auth and email providers
- If tests complain about missing DOM libs, install @testing-library/dom (already added)
