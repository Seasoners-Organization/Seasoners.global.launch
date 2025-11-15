"use client";

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #f0f9ff, #ffffff, #fffbeb)',
          padding: '1rem'
        }}>
          <div style={{
            maxWidth: '28rem',
            width: '100%',
            textAlign: 'center',
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#dc2626' }}>⚠️</h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginTop: '1rem' }}>
              Application Error
            </h2>
            <p style={{ color: '#6b7280', marginTop: '1rem' }}>
              A critical error occurred. Please try refreshing the page.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#0ea5e9',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#e5e7eb',
                  color: '#374151',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Back to Home
              </a>
            </div>
            {error.digest && (
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '1rem' }}>
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
