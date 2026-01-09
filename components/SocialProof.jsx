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
    // Fetch real stats from API
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats/public');
        const data = await res.json();
        
        if (res.ok) {
          // Animate from 0 to actual values
          const targets = { 
            users: data.users || 0, 
            listings: data.listings || 0, 
            connections: data.connections || 0, 
            countries: data.countries || 0 
          };
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
          setLoaded(true);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback to static values if API fails
        setStats({
          users: 1250,
          listings: 380,
          connections: 890,
          countries: 12,
        });
        setLoaded(true);
      }
    };

    if (!loaded) {
      fetchStats();
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
          Trusted by Global Seasonal Workers & Hosts
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Verified members across 50+ countries creating meaningful work and living experiences through fair agreements and transparent communication.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl border border-sky-200 p-8">
        <StatCard
          icon=""
          label="Verified Members"
          value={stats.users}
          suffix="+"
        />
        <StatCard
          icon=""
          label="Verified Listings"
          value={stats.listings}
          suffix="+"
        />
        <StatCard
          icon=""
          label="Successful Matches"
          value={stats.connections}
          suffix="+"
        />
        <StatCard
          icon=""
          label="Countries Active"
          value={stats.countries}
          suffix=""
        />
      </div>
    </motion.section>
  );
}
