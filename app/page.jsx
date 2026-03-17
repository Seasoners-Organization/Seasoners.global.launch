"use client";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../components/LanguageProvider";
import { ZONES } from '../data/zones';

const STATS = [
  { value: "8", label: "Destinations", icon: "🌍" },
  { value: "3", label: "Categories", icon: "🏷️" },
  { value: "2", label: "Seasons", icon: "🔄" },
  { value: "6", label: "Languages", icon: "💬" },
];

const STEPS = [
  { step: "01", icon: "🔍", title: "Explore Destinations", desc: "Browse seasonal zones from the Alps to Southeast Asia and find the perfect match." },
  { step: "02", icon: "🤝", title: "Connect Directly", desc: "Reach out to hosts and employers directly — no middlemen, no hidden fees." },
  { step: "03", icon: "✍️", title: "Sign the Agreement", desc: "Use our plain-language trust agreement to kick off every stay with clarity." },
];

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 text-white">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
                <span>🌍</span> Global Seasonal Community
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                {t('heroTitle')}
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/stays" className="px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition shadow-lg text-sm">
                  🏡 Find a Stay
                </a>
                <a href="/jobs" className="px-6 py-3 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 transition border border-white/20 text-sm">
                  🧳 Find a Job
                </a>
                <a href="/auth/register" className="px-6 py-3 bg-transparent text-white rounded-xl font-semibold hover:bg-white/10 transition border border-white/25 text-sm">
                  Join Free →
                </a>
              </div>
            </motion.div>

            <motion.div
              className="hidden md:flex justify-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-64 h-64 rounded-3xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center shadow-2xl">
                  <img src="/seasoner-mountain-logo.png" alt="Seasoners" className="w-44 h-auto" />
                </div>
                <div className="absolute -top-4 -right-6 bg-slate-100 text-slate-800 rounded-2xl px-4 py-2 font-bold text-xs shadow-lg">
                  ❄️ Winter Season
                </div>
                <div className="absolute -bottom-4 -left-6 bg-blue-900 text-white rounded-2xl px-4 py-2 font-bold text-xs shadow-lg border border-white/10">
                  ☀️ Summer Ready
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-slate-50" preserveAspectRatio="none" style={{ height: 48 }}>
            <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 -mt-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label, icon }) => (
              <div key={label}>
                <div className="text-2xl font-extrabold text-slate-800">{icon} {value}+</div>
                <div className="text-sm text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE CATEGORIES ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Browse by Category</h2>
        <p className="text-slate-500 mb-8">Find exactly what you're looking for</p>
        <div className="grid md:grid-cols-3 gap-6">

          {/* Stays */}
          <motion.a
            href="/stays"
            whileHover={{ y: -5 }}
            className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-end p-6">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80')" }}
              />
              <div className="relative">
                <div className="text-4xl mb-2">🏡</div>
                <h3 className="text-white text-xl font-bold">{t('staysTitle')}</h3>
                <p className="text-slate-300 text-xs mt-1 max-w-[200px] line-clamp-2">{t('staysSubtitle')}</p>
              </div>
            </div>
            <div className="bg-white p-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-sm text-slate-500">Short-term rentals</span>
              <span className="text-slate-800 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block">Browse →</span>
            </div>
          </motion.a>

          {/* Jobs */}
          <motion.a
            href="/jobs"
            whileHover={{ y: -5 }}
            className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="relative h-48 bg-gradient-to-br from-blue-900 to-blue-950 flex items-end p-6">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80')" }}
              />
              <div className="relative">
                <div className="text-4xl mb-2">🧳</div>
                <h3 className="text-white text-xl font-bold">{t('jobsTitle')}</h3>
                <p className="text-blue-200 text-xs mt-1 max-w-[200px] line-clamp-2">{t('jobsSubtitle')}</p>
              </div>
            </div>
            <div className="bg-white p-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-sm text-slate-500">Seasonal positions</span>
              <span className="text-slate-800 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block">Browse →</span>
            </div>
          </motion.a>

          {/* Flatshares */}
          <motion.a
            href="/flatshares"
            whileHover={{ y: -5 }}
            className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="relative h-48 bg-gradient-to-br from-slate-600 to-blue-900 flex items-end p-6">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80')" }}
              />
              <div className="relative">
                <div className="text-4xl mb-2">🏠</div>
                <h3 className="text-white text-xl font-bold">Flatshares</h3>
                <p className="text-slate-300 text-xs mt-1 max-w-[200px]">Share a place with fellow seasonals</p>
              </div>
            </div>
            <div className="bg-white p-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-sm text-slate-500">Shared living</span>
              <span className="text-slate-800 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block">Browse →</span>
            </div>
          </motion.a>

        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Explore Destinations</h2>
          <p className="text-slate-500 mb-10">Follow the seasons around the world</p>

          {/* Winter */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">❄️</span>
              <h3 className="font-bold text-slate-800 text-lg">Winter Zones</h3>
              <span className="ml-auto text-sm text-blue-900 hover:underline cursor-pointer font-medium">See all →</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ZONES.filter(z => z.season === 'winter').map((zone, i) => (
                <motion.a
                  key={zone.slug}
                  href={`/zones/${zone.slug}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white border border-slate-200"
                >
                  <div className="h-32 overflow-hidden relative">
                    <img src={zone.hero} alt={zone.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                    <span className="absolute bottom-2 left-3 text-white text-xs font-bold">{zone.title}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">{zone.summary}</p>
                    <div className="flex flex-wrap gap-1">
                      {zone.hotspots.slice(0, 2).map(h => (
                        <span key={h} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">{h}</span>
                      ))}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Summer */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">☀️</span>
              <h3 className="font-bold text-slate-800 text-lg">Summer Zones</h3>
              <span className="ml-auto text-sm text-blue-900 hover:underline cursor-pointer font-medium">See all →</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ZONES.filter(z => z.season === 'summer').map((zone, i) => (
                <motion.a
                  key={zone.slug}
                  href={`/zones/${zone.slug}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white border border-slate-200"
                >
                  <div className="h-32 overflow-hidden relative">
                    <img src={zone.hero} alt={zone.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                    <span className="absolute bottom-2 left-3 text-white text-xs font-bold">{zone.title}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">{zone.summary}</p>
                    <div className="flex flex-wrap gap-1">
                      {zone.hotspots.slice(0, 2).map(h => (
                        <span key={h} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">{h}</span>
                      ))}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">How It Works</h2>
        <p className="text-slate-500 text-center mb-12">Get started in three simple steps</p>
        <div className="grid md:grid-cols-3 gap-10">
          {STEPS.map(({ step, icon, title, desc }) => (
            <div key={step} className="text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-200 mb-4">
                <span className="text-3xl">{icon}</span>
                <span className="absolute -top-2 -right-2 bg-blue-950 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {step}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">{t('hpValuesTitle')}</h2>
          <p className="text-slate-500 text-center mb-10">What we stand for</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl mb-4">🤝</div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{t('hpPillarConnection')}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{t('pillarConnectionBody')}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl mb-4">⚖️</div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{t('hpPillarFairness')}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{t('pillarFairnessBody')}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl mb-4">🌍</div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{t('hpPillarCulture')}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{t('pillarCultureBody')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY + AGREEMENT ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Story */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">💙</div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">{t('hpWhyTitle')}</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 italic border-l-4 border-slate-300 pl-4">
              "{t('hpStorySnippet')}"
            </p>
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-700 transition text-sm"
            >
              {t('hpReadOurStory')} →
            </a>
          </div>

          {/* Agreement */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-950 to-slate-900 text-white p-8 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📄</div>
            <h2 className="text-xl font-bold mb-3">{t('hpAgreementTeaserTitle')}</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">{t('hpAgreementTeaserBody')}</p>
            <a
              href="/agreement"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition text-sm"
            >
              {t('hpExploreAgreement')} →
            </a>
          </div>
        </div>
      </section>

      {/* ── JOIN CTA ── */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl mb-6">🌍</div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{t('joinSeasonersCTA')}</h2>
            <p className="text-slate-300 text-lg mb-10">
              Connect with hosts, employers, and travelers across the globe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/register"
                className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition text-base shadow-xl"
              >
                Create Free Account
              </a>
              <a
                href="/stays"
                className="px-8 py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition text-base border border-white/15"
              >
                Browse Listings
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
