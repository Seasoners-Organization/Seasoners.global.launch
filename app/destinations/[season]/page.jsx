"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { ZONES } from "../../../data/zones";
import { useLanguage } from "../../../components/LanguageProvider";

const SEASON_LABELS = {
  all: "All Seasons",
  winter: "Winter Destinations",
  summer: "Summer Destinations",
  spring: "Spring Destinations",
  fall: "Fall Destinations",
};

const SEASON_DESCRIPTIONS = {
  winter: "Experience pristine snow-covered landscapes and exciting winter sports opportunities. From Alpine ski resorts to snowy retreats, find your perfect winter adventure.",
  summer: "Discover vibrant Mediterranean coastlines and bustling summer hotspots. Perfect for hospitality, tourism, and outdoor work opportunities.",
  spring: "Explore awakening landscapes and seasonal tourism jobs. Great for hospitality and tour guide positions.",
  fall: "Enjoy harvest season opportunities and mild weather work. Ideal for agricultural and tourism roles.",
  all: "Explore seasonal opportunities year-round across Europe. Find work, stays, and connect with other seasonal workers in thriving communities.",
};

export default function SeasonDestinationsPage() {
  const params = useParams();
  const { t } = useLanguage();
  const season = (params?.season || "all").toString().toLowerCase();

  const zones = useMemo(() => {
    if (season === "all") return ZONES;
    const byPrimary = ZONES.filter((z) => z.season === season);
    if (byPrimary.length > 0) return byPrimary;
    if (season === "spring") return ZONES.filter((z) => z.season === "summer");
    if (season === "fall") return ZONES.filter((z) => z.season === "winter");
    return ZONES;
  }, [season]);

  const pageTitle = SEASON_LABELS[season] || SEASON_LABELS.all;
  const pageDesc = SEASON_DESCRIPTIONS[season] || SEASON_DESCRIPTIONS.all;

  // Get hero image for season
  const heroZone = zones[0] || ZONES[0];

  return (
    <main>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[300px] overflow-hidden">
        <Image
          src={heroZone.hero}
          alt={pageTitle}
          fill
          className="w-full h-full object-cover"
          priority
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
              {pageTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-white/95 max-w-3xl drop-shadow-md"
            >
              {pageDesc}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-sky-600 to-blue-600 text-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap gap-8 justify-center md:justify-start">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0 }}
            className="text-center md:text-left"
          >
            <div className="text-3xl md:text-4xl font-bold">{zones.length}</div>
            <div className="text-sm text-white/90">Destinations</div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-2">Explore {zones.length} Amazing Destinations</h2>
          <p className="text-slate-600 text-lg">Click any destination to browse jobs, accommodations, and connect with other seasonal workers</p>
        </div>

        {/* Zone Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {zones.map((zone, index) => (
            <motion.div
              key={zone.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -8, shadow: "lg" }}
              className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <Link href={`/zones/${zone.slug}`} className="block h-full">
                {/* Image */}
                <div className="h-48 w-full relative bg-slate-100 overflow-hidden">
                  <Image
                    src={zone.hero}
                    alt={zone.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute top-3 right-3 text-xs font-bold text-white bg-black/50 px-3 py-1 rounded-full uppercase backdrop-blur-sm">
                    {zone.season}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-sky-900 mb-2 group-hover:text-sky-700 transition-colors">
                    {zone.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {zone.summary}
                  </p>

                  {/* Hotspots */}
                  {zone.hotspots?.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Popular Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {zone.hotspots.slice(0, 3).map((h) => (
                          <span key={h} className="text-xs bg-sky-50 text-sky-700 px-2 py-1 rounded">
                            {h}
                          </span>
                        ))}
                        {zone.hotspots.length > 3 && (
                          <span className="text-xs text-slate-500">+{zone.hotspots.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-sky-600">View Opportunities</span>
                    <span className="text-lg text-sky-600 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        {season !== "all" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-16 text-center"
          >
            <Link
              href="/destinations/all"
              className="inline-flex items-center gap-2 px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore All Seasons
              <span>→</span>
            </Link>
          </motion.div>
        )}
      </section>

      <Footer />
    </main>
  );
}
