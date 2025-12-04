"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

const TrustFeature = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="flex gap-4"
  >
    <div className="flex-shrink-0 text-3xl">{icon}</div>
    <div>
      <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  </motion.div>
);

export default function TrustAndSafety() {
  const trustFeatures = [
    {
      icon: '✓',
      title: 'Email Verification',
      description: 'All users must verify their email address to access the platform.',
    },
    {
      icon: '📱',
      title: 'Phone Verification',
      description: 'Optional phone verification adds an extra layer of security and trust.',
    },
    {
      icon: '🆔',
      title: 'Government ID Verification',
      description: 'Premium users verify their identity with government-issued ID documents.',
    },
    {
      icon: '⭐',
      title: 'Trust Score System',
      description: 'Every interaction builds a public trust score visible to other users on the platform.',
    },
    {
      icon: '📋',
      title: 'Digital Agreements',
      description: 'All stays and jobs are protected by legally-binding digital agreements with e-signatures.',
    },
    {
      icon: '🛡️',
      title: 'Dispute Resolution',
      description: 'Built-in dispute resolution process helps resolve disagreements fairly and transparently.',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Features list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
            Safety & Trust Built In
          </h2>
          <p className="text-slate-600 text-lg mb-8">
            We've made trust and safety the foundation of Seasoners. Every feature is designed to protect you and build confidence in every interaction.
          </p>

          <div className="space-y-6">
            {trustFeatures.map((feature, index) => (
              <TrustFeature key={index} {...feature} />
            ))}
          </div>

          <Link
            href="/agreement"
            className="inline-block mt-8 px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors"
          >
            Learn About Our Agreements →
          </Link>
        </motion.div>

        {/* Right side - Visual representation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl border border-sky-200 p-8"
        >
          <div className="space-y-6">
            {/* Trust Score Circle */}
            <div className="text-center p-6 bg-white rounded-2xl border border-sky-100">
              <div className="text-5xl font-bold text-sky-600 mb-2">85</div>
              <p className="text-slate-600 font-medium">Average Trust Score</p>
              <p className="text-xs text-slate-500 mt-2">Users who complete verification</p>
            </div>

            {/* Verification badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-emerald-200">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Email Verified</p>
                  <p className="text-xs text-slate-600">100% of users</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-emerald-200">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Phone Verified</p>
                  <p className="text-xs text-slate-600">92% of active users</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-emerald-200">
                <span className="text-2xl">🆔</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">ID Verified</p>
                  <p className="text-xs text-slate-600">78% of premium users</p>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="text-center p-4 bg-gradient-to-r from-emerald-100 to-sky-100 rounded-xl border border-emerald-200">
              <p className="text-sm font-semibold text-emerald-900">🛡️ Your trust is our priority</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
