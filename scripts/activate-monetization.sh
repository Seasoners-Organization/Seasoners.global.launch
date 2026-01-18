#!/bin/bash

# Seasoners Monetization Model Activation Script
# Run this script to activate the new pricing model

set -e

echo "🚀 Seasoners Monetization Model Activation"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Confirm with user
echo "⚠️  This script will:"
echo "   1. Backup existing files"
echo "   2. Replace them with new monetization model files"
echo "   3. Run database migration"
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Activation cancelled"
    exit 0
fi

echo ""
echo "📦 Step 1: Backing up existing files..."

# Create backup directory
mkdir -p backups/pre-monetization-$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="backups/pre-monetization-$(date +%Y%m%d-%H%M%S)"

# Backup existing files
cp utils/subscription.js "$BACKUP_DIR/subscription.js" 2>/dev/null || echo "  ℹ️  No existing subscription.js"
cp app/subscribe/page.jsx "$BACKUP_DIR/subscribe-page.jsx" 2>/dev/null || echo "  ℹ️  No existing subscribe page"
cp app/api/messages/send/route.ts "$BACKUP_DIR/messages-send-route.ts" 2>/dev/null || echo "  ℹ️  No existing messages send route"
cp app/api/webhooks/stripe/route.ts "$BACKUP_DIR/webhooks-stripe-route.ts" 2>/dev/null || echo "  ℹ️  No existing webhooks route"
cp app/api/subscription/create-checkout/route.ts "$BACKUP_DIR/subscription-create-checkout-route.ts" 2>/dev/null || echo "  ℹ️  No existing subscription checkout route"

echo "✅ Backup created in $BACKUP_DIR"
echo ""

echo "🔄 Step 2: Replacing files with new versions..."

# Replace files
mv utils/subscription-new.js utils/subscription.js
echo "  ✅ Updated utils/subscription.js"

mv app/subscribe/page-new.jsx app/subscribe/page.jsx
echo "  ✅ Updated app/subscribe/page.jsx"

mv app/api/messages/send/route-new.ts app/api/messages/send/route.ts
echo "  ✅ Updated app/api/messages/send/route.ts"

mv app/api/webhooks/stripe/route-new.ts app/api/webhooks/stripe/route.ts
echo "  ✅ Updated app/api/webhooks/stripe/route.ts"

mv app/api/subscription/create-checkout/route-new.ts app/api/subscription/create-checkout/route.ts
echo "  ✅ Updated app/api/subscription/create-checkout/route.ts"

echo ""
echo "🗄️  Step 3: Running database migration..."

# Run Prisma migration
npx prisma migrate dev --name add_message_quotas_and_boosts

echo ""
echo "🔍 Step 4: Verifying environment variables..."

# Check required env vars
MISSING_VARS=()

if [ -z "$NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID" ]; then
    MISSING_VARS+=("NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID")
fi

if [ -z "$NEXT_PUBLIC_STRIPE_BOOST_7_PRICE_ID" ]; then
    MISSING_VARS+=("NEXT_PUBLIC_STRIPE_BOOST_7_PRICE_ID")
fi

if [ -z "$NEXT_PUBLIC_STRIPE_BOOST_30_PRICE_ID" ]; then
    MISSING_VARS+=("NEXT_PUBLIC_STRIPE_BOOST_30_PRICE_ID")
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "⚠️  Warning: The following environment variables are missing:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "   Please add them to your .env.local file before deploying."
    echo "   See docs/MONETIZATION_SETUP.md for instructions."
fi

echo ""
echo "✅ Activation complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Review docs/MONETIZATION_SETUP.md for Stripe setup"
echo "   2. Create products/prices in Stripe Dashboard"
echo "   3. Add price IDs to .env.local and Vercel"
echo "   4. Configure webhook endpoint in Stripe"
echo "   5. Test with Stripe test mode"
echo "   6. Deploy to production"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: docs/MONETIZATION_SETUP.md"
echo "   - Implementation Summary: docs/IMPLEMENTATION_SUMMARY.md"
echo ""
echo "🎉 Ready to deploy!"
