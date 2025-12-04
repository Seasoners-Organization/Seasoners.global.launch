"use client";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const StatCard = ({ icon, label, value, suffix = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center p-6"
  >
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-3xl md:text-4xl font-bold text-sky-800 mb-1">
      {value}{suffix}
    </div>
    <p className="text-slate-600 text-sm">{label}</p>
  </motion.div>
);

export default function SocialProof() {
  const [stats, setStats] = useState({
    users: 0,
    listings: 0,
    connections: 0,
    countries: 0,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Animate numbers on load
    if (!loaded) {
      setLoaded(true);
      const targets = { users: 1250, listings: 380, connections: 890, countries: 12 };
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setStats({
          users: Math.floor(targets.users * progress),
          listings: Math.floor(targets.listings * progress),
          connections: Math.floor(targets.connections * progress),
          countries: Math.floor(targets.countries * progress),
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [loaded]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto px-6 py-20"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
          Join a Growing Community
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Thousands of seasonal workers and hosts are already connecting on Seasoners
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl border border-sky-200 p-8">
        <StatCard
          icon="👥"
          label="Active Users"
          value={stats.users}
          suffix="+"
        />
        <StatCard
          icon="🏡"
          label="Active Listings"
          value={stats.listings}
          suffix="+"
        />
        <StatCard
          icon="🤝"
          label="Connections Made"
          value={stats.connections}
          suffix="+"
        />
        <StatCard
          icon="🌍"
          label="Countries"
          value={stats.countries}
          suffix=""
        />
      </div>
    </motion.section>
  );
}
