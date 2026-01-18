"use client";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SocialProof from "../components/SocialProof";
import FAQ from "../components/FAQ";
import ZonePreview from "../components/ZonePreview";
import HeroWithCTA from "../components/HeroWithCTA";
import { useLanguage } from "../components/LanguageProvider";
import { ZONES } from '../data/zones';
import { generateOrganizationStructuredData } from '../utils/structured-data';

const Card = ({ href, title, subtitle, icon, t }) => (
  <motion.a
    href={href}
    whileHover={{ y: -4, scale: 1.01 }}
    className="group rounded-3xl border bg-white/80 backdrop-blur p-8 shadow-sm hover:shadow-md transition
               focus:outline-none focus:ring-2 focus:ring-sky-600"
  >
    <div className="flex items-center gap-4">
      <div className="rounded-2xl px-3 py-2 bg-sky-50 border text-sky-800 text-sm font-semibold uppercase tracking-wide">
        {icon}
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
  
  const howItWorks = [
    {
      title: t('stepCreateTitle'),
      body: t('stepCreateBody'),
      action: { label: t('stepCreateAction'), href: "/auth/signin" },
    },
    {
      title: t('stepFindTitle'),
      body: t('stepFindBody'),
      action: { label: t('stepFindAction'), href: "/stays" },
    },
    {
      title: t('stepAgreeTitle'),
      body: t('stepAgreeBody'),
      action: { label: t('stepAgreeAction'), href: "/messages" },
    },
  ];
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationStructuredData()) }}
      />
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto min-h-[60vh] flex flex-col justify-center items-center text-center px-6 py-12">
        <motion.img
          src="/seasoner-mountain-logo.png"
          alt="Seasoners Logo"
          className="w-40 md:w-48 h-auto mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-sky-700 via-sky-800 to-sky-900 bg-clip-text text-transparent mb-4 tracking-tight leading-[1.2] pb-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('heroTitle')}
        </motion.h1>
        <motion.p
          className="text-base md:text-lg text-slate-700/90 max-w-2xl leading-relaxed mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {t('heroSubtitle')}
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <a
            href="/stays"
            className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition"
          >
            {t('browseStays')}
          </a>
          <a
            href="/jobs"
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
          >
            {t('exploreJobs')}
          </a>
        </motion.div>
      </section>

      {/* Main Mode Selector */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            href="/stays"
            title={t('staysTitle')}
            subtitle={t('staysSubtitle')}
            icon="Stays"
            t={t}
          />
          <Card
            href="/jobs"
            title={t('jobsTitle')}
            subtitle={t('jobsSubtitle')}
            icon="Jobs"
            t={t}
          />
        </div>
      </section>

      {/* Simplified How It Works */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-2">{t('howItWorksTitle')}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">{t('howItWorksSubtitle')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {howItWorks.map((item, idx) => (
            <motion.div 
              key={item.title} 
              className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-sky-600">{idx + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-sky-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{item.body}</p>
              {item.action && (
                <a
                  href={item.action.href}
                  className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-900"
                >
                  {item.action.label} →
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Banner - Compact */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <motion.div 
          className="rounded-2xl bg-gradient-to-br from-emerald-50 to-sky-50 border-2 border-emerald-200 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{t('safetyTitle')}</h2>
          <p className="text-slate-700 mb-4 max-w-2xl mx-auto">{t('safetySubtitle')}</p>
          <a
            href="/about#trust"
            className="inline-flex items-center px-6 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
          >
            {t('learnMoreAboutSafety')} →
          </a>
        </motion.div>
      </section>

      {/* Social Proof */}
      <SocialProof />

      {/* Pricing CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <motion.div 
          className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{t('pricingCTATitle')}</h2>
          <p className="text-slate-700 mb-6 max-w-2xl mx-auto">{t('pricingCTADesc')}</p>
          <a
            href="/subscribe"
            className="inline-flex items-center px-8 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
          >
            {t('viewPricing')} →
          </a>
        </motion.div>
      </section>

      {/* Zone Preview */}
      <ZonePreview zones={ZONES} />

      {/* FAQ */}
      <FAQ />

      {/* Hero CTA */}
      <HeroWithCTA />

      <Footer />
    </main>
  );
}
