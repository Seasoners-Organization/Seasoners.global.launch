#!/bin/bash

# Quick Deployment Script for Trial System
# This script helps you deploy the environment variables to Vercel

echo "=========================================="
echo "  Seasoners Trial System Deployment"
echo "=========================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📋 This script will help you deploy environment variables to Vercel."
echo ""
echo "You'll need:"
echo "  1. CRON_SECRET (from .env)"
echo "  2. ADMIN_SECRET (from .env)"
echo "  3. RESEND_API_KEY (already in .env)"
echo ""

# Load environment variables from .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Loaded environment variables from .env"
else
    echo "❌ .env file not found!"
    exit 1
fi

echo ""
echo "Found the following secrets:"
echo "  CRON_SECRET: ${CRON_SECRET:0:20}..."
echo "  ADMIN_SECRET: ${ADMIN_SECRET:0:20}..."
echo "  RESEND_API_KEY: ${RESEND_API_KEY:0:10}..."
echo ""

read -p "Deploy these to Vercel production? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Deploying to Vercel..."
    echo ""
    
    # Add environment variables to Vercel
    vercel env add CRON_SECRET production <<< "$CRON_SECRET"
    vercel env add ADMIN_SECRET production <<< "$ADMIN_SECRET"
    
    echo ""
    echo "✅ Environment variables deployed!"
    echo ""
    echo "Next steps:"
    echo "  1. Verify in Vercel Dashboard: https://vercel.com/seasoners/settings/environment-variables"
    echo "  2. Test the system: node scripts/test-trial-reminders.js --production"
    echo "  3. Monitor cron logs in Vercel Dashboard"
    echo ""
else
    echo ""
    echo "Deployment cancelled. You can deploy manually:"
    echo ""
    echo "  vercel env add CRON_SECRET production"
    echo "  vercel env add ADMIN_SECRET production"
    echo ""
fi
