"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ZONES } from "../../../data/zones";

const SEASON_LABELS = {
  all: "All Seasons",
  winter: "Winter Destinations",
  summer: "Summer Destinations",
  spring: "Spring Destinations",
  fall: "Fall Destinations",
};

export default function SeasonDestinationsPage() {
  const params = useParams();
  const season = (params?.season || "all").toString().toLowerCase();

  const zones = useMemo(() => {
    if (season === "all") return ZONES;
    const byPrimary = ZONES.filter((z) => z.season === season);

    if (byPrimary.length > 0) return byPrimary;

    // Sensible fallbacks when there are no explicit entries for spring/fall yet
    if (season === "spring") return ZONES.filter((z) => z.season === "summer");
    if (season === "fall") return ZONES.filter((z) => z.season === "winter");

    return ZONES;
  }, [season]);

  const pageTitle = SEASON_LABELS[season] || SEASON_LABELS.all;

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-900 mb-3">{pageTitle}</h1>
        <p className="text-slate-600 max-w-3xl mx-auto">
          Explore curated destinations for seasonal work and stays. For winter, you'll find European Alps (e.g., Courchevel, Zermatt), Japan Snow Country, and southern hemisphere circuits. For summer, Mediterranean islands and Australia feature strongly.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {zones.map((zone, index) => (
          <motion.div
            key={zone.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.04 }}
            className="group rounded-2xl border bg-white/80 backdrop-blur overflow-hidden shadow-sm hover:shadow-lg transition-all"
          >
            <div className="h-40 w-full relative bg-slate-100 overflow-hidden">
              <Image
                src={zone.hero}
                alt={zone.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 33vw"
                priority={false}
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sky-800">{zone.title}</h3>
                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-full uppercase">{zone.season}</span>
              </div>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{zone.summary}</p>
              {zone.hotspots?.length > 0 && (
                <div className="text-xs text-slate-500 mb-3">
                  Hotspots: <span className="text-slate-700">{zone.hotspots.join(", ")}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <span>Learn more</span>
                <Link href={`/zones/${zone.slug}`} className="text-sky-600 font-semibold">→</Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/destinations/all" className="inline-block px-8 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors">
          Browse All Seasons →
        </Link>
      </div>
    </section>
  );
}
