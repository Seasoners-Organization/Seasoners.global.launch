-- Enable Row Level Security on all tables
-- This migration enables RLS but allows service role (Prisma) full access
-- NextAuth uses Prisma with service role credentials, so it bypasses RLS

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Listing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Agreement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LaunchSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WaitlistSignup" ENABLE ROW LEVEL SECURITY;

-- Create permissive policies that allow authenticated connections
-- Since we use NextAuth (not Supabase Auth), we allow all operations for authenticated database users
-- RLS is enabled for security, but policies are permissive for service role connections

-- User table policies
CREATE POLICY "Allow service role full access to users" ON "User"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Account table policies  
CREATE POLICY "Allow service role full access to accounts" ON "Account"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Session table policies
CREATE POLICY "Allow service role full access to sessions" ON "Session"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- VerificationToken table policies
CREATE POLICY "Allow service role full access to verification tokens" ON "VerificationToken"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Listing table policies
CREATE POLICY "Allow service role full access to listings" ON "Listing"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Review table policies
CREATE POLICY "Allow service role full access to reviews" ON "Review"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- VerificationAttempt table policies
CREATE POLICY "Allow service role full access to verification attempts" ON "VerificationAttempt"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Agreement table policies
CREATE POLICY "Allow service role full access to agreements" ON "Agreement"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- LaunchSettings table policies
CREATE POLICY "Allow service role full access to launch settings" ON "LaunchSettings"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- WaitlistSignup table policies
CREATE POLICY "Allow service role full access to waitlist" ON "WaitlistSignup"
  FOR ALL
  USING (true)
  WITH CHECK (true);
