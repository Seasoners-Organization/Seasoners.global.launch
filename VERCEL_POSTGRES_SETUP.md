# Vercel Postgres Migration Guide

## Problem
Vercel cannot reach Supabase database at `db.owftpnisfdzkgjvrepjt.supabase.co:5432`
- Error: "Can't reach database server"
- Root cause: Network connectivity issue between Vercel and Supabase

## Solution
Switch to **Vercel Postgres** - the native Vercel database solution with guaranteed connectivity.

---

## Step-by-Step Setup

### STEP 1: Create Vercel Postgres Database
1. Go to https://vercel.com/dashboard
2. Click on **Seasoners** project
3. Click **Storage** tab
4. Click **Create** button
5. Select **Postgres**
6. Configure:
   - **Database Name:** `seasoners_db`
   - **Region:** `us-east-1` (match your Vercel deployment region)
7. Click **Create**
8. Wait 30-60 seconds for database to initialize

### STEP 2: Get Connection String
1. In the database details, click **.env** or **Show Secret**
2. Copy the `POSTGRES_URL` value (looks like: `postgresql://user:password@...`)
3. Keep this value handy

### STEP 3: Update Vercel Environment Variables
1. Go to Vercel Dashboard → **Seasoners** project
2. Click **Settings** → **Environment Variables**
3. Find `DATABASE_URL` variable
4. Click **Edit**
5. Replace the entire value with the Vercel Postgres connection string from Step 2
6. Click **Save**
7. Vercel will automatically redeploy

### STEP 4: Verify Deployment
1. Wait for Vercel to finish redeployment (1-2 minutes)
2. Check deployment status on Vercel dashboard

### STEP 5: Run Database Migration
After deployment completes, run locally:
```bash
npx prisma migrate deploy
```

This creates the schema in the new Vercel Postgres database.

### STEP 6: Test Authentication
1. Visit https://www.seasoners.eu
2. Click **Sign in with Google**
3. Complete OAuth flow
4. Verify you're logged in and can access /profile

---

## What Changed in Code
- `prisma/schema.prisma`: Removed `shadowDatabaseUrl` (not needed for Vercel Postgres)
- Everything else stays the same
- Vercel Postgres handles connection pooling automatically

---

## Troubleshooting

**If database creation fails:**
- Check you have Vercel Pro or higher (free tier doesn't include Postgres)
- Vercel Postgres is available on Pro ($20/month) and higher plans

**If migration fails:**
- Ensure DATABASE_URL is set in Vercel environment variables
- Run `npx prisma db push` instead of `prisma migrate deploy` to create schema from current state

**If authentication still fails after migration:**
- Check Vercel deployment logs: https://vercel.com/dashboard/seasoners/settings/deployment
- Look for any database connection errors
- Verify NEXTAUTH_URL = https://www.seasoners.eu

---

## Timeline
- Database creation: 30-60 seconds
- Vercel redeploy: 1-2 minutes
- Schema migration: 10-30 seconds
- **Total: ~3-4 minutes**

After this, authentication should work immediately.
