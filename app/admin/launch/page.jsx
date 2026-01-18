'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LaunchControlPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/');
    } else {
      fetchSettings();
    }
  }, [session, status, router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/launch-settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      // Error fetching settings
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (field) => {
    setSaving(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/launch-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [field]: !settings[field],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const updated = await response.json();
      setSettings(updated);
      setMessage(`Successfully ${field === 'isLaunched' ? (updated.isLaunched ? 'launched' : 'unlaunched') : (updated.earlyBirdActive ? 'enabled' : 'disabled')} ${field === 'isLaunched' ? 'site' : 'early-bird pricing'}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF385C]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Launch Control</h1>
          <p className="text-gray-600 mt-2">Manage site launch status and early-bird pricing</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.startsWith('Error') 
              ? 'bg-red-50 text-red-800 border border-red-200' 
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Launch Status */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Site Launch Status</h3>
              <p className="text-gray-600 text-sm">
                {settings?.isLaunched 
                  ? 'Site is LIVE - All users can access the platform' 
                  : 'Site is in PRE-LAUNCH mode - Only early-bird members can access'}
              </p>
              <div className="mt-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  settings?.isLaunched 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {settings?.isLaunched ? '🚀 LAUNCHED' : '⏳ PRE-LAUNCH'}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleToggle('isLaunched')}
              disabled={saving}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                settings?.isLaunched
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {saving ? 'Updating...' : (settings?.isLaunched ? 'Set to Pre-Launch' : 'Launch Site')}
            </button>
          </div>

          {/* Early-Bird Pricing */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Early-Bird Pricing</h3>
              <p className="text-gray-600 text-sm">
                {settings?.earlyBirdActive 
                  ? 'Early-bird pricing (€5/mo) is ACTIVE for new signups' 
                  : 'Regular pricing (€7/€12) is being used for new signups'}
              </p>
              <div className="mt-3 space-y-2">
                <div className="text-sm text-gray-700">
                  <strong>Current Pricing:</strong> Plus €9.90/month (unlimited messaging)
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Boosts:</strong> €9.90/7 days or €29.90/30 days (featured placement)
                </div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('earlyBirdActive')}
              disabled={saving}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                settings?.earlyBirdActive
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {saving ? 'Updating...' : (settings?.earlyBirdActive ? 'Disable Early-Bird' : 'Enable Early-Bird')}
            </button>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">Early-Bird Members</div>
                <div className="text-2xl font-bold text-blue-900 mt-1">
                  {settings?.stats?.earlyBirdCount || 0}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm text-green-600 font-medium">Total Subscribers</div>
                <div className="text-2xl font-bold text-green-900 mt-1">
                  {settings?.stats?.totalSubscribers || 0}
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="text-sm text-purple-600 font-medium">Pending Waitlist</div>
                <div className="text-2xl font-bold text-purple-900 mt-1">
                  {settings?.stats?.pendingWaitlist || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          {settings?.updatedAt && (
            <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
              Last updated: {new Date(settings.updatedAt).toLocaleString()}
              {settings?.updatedBy && ` by admin`}
            </div>
          )}
        </div>

        {/* Warning Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Notes</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Disabling early-bird pricing only affects NEW signups</li>
                  <li>Existing early-bird members keep their €5/month rate forever</li>
                  <li>Launching the site allows ALL users to access, not just early-birds</li>
                  <li>Make sure Stripe has the correct price IDs configured before enabling early-bird pricing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
