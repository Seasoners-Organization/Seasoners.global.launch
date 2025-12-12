'use client';

import nextDynamic from 'next/dynamic';

// Load providers dynamically on the client
const AppProviders = nextDynamic(() => import('./providers'), { ssr: false });

export function RootLayoutClient({ children }) {
  return (
    <AppProviders>
      {children}
    </AppProviders>
  );
}
