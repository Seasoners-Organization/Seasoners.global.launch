'use client';

import { AppProviders } from './providers';
import { Analytics } from '@vercel/analytics/next';

export function RootLayoutClient({ children }) {
  return (
    <AppProviders>
      {children}
      <Analytics />
    </AppProviders>
  );
}
