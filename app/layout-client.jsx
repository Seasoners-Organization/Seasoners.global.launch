'use client';

import { AppProviders } from './providers';
import { Analytics } from '@vercel/analytics/next';
import CookieConsent from '../components/CookieConsent';
import ErrorBoundary from '../components/ErrorBoundary';
import EarlyBirdModal from '../components/EarlyBirdModal';

export function RootLayoutClient({ children }) {
  return (
    <AppProviders>
      <ErrorBoundary>
        {children}
        <CookieConsent />
        <EarlyBirdModal trigger="navigation" />
        <Analytics />
      </ErrorBoundary>
    </AppProviders>
  );
}
