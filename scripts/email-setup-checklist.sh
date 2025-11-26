#!/bin/bash

# Email Setup Interactive Checklist
# Run: bash scripts/email-setup-checklist.sh

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📧 SEASONERS EMAIL SETUP CHECKLIST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to check a step
check_step() {
  local step=$1
  local description=$2
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "$step. $description"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# PHASE 1: DNS & INBOUND
check_step "STEP 1" "DNS Configuration (Cloudflare)"

echo ""
echo "Checking DNS records..."
echo ""

# Check nameservers
echo "📍 Nameservers:"
ns=$(dig +short NS seasoners.eu | head -2)
if echo "$ns" | grep -q "cloudflare"; then
  echo "✅ Using Cloudflare nameservers"
  echo "$ns"
else
  echo "❌ Not using Cloudflare nameservers"
  echo "$ns"
  echo ""
  echo "ACTION REQUIRED:"
  echo "1. Log into GoDaddy (or registrar)"
  echo "2. Go to Domain Settings → Nameservers"
  echo "3. Change to Cloudflare nameservers (from Cloudflare dashboard)"
  echo "4. Wait 15-60 minutes for propagation"
  exit 1
fi

echo ""
echo "📬 MX Records:"
mx=$(dig +short MX seasoners.eu)
if echo "$mx" | grep -q "cloudflare"; then
  echo "✅ Cloudflare Email Routing MX records active"
  echo "$mx"
else
  echo "❌ No Cloudflare MX records found"
  echo "$mx"
  echo ""
  echo "ACTION REQUIRED:"
  echo "1. Go to Cloudflare dashboard → seasoners.eu → Email → Email Routing"
  echo "2. Enable Email Routing"
  echo "3. Cloudflare will auto-add MX records"
  echo "4. Wait 5-15 minutes for DNS propagation"
  exit 1
fi

echo ""
echo "📋 SPF Record:"
spf=$(dig +short TXT seasoners.eu | grep "v=spf1")
if [ -n "$spf" ]; then
  echo "✅ SPF record exists"
  echo "$spf"
  
  if echo "$spf" | grep -q "_spf.mx.cloudflare.net"; then
    echo "✅ Includes Cloudflare Email Routing"
  else
    echo "⚠️  Missing Cloudflare Email Routing in SPF"
  fi
  
  if echo "$spf" | grep -q "spf.resend.com"; then
    echo "✅ Includes Resend (for outbound)"
  else
    echo "⚠️  Missing Resend in SPF (add later for outbound)"
  fi
else
  echo "⚠️  No SPF record found"
  echo "Will be added in Phase 2 (outbound setup)"
fi

# PHASE 2: CLOUDFLARE EMAIL ROUTING
check_step "STEP 2" "Cloudflare Email Routing Setup"

echo ""
echo "Manual checks required:"
echo ""
echo "Go to: https://dash.cloudflare.com → seasoners.eu → Email → Email Routing"
echo ""
echo "□ Destinations Tab:"
echo "  - Add destination email address (e.g., your Gmail)"
echo "  - Status must show 'Verified' (green checkmark)"
echo "  - If not verified, click verification link in email"
echo ""
echo "□ Routing Rules Tab:"
echo "  - Create route: hello@seasoners.eu → [your-verified-destination]"
echo "  - Create route: support@seasoners.eu → [your-verified-destination]"
echo "  - Create route: tremayne@seasoners.eu → [your-verified-destination]"
echo "  - Each route must be ENABLED (toggle ON)"
echo ""
echo "□ Test Inbound Email:"
echo "  - From external email, send to: hello@seasoners.eu"
echo "  - Subject: 'CF Routing Test'"
echo "  - Check destination inbox (including spam)"
echo "  - Should arrive within 1-5 minutes"
echo ""

read -p "Press ENTER when Cloudflare Email Routing is configured and tested... "

echo ""
echo "Checking Activity Log..."
echo ""
echo "Go to: Cloudflare dashboard → Email Routing → Activity"
echo "Recent test email should show status: 'Forwarded'"
echo ""

read -p "Does Activity Log show 'Forwarded'? (y/n): " forwarded

if [ "$forwarded" != "y" ]; then
  echo ""
  echo "❌ Inbound email routing not working yet"
  echo ""
  echo "Troubleshooting:"
  echo "1. Verify destination address is 'Verified' (green)"
  echo "2. Verify route is 'ENABLED' (toggle ON)"
  echo "3. Wait 5 more minutes and check Activity Log again"
  echo "4. Check spam/promotions folder at destination"
  exit 1
fi

echo ""
echo "✅ Phase 1 Complete: Inbound email routing working!"
echo ""

# PHASE 3: RESEND SETUP
check_step "STEP 3" "Resend Domain Verification (Outbound)"

echo ""
echo "Manual setup required:"
echo ""
echo "1. Go to: https://resend.com/domains"
echo ""
echo "2. Click 'Add Domain'"
echo "   - Enter: seasoners.eu"
echo "   - Click 'Add'"
echo ""
echo "3. Resend will show DNS records to add"
echo "   Copy these records exactly"
echo ""

read -p "Press ENTER when you have the Resend DNS records ready... "

echo ""
echo "4. Go to Cloudflare: https://dash.cloudflare.com"
echo "   - Select: seasoners.eu → DNS → Records"
echo ""
echo "5. Update SPF record:"
echo "   Type: TXT"
echo "   Name: @ (or seasoners.eu)"
echo "   Value: v=spf1 include:_spf.mx.cloudflare.net include:spf.resend.com ~all"
echo "   (Combine both Cloudflare AND Resend in one record)"
echo ""
echo "6. Add DKIM records from Resend (usually 2-3 CNAME records):"
echo "   Example:"
echo "   Type: CNAME"
echo "   Name: resend._domainkey"
echo "   Value: [copy from Resend]"
echo ""
echo "7. Add DMARC record (recommended):"
echo "   Type: TXT"
echo "   Name: _dmarc"
echo "   Value: v=DMARC1; p=none; rua=mailto:dmarc@seasoners.eu"
echo ""

read -p "Press ENTER when all DNS records are added in Cloudflare... "

echo ""
echo "8. Wait 5-30 minutes for DNS propagation"
echo ""
echo "9. Return to Resend dashboard → Domains"
echo "   Click 'Verify' button"
echo "   Status should change to 'Verified' (green)"
echo ""

read -p "Is Resend domain verified (green)? (y/n): " resend_verified

if [ "$resend_verified" != "y" ]; then
  echo ""
  echo "⚠️  Domain not verified yet"
  echo ""
  echo "Verification checks:"
  echo ""
  echo "Run: dig +short TXT seasoners.eu"
  echo "Should include: include:spf.resend.com"
  echo ""
  echo "Run: dig +short CNAME resend._domainkey.seasoners.eu"
  echo "Should point to Resend target"
  echo ""
  echo "Wait longer (can take up to 1 hour) and try 'Verify' again in Resend."
  exit 1
fi

echo ""
echo "✅ Resend domain verified!"
echo ""

# PHASE 4: ENVIRONMENT VARIABLES
check_step "STEP 4" "Environment Variables Setup"

echo ""
echo "Get your Resend API key:"
echo "1. Go to: https://resend.com/api-keys"
echo "2. Create new API key or copy existing"
echo "3. Copy the key (starts with 're_')"
echo ""

read -p "Enter your Resend API key: " resend_key

if [ -z "$resend_key" ]; then
  echo "❌ No API key provided"
  exit 1
fi

echo ""
echo "Creating .env.local file..."

cat > .env.local << EOF
# Email Configuration
RESEND_API_KEY=$resend_key
EMAIL_FROM=Seasoners <hello@seasoners.eu>
EMAIL_REPLY_TO_SUPPORT=support@seasoners.eu
EMAIL_REPLY_TO_FOUNDER=tremayne@seasoners.eu

# Keep existing variables if they exist
$(grep -v "^RESEND_API_KEY=" .env.local 2>/dev/null | grep -v "^EMAIL_" || true)
EOF

echo "✅ .env.local updated"
echo ""

echo "Now set these in Vercel:"
echo ""
echo "1. Go to: https://vercel.com/[your-team]/[project]/settings/environment-variables"
echo ""
echo "2. Add these variables:"
echo "   RESEND_API_KEY          = $resend_key"
echo "   EMAIL_FROM              = Seasoners <hello@seasoners.eu>"
echo "   EMAIL_REPLY_TO_SUPPORT  = support@seasoners.eu"
echo "   EMAIL_REPLY_TO_FOUNDER  = tremayne@seasoners.eu"
echo ""
echo "3. Apply to: Production, Preview, Development"
echo ""

read -p "Press ENTER when Vercel environment variables are set... "

echo ""
echo "✅ Environment variables configured!"
echo ""

# PHASE 5: CODE UPDATE
check_step "STEP 5" "Update Application Code"

echo ""
echo "The code will be updated to use the new email configuration..."
echo ""

read -p "Press ENTER to update the code... "

echo "✅ Code will be updated in next step"
echo ""

# FINAL TESTING
check_step "STEP 6" "Testing"

echo ""
echo "Testing email configuration..."
echo ""

node scripts/test-email-config.js

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SETUP COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo ""
echo "1. Send test email:"
echo "   node scripts/test-email-config.js --send your-email@gmail.com"
echo ""
echo "2. Deploy to Vercel:"
echo "   git add ."
echo "   git commit -m 'Configure custom email domain'"
echo "   git push"
echo ""
echo "3. Test in production:"
echo "   - Sign up with Google OAuth"
echo "   - Check for welcome email from hello@seasoners.eu"
echo ""
echo "4. Monitor Resend dashboard for delivery status"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
