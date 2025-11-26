# Email Domain Migration Checklist

## Pre-Migration Tasks
- [ ] Verify current email delivery is working with `onboarding@resend.dev`
- [ ] Test all 4 email templates locally
- [ ] Document current email volumes and rates
- [ ] Backup current Resend configuration

## DNS Configuration
- [ ] Add SPF record to `seasoners.eu` DNS
- [ ] Add DKIM record(s) provided by Resend
- [ ] Add DMARC record (recommended)
- [ ] Wait for DNS propagation (24-48 hours max)
- [ ] Verify DNS records with `dig` command

## Resend Dashboard
- [ ] Add domain `seasoners.eu` to Resend
- [ ] Complete domain verification
- [ ] Confirm "Verified ✓" status
- [ ] Test sending from new domain via Resend UI

## Code Updates

### Email Template Files
- [ ] Update `utils/onboarding-emails.ts` (4 functions)
  - [ ] `sendWelcomeEmail` - Line ~7
  - [ ] `sendListingPublishedEmail` - Line ~30
  - [ ] `sendMessageNotificationEmail` - Line ~60
  - [ ] `sendSubscriptionConfirmationEmail` - Line ~90

### Other Email Senders
- [ ] Update `app/api/auth/verify-email/route.ts` (Line ~60)
- [ ] Update `utils/agreement-emails.ts` (3 functions)
- [ ] Update `app/api/admin/verify/route.js` (Line ~50)
- [ ] Update `lib/auth.ts` EmailProvider (Line ~25)

### Search & Replace Command
```bash
# Find all occurrences
grep -r "onboarding@resend.dev" .

# Replace in all files (review first!)
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | \
  xargs sed -i '' 's/onboarding@resend\.dev/hello@seasoners.eu/g'
```

## Testing

### Staging/Development
- [ ] Deploy code changes to development environment
- [ ] Register test account → Verify welcome email arrives
- [ ] Create test listing → Verify listing published email
- [ ] Process test subscription → Verify confirmation email
- [ ] Trigger agreement email → Verify delivery
- [ ] Check email headers for proper DKIM signature
- [ ] Verify SPF alignment in email headers
- [ ] Confirm emails not landing in spam

### Production Deployment
- [ ] Commit changes to git
- [ ] Push to production branch
- [ ] Verify Vercel deployment successful
- [ ] Monitor initial email sends
- [ ] Check Resend dashboard for errors
- [ ] Test with personal email account

## Post-Migration Monitoring

### First 24 Hours
- [ ] Check deliverability rate (target: >95%)
- [ ] Monitor spam placement rate (target: <5%)
- [ ] Review bounce rate (target: <3%)
- [ ] Check Resend logs for errors

### First Week
- [ ] Monitor email open rates
- [ ] Track click-through rates
- [ ] Review user feedback/support tickets
- [ ] Check domain reputation with MXToolbox
- [ ] Verify DMARC reports (if configured)

### Ongoing
- [ ] Weekly review of email analytics
- [ ] Monthly domain reputation check
- [ ] Quarterly template updates based on performance

## Rollback Plan

If issues arise, immediately rollback:

1. **Quick Rollback (5 minutes)**
   ```bash
   # Revert code changes
   git revert <commit-hash>
   git push origin main
   
   # OR manually change back to:
   from: 'Seasoners <onboarding@resend.dev>',
   ```

2. **Verify Rollback**
   - Test email delivery with old domain
   - Confirm Resend dashboard shows sends from `onboarding@resend.dev`

3. **Investigate Issues**
   - Check DNS records
   - Review Resend verification status
   - Analyze bounce/spam rates
   - Contact Resend support if needed

## Success Criteria

Migration is successful when:
- ✅ All emails sent from `hello@seasoners.eu`
- ✅ Deliverability rate >95%
- ✅ Bounce rate <3%
- ✅ Spam placement <5%
- ✅ No increase in support tickets about missing emails
- ✅ DKIM signatures passing verification
- ✅ SPF alignment confirmed

## Contact & Support

- **DNS Issues:** Contact your DNS provider support
- **Resend Issues:** support@resend.com
- **Code Issues:** Check GitHub commits or internal team

## Estimated Timeline

- **DNS Setup:** 15 minutes
- **DNS Propagation:** 1-24 hours
- **Code Updates:** 30 minutes
- **Testing:** 1 hour
- **Deployment:** 15 minutes
- **Monitoring:** Ongoing (1 week intensive)

**Total:** ~3 hours of active work + waiting for DNS

---

**Priority:** Medium  
**Risk Level:** Low (easy rollback available)  
**Impact:** High (improved brand trust & deliverability)
