"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SocialProof from "../components/SocialProof";
import FeatureHighlights from "../components/FeatureHighlights";
import TrustAndSafety from "../components/TrustAndSafety";
import SubscriptionTiers from "../components/SubscriptionTiers";
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
  const differentiators = [
    {
      title: "Verified people, not anonymous accounts",
      body: "ID, phone, and dual-language agreements keep every stay and job accountable.",
    },
    {
      title: "Plain-language agreements built in",
      body: "Start with a clear template for stays and seasonal work — no hidden terms or surprise fees.",
    },
    {
      title: "One place for both stays and jobs",
      body: "Hosts, employers, and talent meet in the same workflow with messaging and trust scores included.",
    },
    {
      title: "90-day free trial — no card",
      body: "Try the full platform before you pay. Keep control of your data and your decisions.",
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

      {/* Why we're different */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="rounded-3xl bg-white/80 backdrop-blur border shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase font-semibold text-sky-700 tracking-wide">Built for seasonal lives</p>
              <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mt-1">What makes Seasoners different</h2>
            </div>
            <a
              href="/subscribe"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
            >
              Start free for 90 days →
            </a>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {differentiators.map((item) => (
              <div key={item.title} className="p-4 md:p-5 rounded-2xl border bg-slate-50/60">
                <h3 className="text-lg font-semibold text-sky-900 mb-2">{item.title}</h3>
                <p className="text-slate-700 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Mode Selector */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
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

      {/* Social Proof - Show community growth */}
      <SocialProof />

      {/* Feature Highlights - Showcase key features */}
      <FeatureHighlights />

      {/* Trust & Safety - Build confidence */}
      <TrustAndSafety />

      {/* Subscription Tiers - Show pricing options */}
      <SubscriptionTiers />

      {/* Zone Preview - Updated with filters */}
      <ZonePreview zones={ZONES} />

      {/* FAQ - Reduce signup friction */}
      <FAQ />

      {/* Hero CTA - Strong call to action */}
      <HeroWithCTA />

      <Footer />
    </main>
  );
}
