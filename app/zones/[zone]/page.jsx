"use client";

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { getZoneBySlug } from '../../../data/zones';
import Link from 'next/link';
import ZoneAgreementCTA from '../../../components/ZoneAgreementCTA';
import { useLanguage } from '../../../components/LanguageProvider';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TAB_CONFIG = [
  { id: 'stays', icon: '🏠', label: 'Accommodations' },
  { id: 'jobs', icon: '💼', label: 'Jobs' },
  { id: 'guides', icon: '📖', label: 'Guides' },
];

export default function ZonePage({ params }) {
  const { zone } = params;
  const { t, locale } = useLanguage();
  const zoneData = getZoneBySlug(zone);
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [opening, setOpening] = useState('');
  const [activeTab, setActiveTab] = useState('stays');

  useEffect(() => {
    if (!zoneData) return;
    const langKey = locale ? locale.charAt(0).toUpperCase() + locale.slice(1) : 'En';
    setSummary(zoneData[`summary${langKey}`] || zoneData.summary);
    setDescription(zoneData[`description${langKey}`] || zoneData.description);
    setOpening(t('zoneOpening', { zone: zoneData.title }));
  }, [zoneData, locale, t]);

  if (!zoneData) {
    return (
      <main>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">{t('listingNotFound')}<br/>Zone slug: {zone}</div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <img 
          src={zoneData.hero} 
          alt={zoneData.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-6xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg"
            >
              {zoneData.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-white/95 max-w-3xl drop-shadow-md"
            >
              {opening}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-gradient-to-r from-sky-600 to-blue-600 text-white py-6 sticky top-16 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-8 justify-center md:justify-start mb-4">
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold">{Math.floor(Math.random() * 50) + 20}</div>
              <div className="text-sm text-white/90">Active Listings</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold">{zoneData.hotspots?.length || 5}</div>
              <div className="text-sm text-white/90">Popular Areas</div>
            </div>
            <div className="text-center md:text-left hidden sm:block">
              <div className="text-2xl font-bold">{zoneData.season}</div>
              <div className="text-sm text-white/90">Season</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-3 mb-12 overflow-x-auto pb-3">
          {TAB_CONFIG.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.id === 'stays' ? 'Stay' : tab.id === 'jobs' ? 'Jobs' : 'Info'}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'stays' && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-sky-900 mb-6">Accommodations in {zoneData.title}</h2>
              <p className="text-lg text-slate-700 mb-8">{description}</p>
              <Link
                href={`/zones/${zone}/stays`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Browse {zoneData.hotspots?.length || 5}+ Accommodations
                <span>→</span>
              </Link>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-sky-900 mb-6">Jobs in {zoneData.title}</h2>
              <p className="text-lg text-slate-700 mb-8">Find seasonal job opportunities in {zoneData.title}. From hospitality to tourism, discover work that fits your skills.</p>
              <Link
                href={`/zones/${zone}/jobs`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Available Jobs
                <span>→</span>
              </Link>
            </div>
          )}

          {activeTab === 'guides' && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-sky-900 mb-6">Guides & Resources</h2>
              <p className="text-lg text-slate-700 mb-8">Get insider tips for working and living in {zoneData.title}.</p>
              <Link
                href={`/zones/${zone}/guides`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Read Guides
                <span>→</span>
              </Link>
            </div>
          )}
        </motion.div>
      </section>

      {/* Featured Hotspots */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <h2 className="text-3xl font-bold text-sky-900 mb-10">Popular Areas to Explore</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {zoneData.hotspots.map((h, idx) => (
            <motion.div
              key={h}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -4, shadow: 'md' }}
              className="rounded-xl p-6 border border-sky-200 bg-gradient-to-br from-sky-50 to-white hover:shadow-lg transition-all text-center cursor-pointer"
            >
              <span className="text-lg font-semibold text-sky-900">{h}</span>
              <p className="text-xs text-sky-600 mt-2">Popular destination</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trusted Stay Guide */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="rounded-2xl border-2 border-sky-300 bg-gradient-to-br from-sky-50 via-white to-blue-50 p-8 md:p-12">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl">🤝</span>
            <div>
              <h2 className="text-3xl font-bold text-sky-900 mb-4">Seasoners Community Agreement</h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Join a trusted community of verified seasonal workers in {zoneData.title}. Our agreement ensures safety, respect, and clear expectations for everyone.
              </p>
              <ZoneAgreementCTA zone={zone} preset={zoneData.preset} />
            </div>
          </div>
        </div>
      </section>

      {/* Resources & Guides */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <h2 className="text-3xl font-bold text-sky-900 mb-10">Resources & Tips</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ y: -4, shadow: 'lg' }}
            className="rounded-xl border-2 border-slate-200 bg-white p-8 hover:shadow-lg transition-all"
          >
            <h4 className="text-xl font-bold text-slate-900 mb-3">🏔️ Finding Work in {zoneData.title}</h4>
            <p className="text-slate-700 mb-4">Discover the best strategies for finding seasonal employment in this region, including insider tips from experienced workers.</p>
            <a href="#" className="text-sky-600 font-semibold hover:text-sky-700">Read Guide →</a>
          </motion.div>
          <motion.div
            whileHover={{ y: -4, shadow: 'lg' }}
            className="rounded-xl border-2 border-slate-200 bg-white p-8 hover:shadow-lg transition-all"
          >
            <h4 className="text-xl font-bold text-slate-900 mb-3">🏠 Housing & Accommodation</h4>
            <p className="text-slate-700 mb-4">Learn about staff accommodation, shared housing, and rental options available for seasonal workers in {zoneData.title}.</p>
            <a href="#" className="text-sky-600 font-semibold hover:text-sky-700">Read Guide →</a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
