# Vercel Environment Variables - Complete Setup Guide

## Instructions
1. Go to **Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Delete all existing variables** (or disable them)
3. **Add ONLY the variables below** in "All Environments"
4. Use **exact values** - copy/paste carefully
5. After adding all, Vercel will auto-redeploy

---

## 🔴 CRITICAL (Database & Auth)

### 1. DATABASE_URL
**Value:**
```
postgresql://neondb_owner:npg_wR7uhEQSA1vK@ep-tiny-frog-ad4cnom3-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```
**Note:** Remove `channel_binding=require&` if present

### 2. NEXTAUTH_SECRET
**Generate this:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Example:** `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0`

### 3. NEXTAUTH_URL
**Value:**
```
https://www.seasoners.eu
```

### 4. NEXT_PUBLIC_APP_URL
**Value:**
```
https://www.seasoners.eu
```

---

## 💳 Stripe (Payments)

### 5. STRIPE_SECRET_KEY
**Value:** `sk_live_...` (from Stripe Dashboard → API Keys)

### 6. STRIPE_WEBHOOK_SECRET
**Value:** `whsec_...` (from Stripe Dashboard → Webhooks)

### 7. NEXT_PUBLIC_STRIPE_SEARCHER_PRICE_ID
**Value:** `price_...` (from Stripe Dashboard → Products → Searcher)

### 8. NEXT_PUBLIC_STRIPE_LISTER_PRICE_ID
**Value:** `price_...` (from Stripe Dashboard → Products → Lister)

---

## 📧 Email (Resend)

### 9. RESEND_API_KEY
**Value:** `re_...` (from Resend Dashboard → API Keys)

### 10. EMAIL_FROM
**Value:**
```
Seasoners <hello@seasoners.eu>
```

### 11. EMAIL_FROM_SUPPORT
**Value:**
```
Seasoners Support <support@seasoners.eu>
```

### 12. EMAIL_REPLY_TO_SUPPORT
**Value:**
```
support@seasoners.eu
```

---

## 🖼️ AWS S3 (Image Storage)

### 13. AWS_REGION
**Value:**
```
eu-west-1
```

### 14. AWS_ACCESS_KEY_ID
**Value:** (from AWS IAM → Access Keys)

### 15. AWS_SECRET_ACCESS_KEY
**Value:** (from AWS IAM → Access Keys)

### 16. AWS_S3_BUCKET_NAME
**Value:** (your S3 bucket name, e.g., `seasoners-production`)

---

## 🔐 Google OAuth

### 17. GOOGLE_CLIENT_ID
**Value:** (from Google Cloud Console → OAuth 2.0 Client IDs)

### 18. GOOGLE_CLIENT_SECRET
**Value:** (from Google Cloud Console → OAuth 2.0 Client IDs)

---

## 🤖 AI & Translation (Optional)

### 19. OPENAI_API_KEY
**Value:** `sk-...` (from OpenAI Platform → API Keys)

### 20. OPENAI_MODEL
**Value:**
```
gpt-5.1-codex-max
```

### 21. DEEPL_API_KEY
**Value:** (from DeepL API → Account → Authentication Key) - **Optional**

---

## 🎯 Launch Gate (Keep as-is)

### 22. DISABLE_LAUNCH_GATE
**Value:**
```
false
```

---

## 🔍 reCAPTCHA (Already Set)

### 23. NEXT_PUBLIC_RECAPTCHA_SITE_KEY
**Value:** (Keep existing - this is public, so it's safe)

---

## 📝 Summary Checklist

```
✅ DATABASE_URL (Neon PostgreSQL - no channel_binding)
✅ NEXTAUTH_SECRET (32-char random hex)
✅ NEXTAUTH_URL (https://www.seasoners.eu)
✅ NEXT_PUBLIC_APP_URL (https://www.seasoners.eu)
✅ STRIPE_SECRET_KEY (sk_live_...)
✅ STRIPE_WEBHOOK_SECRET (whsec_...)
✅ NEXT_PUBLIC_STRIPE_SEARCHER_PRICE_ID (price_...)
✅ NEXT_PUBLIC_STRIPE_LISTER_PRICE_ID (price_...)
✅ RESEND_API_KEY (re_...)
✅ EMAIL_FROM (Seasoners <hello@seasoners.eu>)
✅ EMAIL_FROM_SUPPORT (Seasoners Support <support@seasoners.eu>)
✅ EMAIL_REPLY_TO_SUPPORT (support@seasoners.eu)
✅ AWS_REGION (eu-west-1)
✅ AWS_ACCESS_KEY_ID
✅ AWS_SECRET_ACCESS_KEY
✅ AWS_S3_BUCKET_NAME
✅ GOOGLE_CLIENT_ID
✅ GOOGLE_CLIENT_SECRET
✅ OPENAI_API_KEY
✅ OPENAI_MODEL (gpt-5.1-codex-max)
✅ NEXT_PUBLIC_RECAPTCHA_SITE_KEY
✅ DISABLE_LAUNCH_GATE (false)
```

---

## ⚠️ Important Notes

1. **Delete duplicates:** If any variable appears multiple times, delete the old ones
2. **No typos:** Variable names are case-sensitive
3. **Quotes:** Don't include quotes in values
4. **All Environments:** Add to "All Environments" (not just Production)
5. **Auto-redeploy:** Vercel automatically redeploys after changes
6. **Wait 5-10 minutes:** For deployment to complete and errors to clear

---

## Testing After Setup

Once all variables are added:

1. **Wait for deployment** (check Vercel Dashboard)
2. **Visit:** https://www.seasoners.eu/profile
3. **Sign in:** Use email or Google
4. **Check:** Profile should load without "Tenant or user not found" errors

If errors persist, check:
- DATABASE_URL doesn't have `channel_binding=require`
- NEXTAUTH_SECRET is a valid 32+ char hex string
- All Stripe/Resend keys are from LIVE (not test) environments
