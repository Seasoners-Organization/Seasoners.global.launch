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

      {/* Main Mode Selector */}
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
