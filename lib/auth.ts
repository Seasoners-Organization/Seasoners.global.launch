import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import zxcvbn from 'zxcvbn';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import { getResend } from './resend';
import type { NextAuthOptions } from 'next-auth';

// Build providers array conditionally based on available env vars
const providers: any[] = [];

// Only include Google if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'USER',
          emailVerified: profile.email_verified,
        };
      },
    })
  );
}

// Email provider (requires Resend)
if (process.env.RESEND_API_KEY) {
  providers.push(
    EmailProvider({
      from: 'Seasoners <onboarding@resend.dev>',
      sendVerificationRequest: async ({ identifier, url }) => {
        const resend = getResend();
        if (!resend) {
          console.warn('RESEND_API_KEY not set; skipping verification email send.');
          return;
        }
        try {
          const result = await resend.emails.send({
            from: 'Seasoners <onboarding@resend.dev>',
            to: identifier,
            subject: 'Sign in to Seasoners',
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
                          max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #334155;">
                
                <div style="text-align: center; margin-bottom: 32px;">
                  <h1 style="color: #0369a1; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
                    Sign in to Seasoners
                  </h1>
                  <p style="color: #64748b; font-size: 15px; margin: 0;">
                    Your secure sign-in link is ready.
                  </p>
                </div>

                <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                  <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                    Click the button below to securely sign in to your Seasoners account.
                  </p>
                  
                  <a href="${url}" 
                     style="display: inline-block; background: #0369a1; color: white; 
                            padding: 14px 28px; border-radius: 8px; text-decoration: none; 
                            font-weight: 600; font-size: 15px;">
                    Sign in to Seasoners
                  </a>
                </div>

                <div style="padding: 16px; background: #fef3c7; border-left: 3px solid #f59e0b; 
                            border-radius: 6px; margin-bottom: 24px;">
                  <p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.5;">
                    <strong>Security note:</strong> This link expires in 24 hours and can only be used once. 
                    Never share this email with anyone.
                  </p>
                </div>

                <div style="text-align: center; color: #94a3b8; font-size: 13px;">
                  <p style="margin: 0 0 8px 0;">
                    If you didn't request this email, you can safely ignore it.
                  </p>
                  <p style="margin: 0;">
                    © ${new Date().getFullYear()} Seasoners. All rights reserved.
                  </p>
                </div>
              </div>
            `,
          });
        } catch (error) {
          console.error('Failed to send verification email:', error);
          throw error;
        }
      },
    })
  );
}

// Credentials provider (always available for email/password login)
providers.push(
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Incorrect email or password');
        }

        // Simple password comparison (in production, use bcrypt)
        if (user.password !== credentials.password) {
          throw new Error('Incorrect email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    })
);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Check if user exists with this email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { accounts: true }
        });
        
        if (existingUser) {
          // Check if this Google account is already linked
          const hasGoogleAccount = existingUser.accounts.some(
            acc => acc.provider === 'google' && acc.providerAccountId === account.providerAccountId
          );
          
          if (!hasGoogleAccount) {
            // Link the Google account to existing user
            try {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  refresh_token: account.refresh_token,
                },
              });
            } catch (e) {
              console.error('Failed to link Google account:', e);
              return false;
            }
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.emailVerified = (user as any).emailVerified;
        token.phoneVerified = (user as any).phoneVerified;
        token.identityVerified = (user as any).identityVerified;
        token.businessVerified = (user as any).businessVerified;
      }
      // Enrich token with early-bird/waitlist and subscription fields from DB
      try {
        const dbUser = token.email ? await prisma.user.findUnique({ where: { email: token.email as string } }) : null;
        if (dbUser) {
          (token as any).isEarlyBird = (dbUser as any).isEarlyBird;
          (token as any).waitlistStatus = (dbUser as any).waitlistStatus;
          (token as any).subscriptionTier = (dbUser as any).subscriptionTier;
          (token as any).subscriptionStatus = (dbUser as any).subscriptionStatus;
          (token as any).subscriptionExpiresAt = (dbUser as any).subscriptionExpiresAt;
        }
      } catch (e) {
        console.error('JWT enrichment failed:', e);
      }
      if (!token.emailVerified) {
        token.unverified = true;
      } else {
        delete token.unverified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).emailVerified = token.emailVerified;
        (session.user as any).phoneVerified = token.phoneVerified;
        (session.user as any).identityVerified = token.identityVerified;
        (session.user as any).businessVerified = token.businessVerified;
        (session.user as any).unverified = token.unverified;
        (session.user as any).isEarlyBird = (token as any).isEarlyBird;
        (session.user as any).waitlistStatus = (token as any).waitlistStatus;
        (session.user as any).subscriptionTier = (token as any).subscriptionTier;
        (session.user as any).subscriptionStatus = (token as any).subscriptionStatus;
        (session.user as any).subscriptionExpiresAt = (token as any).subscriptionExpiresAt;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
    error: '/auth/error',
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },
  useSecureCookies: true,
};
