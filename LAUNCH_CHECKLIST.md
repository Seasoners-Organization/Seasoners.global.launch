# 🚀 Seasoners.global Pre-Launch Checklist

## ✅ Code Quality
- [x] No compile errors (`npm run build` passes)
- [x] No console.errors in production code (logging only in scripts)
- [x] Security headers configured in `vercel.json`
- [x] All routes properly authenticated
- [x] Rate limiting implemented (3 endpoints protected)

## ✅ Features Completed
- [x] User authentication (Email + Google OAuth)
- [x] Profile system with completeness tracking
- [x] Listings (Jobs, Stays, Flatshares)
- [x] Direct messaging system
- [x] Trust score system (0-100 scale)
- [x] Subscription system (Free, Searcher, Lister)
- [x] **Subscription cancellation** with 7-day trial
- [x] Email verification
- [x] Phone verification
- [x] Stripe integration
- [x] Digital agreements
- [x] Zone system
- [x] Real-time dynamic homepage statistics
- [x] Multi-language support (EN, DE, ES, FR, IT, PT)

## ⚠️ Environment Variables - MUST SET BEFORE DEPLOYMENT

### Required (Non-negotiable)
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - NextAuth session encryption (min 32 chars)
- [ ] `NEXTAUTH_URL` - Your production domain (https://seasoners.eu)
- [ ] `NEXT_PUBLIC_APP_URL` - Public app URL (https://seasoners.eu)

### Stripe (Payment)
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key (sk_live_...)
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook endpoint secret
- [ ] `NEXT_PUBLIC_STRIPE_SEARCHER_PRICE_ID` - Searcher plan price ID
- [ ] `NEXT_PUBLIC_STRIPE_LISTER_PRICE_ID` - Lister plan price ID

### Email (Resend)
- [ ] `RESEND_API_KEY` - Resend API key (re_...)
- [ ] `EMAIL_FROM` - Sender email (Seasoners <hello@seasoners.eu>)
- [ ] `EMAIL_FROM_SUPPORT` - Support email (Seasoners Support <support@seasoners.eu>)
- [ ] `EMAIL_FROM_FOUNDER` - Founder email (optional)
- [ ] `EMAIL_REPLY_TO_SUPPORT` - Reply-to support email
- [ ] `EMAIL_REPLY_TO_FOUNDER` - Reply-to founder email

### AWS S3 (Profile pictures, listings)
- [ ] `AWS_REGION` - AWS region (eu-west-1)
- [ ] `AWS_ACCESS_KEY_ID` - AWS access key
- [ ] `AWS_SECRET_ACCESS_KEY` - AWS secret key
- [ ] `AWS_S3_BUCKET_NAME` - S3 bucket name

### Google OAuth
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### Translation APIs (Optional but recommended)
- [ ] `DEEPL_API_KEY` - DeepL API key (for translations)
- [ ] `OPENAI_API_KEY` - OpenAI API key (for translations)
- [ ] `OPENAI_MODEL` - OpenAI model (default: gpt-5.1-codex-max)

### Optional
- [ ] `DISABLE_LAUNCH_GATE` - Set to 'false' or leave unset for launch
- [ ] `GOOGLE_TRANSLATE_API_KEY` - Google Translate API key (fallback)

## ✅ Database
- [ ] PostgreSQL database created
- [ ] Prisma migrations run (`npx prisma migrate deploy`)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Database tables created
- [ ] Row Level Security enabled (if using Supabase)

## ✅ Stripe Configuration
- [ ] Webhook endpoint configured pointing to `/api/webhooks/stripe`
- [ ] Webhook events enabled: `customer.subscription.*`, `invoice.*`, `payment_intent.*`
- [ ] Product IDs created for Searcher and Lister tiers
- [ ] Price IDs stored as environment variables
- [ ] Test transactions completed

## ✅ Email Configuration
- [ ] Resend domain verified (seasoners.eu)
- [ ] SPF, DKIM, DMARC records configured
- [ ] Welcome email template tested
- [ ] Verification email template tested
- [ ] Subscription confirmation email tested
- [ ] Message notification email tested

## ✅ DNS & Domain
- [ ] Domain purchased (seasoners.eu)
- [ ] Nameservers updated
- [ ] A record pointing to Vercel
- [ ] www subdomain configured (rewrites in vercel.json)
- [ ] SSL/HTTPS enabled (automatic on Vercel)

## ✅ Deployment (Vercel)
- [ ] Vercel project created
- [ ] GitHub integration configured
- [ ] All environment variables set in Vercel dashboard
- [ ] Custom domain added
- [ ] Production branch set to 'main'
- [ ] Deployment preview created and tested

## ✅ Testing Before Launch
- [ ] Sign up with email works
- [ ] Sign up with Google OAuth works
- [ ] Email verification email received
- [ ] Phone verification works
- [ ] Profile creation and editing works
- [ ] Create listing works (requires subscription)
- [ ] Browse listings works (free)
- [ ] Contact/message features work (requires subscription)
- [ ] Trust score calculation works
- [ ] Subscription checkout works
- [ ] Subscription cancellation works
- [ ] Trial period shows 7 days
- [ ] Landing page loads
- [ ] Zone pages load
- [ ] Help/FAQ pages load
- [ ] Mobile responsive design works

## ✅ Security Checklist
- [x] Security headers configured:
  - [x] X-Content-Type-Options: nosniff
  - [x] X-Frame-Options: DENY
  - [x] X-XSS-Protection: 1; mode=block
  - [x] Referrer-Policy: strict-origin-when-cross-origin
  - [x] Permissions-Policy: camera=(), microphone=(), geolocation=()
  - [x] Strict-Transport-Security: max-age=31536000
  - [x] Content-Security-Policy configured
- [x] HTTPS enabled
- [x] Rate limiting on: `/api/auth/register`, `/api/messages/send`, `/api/messages/poll`
- [x] Password hashing with bcrypt
- [x] JWT tokens with expiration
- [x] Stripe webhook signature verification

## ✅ Performance Optimization
- [x] Next.js production build optimized
- [x] Dynamic imports for heavy components
- [x] Image optimization with Next.js Image component
- [x] API caching configured (stats endpoint: 1 hour)
- [x] Database connection pooling ready
- [x] Compression enabled

## ⚠️ Known Limitations (Document if needed)
- ID verification "coming soon" (messaging note added)
- Government ID verification not yet available
- Some features placeholder until Phase 2

## 📋 Post-Launch Monitoring
- [ ] Set up Sentry error tracking
- [ ] Configure Vercel Analytics
- [ ] Set up database backups
- [ ] Monitor Stripe webhook deliveries
- [ ] Monitor email delivery rates
- [ ] Check server logs regularly

## 🚀 Launch Steps
1. **48 hours before**: Verify all environment variables in Vercel
2. **24 hours before**: Run full test suite, manual testing
3. **Launch day**: 
   - [ ] Final deployment
   - [ ] Verify production domain loads
   - [ ] Test payment flow with real card
   - [ ] Announce launch
4. **Post-launch**: Monitor for 24-48 hours

## 📞 Support Contacts
- **Stripe Support**: https://dashboard.stripe.com/contact
- **Vercel Support**: https://vercel.com/support
- **Resend Support**: https://resend.com/support
- **Supabase Support**: https://supabase.com/support

---
**Last Updated**: December 12, 2025
**Status**: Ready for Launch ✅
