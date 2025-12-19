'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SubscriptionSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifySession = async () => {
      try {
        if (!sessionId) {
          setMessage('No session ID found. Please contact support.');
          setLoading(false);
          return;
        }

        // Verify the session with backend (optional, mainly for security)
        const res = await fetch('/api/subscription/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (res.ok) {
          setMessage('Your subscription is active! Check your email for confirmation and invoice.');
        } else {
          setMessage('Subscription confirmed. Check your email for details.');
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        setMessage('Subscription confirmed. Check your email for confirmation and invoice.');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-amber-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-6">🎉</div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome to Seasoners!
        </h1>
        
        <p className="text-lg text-slate-600 mb-6">
          Your subscription is active and ready to use.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <p className="text-green-800 font-semibold mb-2">✓ Subscription Confirmed</p>
          <p className="text-sm text-green-700">
            {message || 'Check your email for your invoice and confirmation.'}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <p className="text-slate-600 text-sm">
            <strong>Next steps:</strong>
          </p>
          <ul className="text-left space-y-2 text-slate-600 text-sm">
            <li className="flex gap-2">
              <span className="text-sky-600">1.</span>
              <span>Check your email for invoice and confirmation</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sky-600">2.</span>
              <span>Complete your profile to build trust</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sky-600">3.</span>
              <span>Verify your phone for better visibility</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sky-600">4.</span>
              <span>Start exploring opportunities</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link href="/profile">
            <button className="w-full px-6 py-3 bg-gradient-to-r from-sky-600 to-amber-600 hover:from-sky-700 hover:to-amber-700 text-white rounded-lg font-semibold transition">
              Go to Profile
            </button>
          </Link>
          
          <Link href="/jobs">
            <button className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition">
              Browse Opportunities
            </button>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Questions? <Link href="/contact" className="text-sky-600 hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
