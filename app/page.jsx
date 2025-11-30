"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../components/LanguageProvider";
import { ZONES } from '../data/zones';

const Card = ({ href, title, subtitle, icon, t }) => (
  <motion.a
    href={href}
    whileHover={{ y: -4, scale: 1.01 }}
    className="group rounded-3xl border bg-white/80 backdrop-blur p-8 shadow-sm hover:shadow-md transition
               focus:outline-none focus:ring-2 focus:ring-sky-600"
  >
    <div className="flex items-center gap-4">
      <div className="rounded-2xl p-3 bg-sky-50 border">
        <span className="text-sky-700">{icon}</span>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-sky-900">{title}</h3>
        <p className="text-slate-600">{subtitle}</p>
      </div>
    </div>
    <div className="mt-6 text-sky-700 font-semibold">
      {t('explore')} {title.toLowerCase()} →
    </div>
  </motion.a>
);

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto min-h-[60vh] flex flex-col justify-center items-center text-center px-6">
        <motion.img
          src="/seasoner-mountain-logo.png"
          alt="Seasoners Logo"
          className="w-48 h-auto mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-sky-700 via-sky-800 to-sky-900 bg-clip-text text-transparent mb-8 tracking-tight leading-[1.2] pb-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('heroTitle')}
        </motion.h1>
        <motion.p
          className="text-lg text-slate-700/90 max-w-2xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {t('heroSubtitle')}
        </motion.p>
      </section>

      {/* Mode selector */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            href="/stays"
            title={t('staysTitle')}
            subtitle={t('staysSubtitle')}
            icon="🏡"
            t={t}
          />
          <Card
            href="/jobs"
            title={t('jobsTitle')}
            subtitle={t('jobsSubtitle')}
            icon="🧳"
            t={t}
          />
        </div>
      </section>

      {/* Explore Seasons & Destinations */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mb-6">Explore Seasons & Destinations</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100">❄️ Winter</div>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100">☀️ Summer</div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {ZONES.map((zone) => (
            <a
              key={zone.slug}
              href={`/zones/${zone.slug}`}
              className="group rounded-2xl border bg-white/80 p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="h-36 w-full rounded-lg overflow-hidden bg-slate-100 mb-3 relative">
                <Image src={zone.hero} alt={zone.title} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" priority={false} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sky-800">{zone.title}</h3>
                  <p className="text-sm text-slate-600">{zone.summary}</p>
                </div>
                <div className="text-sky-600 font-semibold">→</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Story teaser */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="rounded-3xl border bg-white/70 backdrop-blur p-8 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mb-3">{t('hpWhyTitle')}</h2>
          <p className="text-slate-700 mb-4">{t('hpStorySnippet')}</p>
          <a
            href="/about"
            className="inline-flex items-center px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700"
          >
            {t('hpReadOurStory')} →
          </a>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mb-6">{t('hpValuesTitle')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border bg-white/80 p-6">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="font-semibold text-sky-800 mb-1">{t('hpPillarConnection')}</h3>
            <p className="text-sm text-slate-600">{t('pillarConnectionBody')}</p>
          </div>
          <div className="rounded-2xl border bg-white/80 p-6">
            <div className="text-3xl mb-3">⚖️</div>
            <h3 className="font-semibold text-sky-800 mb-1">{t('hpPillarFairness')}</h3>
            <p className="text-sm text-slate-600">{t('pillarFairnessBody')}</p>
          </div>
          <div className="rounded-2xl border bg-white/80 p-6">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-semibold text-sky-800 mb-1">{t('hpPillarCulture')}</h3>
            <p className="text-sm text-slate-600">{t('pillarCultureBody')}</p>
          </div>
        </div>
      </section>

      {/* Agreement teaser */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-3xl border bg-white/80 backdrop-blur p-8 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mb-3">{t('hpAgreementTeaserTitle')}</h2>
          <p className="text-slate-700 mb-4">{t('hpAgreementTeaserBody')}</p>
          <a
            href="/agreement"
            className="inline-flex items-center px-4 py-2 rounded-md border border-sky-600 text-sky-700 hover:bg-sky-50"
          >
            {t('hpExploreAgreement')} →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
