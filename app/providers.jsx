"use client";

import { SessionProvider } from 'next-auth/react';
import LanguageProvider from '../components/LanguageProvider';

export function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function AppProviders({ children }) {
  // Combine session + language providers here to keep layout clean
  return (
    <SessionProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </SessionProvider>
  );
}

export default AppProviders;