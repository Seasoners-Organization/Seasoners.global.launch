"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export default function ZonePreview({ zones }) {
  const [selectedSeason, setSelectedSeason] = useState('all');

  const seasons = [
    { id: 'all', label: 'All Seasons' },
    { id: 'winter', label: 'Winter' },
    { id: 'summer', label: 'Summer' },
    { id: 'spring', label: 'Spring' },
    { id: 'fall', label: 'Fall' },
  ];

  const seasonZoneMap = {
    'winter': ['tyrol', 'vorarlberg', 'salzburg'],
    'summer': ['tyrol', 'vorarlberg', 'upper-austria', 'carinthia', 'salzburg'],
    'spring': ['lower-austria', 'styria', 'vienna', 'upper-austria'],
    'fall': ['styria', 'lower-austria', 'carinthia', 'salzburg'],
    'all': zones.map(z => z.slug)
  };

  // For demo purposes - in reality, this would come from the backend
  const getZoneStats = (zone) => {
    const listingCounts = {
      'tyrol': 45,
      'salzburg': 32,
      'vorarlberg': 28,
      'upper-austria': 37,
      'vienna': 21,
      'styria': 19,
      'carinthia': 15,
      'lower-austria': 26,
    };
    return listingCounts[zone.slug] || Math.floor(Math.random() * 50);
  };

  const filteredZones = selectedSeason === 'all' 
    ? zones 
    : zones.filter(zone => seasonZoneMap[selectedSeason]?.includes(zone.slug));

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-6">
          Explore Seasons & Destinations
        </h2>
        <p className="text-slate-600 text-lg mb-8">
          Find seasonal opportunities across Europe, from ski resorts to wine regions
        </p>

        {/* Season Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {seasons.map(season => (
            <motion.button
              key={season.id}
              onClick={() => setSelectedSeason(season.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedSeason === season.id
                  ? 'bg-sky-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {season.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Zone Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredZones.map((zone, index) => {
          const listingCount = getZoneStats(zone);
          
          return (
            <motion.a
              key={zone.slug}
              href={`/zones/${zone.slug}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -4, shadow: 'lg' }}
              className="group rounded-2xl border bg-white/80 backdrop-blur overflow-hidden shadow-sm hover:shadow-lg transition-all"
            >
              {/* Image Container */}
              <div className="h-36 w-full relative bg-slate-100 overflow-hidden">
                <Image
                  src={zone.hero}
                  alt={zone.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  priority={false}
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sky-800">{zone.title}</h3>
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-full">
                    {listingCount}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {zone.summary}
                </p>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-3 border-t border-slate-100">
                  <span>Listings available</span>
                  <span className="text-sky-600 font-semibold">→</span>
                </div>

                {/* Season Tags */}
                <div className="flex gap-1 flex-wrap">
                  {['Summer', 'Winter'].map(season => (
                    <span
                      key={season}
                      className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full"
                    >
                      {season}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 text-center"
      >
        <p className="text-slate-600 mb-4">
          Explore more regions and seasonal opportunities
        </p>
        <a
          href="/stays"
          className="inline-block px-8 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors"
        >
          Browse All Listings →
        </a>
      </motion.div>
    </section>
  );
}
