# Production Recovery Checklist

## Once Vercel Security Checkpoint is Cleared:

### 1. Update DATABASE_URL (CRITICAL)
- Go to: https://vercel.com/seasoners-organization/seasoners-global-launch/settings/environment-variables
- Find DATABASE_URL variable
- Click Edit
- Replace with: `postgresql://postgres:6CVpUp4X%26M6.pee@db.owftpnisfdzkgjvrepjt.supabase.co:6543/postgres?pgbouncer=true`
- **Key changes:**
  - Port: 5432 → 6543 (connection pooler)
  - Password: `&` → `%26` (URL encoded)
  - Added: `?pgbouncer=true` (required for serverless)
- Save changes

### 2. Trigger Single Redeploy
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy" 
- **DO NOT** make multiple deployments

### 3. Wait for Deployment to Complete
- Monitor build logs for errors
- Should take 2-3 minutes

### 4. Test Authentication
Once deployed, test in this order:

**A. Check API Health:**
- Visit: https://www.seasoners.eu/api/debug-session
- Should return: `{"hasSession":false,"session":null,"env":{...}}`

**B. Test Google OAuth:**
- Go to: https://www.seasoners.eu/auth/signin
- Click "Sign in with Google"
- Should open Google OAuth popup
- Complete sign-in
- Should redirect to /profile with session

**C. Test Registration:**
- Try creating new account with email/password
- Should successfully create user and sign in

**D. Test Credentials Sign-in:**
- Sign out
- Sign in with email/password
- Should work without errors

### 5. Verify Database Connection
- Check Vercel function logs for any Prisma errors
- Should see successful database queries
- No more "Can't reach database server" errors

### 6. Disable Debug Mode (Optional)
After confirming everything works:
- In `lib/auth.ts` line 237, change `debug: true` to `debug: false`
- Commit and deploy to reduce log noise

## Common Issues After DATABASE_URL Fix:

### Issue: Still getting database errors
- **Check:** Did you URL-encode the `&` as `%26`?
- **Check:** Is port 6543, not 5432?
- **Check:** Is `?pgbouncer=true` at the end?

### Issue: Google OAuth still not working
- **Check:** Is redirect URI in Google Cloud Console?
- **Check:** Are GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET set?
- **Check:** Look in Vercel function logs for NextAuth errors

### Issue: Session not persisting
- **Check:** Is NEXTAUTH_SECRET set?
- **Check:** Is NEXTAUTH_URL set to https://www.seasoners.eu?

## Support Contacts:
- Vercel: https://vercel.com/help
- Vercel Twitter: @vercel
- Supabase: https://supabase.com/dashboard/support
