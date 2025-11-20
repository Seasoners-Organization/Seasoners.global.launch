# Row Level Security (RLS) Setup Guide

## Overview

Row Level Security (RLS) is a PostgreSQL feature that Supabase strongly recommends for securing your database. It ensures that users can only access data they're authorized to see.

## The Issue

When you expose tables through PostgREST (Supabase's auto-generated API), without RLS enabled, **all data is publicly accessible by default**. This is a critical security vulnerability.

## Solution

### 1. Understanding the Setup

- **RLS Policies**: Define who can access what data
- **Service Role**: Your Next.js backend uses a "service role" that **bypasses RLS**
- **Anon Key**: Public/client-side requests use the "anon key" that **respects RLS**

### 2. Apply the Migration

Run this command to enable RLS on all tables:

```bash
node scripts/enable_rls.js
```

This will:
- Enable RLS on all tables (`User`, `Listing`, `Agreement`, etc.)
- Create policies that allow:
  - Service role (backend) full access to everything
  - Users to access their own data
  - Public read access to certain data (listings, profiles)

### 3. Update Your Database URL

**CRITICAL**: Your `DATABASE_URL` in production must use the **connection pooler** with proper authentication.

#### For Supabase:

Your connection string should look like:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important points**:
- Use port `6543` (transaction pooler) NOT `5432` (direct connection)
- The password must be **URL-encoded** (e.g., `&` becomes `%26`)
- Add `?pgbouncer=true` at the end
- Use the **service role connection**, not the anon connection

#### Get the Correct Connection String:

1. Go to your Supabase project: https://supabase.com/dashboard/project/owftpnisfdzkgjvrepjt
2. Click **Settings** → **Database**
3. Scroll to **Connection string**
4. Select **URI** tab
5. Toggle **"Use connection pooling"** to **ON**
6. Click **"Show password"** and copy the full connection string
7. **Important**: Make sure you're copying the connection string that uses the `postgres` user (service role)

### 4. Update Vercel Environment Variables

1. Go to: https://vercel.com/seasoners-organization/seasoners-global-launch/settings/environment-variables
2. Find `DATABASE_URL`
3. Click **Edit**
4. Paste the new connection string from Supabase
5. Ensure special characters are URL-encoded:
   - `&` → `%26`
   - `#` → `%23`
   - `@` → `%40` (if in password)
6. **Save** and **Redeploy**

### 5. Verify RLS is Working

After deployment, check:

#### In Supabase Dashboard:
- Go to **Authentication** → **Policies**
- You should see policies listed for each table
- Each table should show "RLS enabled"

#### Test Your Application:
1. Try signing in - should work normally
2. Try creating a listing - should work
3. Try viewing listings - should work
4. Check Vercel logs - no more "Tenant or user not found" errors

### 6. What the Policies Do

```sql
-- Example: Users can only view their own data
CREATE POLICY "Users can view own data" ON "User"
  FOR SELECT
  USING (auth.uid()::text = id);

-- Service role (your Next.js backend) bypasses all RLS
CREATE POLICY "Service role has full access" ON "User"
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');
```

**Key Points**:
- Your Next.js backend uses Prisma with the service role → **bypasses RLS**
- Direct PostgREST API calls (if exposed) → **respects RLS**
- This means your application continues to work normally while preventing unauthorized direct database access

## Common Issues

### Issue: "Tenant or user not found"
**Cause**: Wrong database credentials in `DATABASE_URL`
**Fix**: Get the correct connection string from Supabase (see step 3)

### Issue: "new row violates row-level security policy"
**Cause**: Your application is using the anon key instead of service role
**Fix**: Ensure `DATABASE_URL` uses the service role connection string (should have the actual postgres password, not anon key)

### Issue: Can't read/write data after enabling RLS
**Cause**: Missing or incorrect policies
**Fix**: Review the migration file and ensure all policies are applied

## Backend vs Frontend

| Access Method | Key Used | RLS Applied? |
|---------------|----------|--------------|
| Next.js API (Prisma) | Service Role (via DATABASE_URL) | ❌ No (bypassed) |
| Direct PostgREST | Anon Key | ✅ Yes (enforced) |
| Supabase Client Library | Anon Key | ✅ Yes (enforced) |

Your Next.js backend should **always** use the service role connection (which you're already doing via `DATABASE_URL`).

## Security Checklist

- [x] Enable RLS on all tables
- [x] Create policies for service role access
- [x] Create policies for user data access
- [x] Use transaction pooler (port 6543) in production
- [x] URL-encode special characters in connection string
- [x] Verify policies in Supabase Dashboard
- [ ] Test application after deployment
- [ ] Monitor Vercel logs for any access errors

## Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Prisma with Supabase](https://www.prisma.io/docs/guides/database/supabase)
