
[+] Added enums
  - UserRole
  - VerificationStatus
  - Region
  - SubscriptionTier
  - SubscriptionStatus
  - AgreementStatus

[+] Added tables
  - Account
  - Session
  - VerificationToken
  - User
  - Listing
  - Agreement
  - Review
  - VerificationAttempt
  - LaunchSettings
  - WaitlistSignup
  - Message

[*] Changed the `Account` table
  [+] Added unique index on columns (provider, providerAccountId)
  [+] Added foreign key on columns (userId)

[*] Changed the `Agreement` table
  [+] Added unique index on columns (hash)
  [+] Added index on columns (hostId)
  [+] Added index on columns (guestId)
  [+] Added index on columns (listingId)
  [+] Added index on columns (status)
  [+] Added foreign key on columns (listingId)
  [+] Added foreign key on columns (hostId)
  [+] Added foreign key on columns (guestId)

[*] Changed the `Listing` table
  [+] Added foreign key on columns (userId)

[*] Changed the `Message` table
  [+] Added index on columns (senderId, recipientId)
  [+] Added index on columns (listingId)
  [+] Added foreign key on columns (senderId)
  [+] Added foreign key on columns (recipientId)
  [+] Added foreign key on columns (listingId)

[*] Changed the `Review` table
  [+] Added foreign key on columns (listingId)
  [+] Added foreign key on columns (reviewerId)
  [+] Added foreign key on columns (targetId)

[*] Changed the `Session` table
  [+] Added unique index on columns (sessionToken)
  [+] Added foreign key on columns (userId)

[*] Changed the `User` table
  [+] Added unique index on columns (email)
  [+] Added unique index on columns (stripeCustomerId)
  [+] Added unique index on columns (stripeSubscriptionId)

[*] Changed the `VerificationAttempt` table
  [+] Added foreign key on columns (userId)

[*] Changed the `VerificationToken` table
  [+] Added unique index on columns (token)
  [+] Added unique index on columns (identifier, token)

[*] Changed the `WaitlistSignup` table
  [+] Added unique index on columns (email)
  [+] Added foreign key on columns (userId)
