# Cloudflare Email Worker Setup

## Purpose
Automatically send professional auto-reply emails when people contact hello@seasoners.eu, support@seasoners.eu, or tremayne@seasoners.eu.

## How It Works
1. Someone emails hello@seasoners.eu
2. Cloudflare Email Routing receives it
3. Worker intercepts the email
4. Worker forwards to your Gmail (tremaynechivers@gmail.com)
5. Worker sends auto-reply via Resend API
6. Sender receives professional automated response
7. You receive the original email in Gmail

## Setup Instructions

### Step 1: Deploy Worker
1. Go to: https://dash.cloudflare.com → Workers & Pages
2. Click "Create application"
3. Click "Create Worker"
4. Name it: `email-auto-responder`
5. Click "Deploy"
6. Click "Edit code"
7. Delete default code
8. Copy/paste content from: `cloudflare-worker-email-responder.js`
9. Update line 28: Change `tremaynechivers@gmail.com` to your actual email
10. Click "Save and deploy"

### Step 2: Add Environment Variable
1. In Worker settings → Variables and Secrets
2. Add variable:
   - Name: `RESEND_API_KEY`
   - Value: Your Resend API key (get from https://resend.com/api-keys)
   - Type: Secret (encrypt it)
3. Click "Save"

### Step 3: Connect to Email Routing
1. Go to: Cloudflare dashboard → seasoners.eu → Email → Email Routing
2. Click "Email Workers" tab
3. Click "Create"
4. Configure:
   - Matcher: Custom addresses
   - Addresses: `hello@seasoners.eu`, `support@seasoners.eu`, `tremayne@seasoners.eu`
   - Action: Send to Worker → `email-auto-responder`
5. Click "Save"

### Step 4: Test
1. From external email (Gmail, Outlook), send to: `hello@seasoners.eu`
2. You should receive:
   - Original email in your Gmail inbox
   - Auto-reply sent to sender (from hello@seasoners.eu)
3. Check Cloudflare Worker logs for any errors

## Customization

### Change Auto-Reply Content
Edit the `generateAutoReply()` function in the worker code.

### Change Forwarding Destination
Update line 28 in worker:
```javascript
await message.forward('your-actual-email@gmail.com');
```

### Add More Email Addresses
In Email Workers routing rule, add more addresses to the matcher list.

### Disable Auto-Reply (but keep forwarding)
Comment out lines 30-54 in worker (the auto-reply section).

## Troubleshooting

### Auto-reply not sending
- Check Worker logs: Dashboard → Workers → email-auto-responder → Logs
- Verify RESEND_API_KEY is set correctly
- Verify Resend domain is verified (seasoners.eu must be green in Resend dashboard)
- Check Resend dashboard → Emails for delivery status

### Original email not forwarding
- Verify Email Worker route is active
- Check Email Routing → Activity log
- Ensure destination email (Gmail) is verified

### Worker errors
Common issues:
- `RESEND_API_KEY not found`: Add it in Worker Variables
- `401 Unauthorized`: Check Resend API key is correct
- `Domain not verified`: Verify seasoners.eu in Resend dashboard

## Cost
- Cloudflare Workers: First 100,000 requests/day FREE
- Resend API: First 3,000 emails/month FREE
- Total cost for auto-replies: $0 (unless you exceed free tiers)

## Benefits
✅ Professional automated responses  
✅ Instant acknowledgment to senders  
✅ All emails still forwarded to you  
✅ Customizable per email address  
✅ No manual setup in Gmail  
✅ Works with custom domain  
✅ Fully automated  

## Alternative: Simple Forwarding Only
If you don't need auto-replies, just use Cloudflare Email Routing without the worker:
1. Email Routing → Routing Rules
2. Add routes without Email Workers
3. Emails forward to Gmail (no auto-reply)

Then use Gmail filters/canned responses for manual replies.
