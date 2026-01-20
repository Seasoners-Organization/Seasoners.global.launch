"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function ZonePreview({ zones }) {
  const [selectedSeason, setSelectedSeason] = useState('all');
  const { t } = useLanguage();

  const seasons = [
    { id: 'all', label: t('seasonAll'), emoji: '🌍' },
    { id: 'winter', label: t('seasonWinter'), emoji: '❄️' },
    { id: 'summer', label: t('seasonSummer'), emoji: '☀️' },
    { id: 'spring', label: t('seasonSpring'), emoji: '🌱' },
    { id: 'fall', label: t('seasonFall'), emoji: '🍂' },
  ];

  const seasonZoneMap = {
    'winter': ['tyrol', 'vorarlberg', 'salzburg'],
    'summer': ['tyrol', 'vorarlberg', 'upper-austria', 'carinthia', 'salzburg'],
    'spring': ['lower-austria', 'styria', 'vienna', 'upper-austria'],
    'fall': ['styria', 'lower-austria', 'carinthia', 'salzburg'],
    'all': zones.map(z => z.slug)
  };

  const filteredZones = selectedSeason === 'all' 
    ? zones 
    : zones.filter(zone => seasonZoneMap[selectedSeason]?.includes(zone.slug));

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
            {t('zonePreviewTitle')}
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-3xl">
            {t('zonePreviewDesc')}
          </p>
        </motion.div>

        {/* Season Filter with Emoji */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6">
          {seasons.map((season, idx) => (
            <motion.button
              key={season.id}
              onClick={() => setSelectedSeason(season.id)}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-2 text-sm md:text-base ${
                selectedSeason === season.id
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
              }`}
            >
              <span className="text-lg">{season.emoji}</span>
              <span>{season.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Zone Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredZones.map((zone, index) => {
          return (
            <motion.div
              key={zone.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group h-full"
            >
              <Link
                href={`/zones/${zone.slug}`}
                className="flex flex-col h-full rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-md hover:shadow-2xl hover:border-sky-300 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="h-40 w-full relative bg-slate-100 overflow-hidden">
                  <Image
                    src={zone.hero}
                    alt={zone.title}
                    fill
                    className="object-cover group-hover:scale-125 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-3 right-3 text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full uppercase backdrop-blur-sm">
                    {zone.season}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-sky-900 group-hover:text-sky-700 transition-colors mb-3">
                      {zone.title}
                    </h3>

                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                      {zone.summary}
                    </p>

                    {/* Hotspots Preview */}
                    {zone.hotspots?.length > 0 && (
                      <div className="mb-4 pb-4 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Popular Areas</p>
                        <div className="flex flex-wrap gap-1.5">
                          {zone.hotspots.slice(0, 3).map((h) => (
                            <span key={h} className="text-xs bg-sky-50 text-sky-700 px-2 py-1 rounded">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-sm">
                    <span className="font-semibold text-sky-600 group-hover:text-sky-700">Explore</span>
                    <motion.span
                      className="text-lg text-sky-600 group-hover:text-sky-700"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-16 text-center"
      >
        <p className="text-slate-600 text-lg mb-6">
          {t('zoneExploreMore')}
        </p>
        <Link
          href="/destinations/all"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 text-lg"
        >
          {t('zoneBrowseAllBtn')}
          <span>→</span>
        </Link>
      </motion.div>
    </section>
  );
}
