#!/bin/bash

# This script helps set up Vercel Postgres for Seasoners
# You'll need to:
# 1. Go to https://vercel.com/dashboard/projects
# 2. Click on your "Seasoners" project
# 3. Click "Storage" tab
# 4. Click "Create" and select "Postgres"
# 5. Fill in database name (e.g., "seasoners_db")
# 6. Select region (same as Vercel deployment)
# 7. Copy the "Connection String" (starting with postgresql://)
# 8. Paste it as DATABASE_URL below

echo "==================================="
echo "Vercel Postgres Setup Instructions"
echo "==================================="
echo ""
echo "STEP 1: Create Vercel Postgres Database"
echo "1. Go to: https://vercel.com/dashboard/projects"
echo "2. Select 'Seasoners' project"
echo "3. Click 'Storage' tab"
echo "4. Click 'Create' → 'Postgres'"
echo "5. Name: seasoners_db"
echo "6. Region: us-east-1 (or match your Vercel region)"
echo "7. Click 'Create' and wait 30-60 seconds"
echo ""
echo "STEP 2: Get Connection String"
echo "1. After database is created, click '.env' tab"
echo "2. Copy the 'POSTGRES_URL' value"
echo "3. Replace DATABASE_URL with this value in Vercel environment variables"
echo ""
echo "STEP 3: Update Vercel Environment Variables"
echo "1. In Vercel dashboard, go to Settings → Environment Variables"
echo "2. Edit 'DATABASE_URL' and paste the connection string"
echo "3. Make sure DATABASE_URL_UNPOOLED is the same value (Vercel Postgres handles pooling)"
echo "4. Save and wait for redeployment"
echo ""
echo "STEP 4: Migrate Database Schema"
echo "After Vercel redeploys, run:"
echo "  npx prisma migrate deploy"
echo ""
echo "STEP 5: Test Authentication"
echo "1. Visit https://www.seasoners.eu"
echo "2. Click 'Sign in with Google'"
echo "3. Verify it works without database errors"
echo ""
