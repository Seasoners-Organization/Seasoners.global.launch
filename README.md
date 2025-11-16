# Seasoners Starter 🌍

This is the official **Seasoners v1** test build — a Next.js + Tailwind site with Magic Link & Google OAuth authentication, Prisma ORM, and more.

### 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables in `.env`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/seasoners"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret" # generate with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
```

3. Initialize the database:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Run the development server:
```bash
npm run dev
```

### 🔐 Authentication

The application uses NextAuth.js for authentication with two providers:
- Email Magic Links (passwordless)
- Google OAuth

Users can sign in using either method and their session will be persisted across visits.
