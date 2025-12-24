'use client';

import { AppProviders } from './providers';

export function RootLayoutClient({ children }) {
  return (
    <AppProviders>
      {children}
    </AppProviders>
  );
}
