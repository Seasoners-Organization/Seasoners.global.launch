'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { canCreateListings } from '../utils/subscription';

export default function AnalyticsDashboard({ user }) {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!canCreateListings(user)) {
      setError('Only Listers can view analytics');
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/listings/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const data = await response.json();
        setAnalytics(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (!canCreateListings(user)) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-amber-900 mb-2">Upgrade to Lister</h3>
        <p className="text-amber-800 mb-4">
          Analytics are available for Listers. Upgrade your subscription to track your listing performance.
        </p>
        <a
          href="/subscribe"
          className="inline-block px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
        >
          View Lister Plans
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (analytics.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <p className="text-slate-600 mb-4">No analytics data available yet.</p>
        <a
          href="/list"
          className="inline-block px-6 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition"
        >
          Create Your First Listing
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          {
            label: 'Total Views',
            value: analytics.reduce((sum, item) => sum + item.stats.totalViews, 0),
            icon: '',
          },
          {
            label: 'Total Messages',
            value: analytics.reduce((sum, item) => sum + item.stats.totalMessages, 0),
            icon: '',
          },
          {
            label: 'Total Applications',
            value: analytics.reduce((sum, item) => sum + item.stats.totalApplications, 0),
            icon: '',
          },
          {
            label: 'Total Saves',
            value: analytics.reduce((sum, item) => sum + item.stats.totalSaves, 0),
            icon: '',
          },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-sky-700">{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Listing Details */}
      <div className="space-y-4">
        {analytics.map((listing, idx) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-sky-100 text-sky-800">
                    {listing.type}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  {listing.location} • €{listing.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">Created</p>
                <p className="text-sm font-medium">
                  {new Date(listing.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <StatBox label="Views" value={listing.stats.totalViews} />
              <StatBox label="Unique Views" value={listing.stats.totalUniqueViews} />
              <StatBox label="Messages" value={listing.stats.totalMessages} />
              <StatBox label="Applications" value={listing.stats.totalApplications} />
              <StatBox label="Saves" value={listing.stats.currentSaves} subtext="current" />
              <StatBox label="Reviews" value={listing.stats.totalReviews} />
              <StatBox label="Active Agreements" value={listing.stats.totalAgreements} />
              <StatBox 
                label="Interest Score" 
                value={Math.round((listing.stats.totalMessages + listing.stats.totalApplications) * 0.5)} 
              />
            </div>

            {/* Conversion Metrics */}
            {listing.stats.totalViews > 0 && (
              <div className="bg-slate-50 rounded p-3 text-sm">
                <p className="text-slate-700">
                  <span className="font-medium">Engagement Rate:</span>{' '}
                  {(
                    ((listing.stats.totalMessages + listing.stats.totalApplications) /
                      listing.stats.totalViews) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatBox({ label, value, subtext }) {
  return (
    <div className="bg-slate-50 rounded p-3">
      <p className="text-xs text-slate-600 mb-1">
        {label} {subtext && <span className="text-slate-500">({subtext})</span>}
      </p>
      <p className="text-2xl font-bold text-sky-700">{value}</p>
    </div>
  );
}
