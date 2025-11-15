'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  // Early-bird covers all features; no tier selection needed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function joinWaitlist() {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/waitlist/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server error occurred. Please try again.');
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to join waitlist');
      setSuccess("You're on the list! We'll email you when we launch.");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function lockEarlyBird() {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!email) throw new Error('Please enter your email first');
      const res = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEarlyBirdOneTime: true, email }),
      });
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server error occurred. Please try again.');
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start checkout');
      window.location.href = data.checkoutUrl;
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto min-h-[40vh] flex flex-col justify-center items-center text-center px-6 pt-10">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-4 border">
          Early-bird available during pre-launch
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-sky-700 via-sky-800 to-sky-900 bg-clip-text text-transparent mb-4 tracking-tight">
          Pre‑Launch Waitlist
        </h1>
        <p className="text-slate-700/90 max-w-2xl">
          Join the waitlist and optionally lock in early access for €5. We’ll email you the moment Seasoners goes live.
        </p>
      </section>

      {/* Signup Card */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-3xl border bg-white/80 backdrop-blur p-6 md:p-8 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Email + Tier */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 px-4 py-3 rounded-xl border bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              {success && <p className="text-green-700 text-sm mt-2">{success}</p>}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={joinWaitlist}
                disabled={!email || loading}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white hover:bg-black font-semibold disabled:opacity-50"
              >
                {loading ? 'Please wait…' : 'Join Waitlist'}
              </button>
              <button
                onClick={lockEarlyBird}
                disabled={!email || loading}
                className="w-full px-4 py-3 rounded-xl border border-sky-600 text-sky-700 hover:bg-sky-50 font-semibold disabled:opacity-50"
              >
                Lock Early‑Bird (€5)
              </button>
              <p className="text-xs text-slate-500">
                Early‑bird is a one‑time €5 payment to secure founding‑member access covering both Searcher and Lister features. Optional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border bg-white/80 p-6">
            <div className="text-3xl mb-2">🏷️</div>
            <h3 className="font-semibold text-sky-800 mb-1">Early‑Bird</h3>
            <p className="text-sm text-slate-600">Secure early access for a one‑time €5 during pre‑launch.</p>
          </div>
          <div className="rounded-2xl border bg-white/80 p-6">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-semibold text-sky-800 mb-1">No Pressure</h3>
            <p className="text-sm text-slate-600">You can also just join with your email and decide later.</p>
          </div>
          <div className="rounded-2xl border bg-white/80 p-6">
            <div className="text-3xl mb-2">🔔</div>
            <h3 className="font-semibold text-sky-800 mb-1">Launch Notification</h3>
            <p className="text-sm text-slate-600">We’ll notify you the moment we flip the switch.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
