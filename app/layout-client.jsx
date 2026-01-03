'use client';

import { AppProviders } from './providers';
import { Analytics } from '@vercel/analytics/next';
import CookieConsent from '../components/CookieConsent';
import ErrorBoundary from '../components/ErrorBoundary';

export function RootLayoutClient({ children }) {
  return (
    <AppProviders>
      <ErrorBoundary>
        {children}
        <CookieConsent />
        <Analytics />
      </ErrorBoundary>
    </AppProviders>
  );
}
