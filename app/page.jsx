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
  
  const whatWeFight = [
    {
      title: t('fightCorpTitle'),
      problem: t('fightCorpProblem'),
      solution: t('fightCorpSolution'),
    },
    {
      title: t('fightScamTitle'),
      problem: t('fightScamProblem'),
      solution: t('fightScamSolution'),
    },
    {
      title: t('fightContractsTitle'),
      problem: t('fightContractsProblem'),
      solution: t('fightContractsSolution'),
    },
    {
      title: t('fightAlgoTitle'),
      problem: t('fightAlgoProblem'),
      solution: t('fightAlgoSolution'),
    },
  ];

  const differentiators = [
    {
      title: t('diffHandshakeTitle'),
      body: t('diffHandshakeBody'),
    },
    {
      title: t('diffVerifiedTitle'),
      body: t('diffVerifiedBody'),
    },
    {
      title: t('diffFeesTitle'),
      body: t('diffFeesBody'),
    },
    {
      title: t('diffTravelTitle'),
      body: t('diffTravelBody'),
    },
  ];

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
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-sky-700 via-sky-800 to-sky-900 bg-clip-text text-transparent mb-6 tracking-tight leading-[1.2] pb-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('heroTitle')}
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-slate-700/90 max-w-2xl leading-relaxed mb-4"
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

      {/* What We're Fighting Against */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-sm uppercase font-semibold text-sky-700 tracking-wide mb-2">{t('whyDifferentLabel')}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4">{t('whyDifferentTitle')}</h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">{t('whyDifferentSubtitle')}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {whatWeFight.map((item, idx) => (
            <motion.div 
              key={idx}
              className="rounded-2xl border bg-gradient-to-br from-slate-50 to-slate-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-red-700 mb-3"><strong>{t('theProblem')}</strong> {item.problem}</p>
              <p className="text-sm text-emerald-700"><strong>{t('ourSolution')}</strong> {item.solution}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Safety & Legal Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl">
        <div className="text-center mb-12">
          <p className="text-sm uppercase font-semibold text-emerald-700 tracking-wide mb-2">{t('safetyLabel')}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{t('safetyTitle')}</h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">{t('safetySubtitle')}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            className="rounded-2xl border-2 border-emerald-300 bg-white p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('safetyVerifiedTitle')}</h3>
            <p className="text-sm text-slate-600">{t('safetyVerifiedDesc')}</p>
          </motion.div>

          <motion.div 
            className="rounded-2xl border-2 border-emerald-300 bg-white p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-4xl mb-3">⚖️</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('safetyTermsTitle')}</h3>
            <p className="text-sm text-slate-600">{t('safetyTermsDesc')}</p>
          </motion.div>

          <motion.div 
            className="rounded-2xl border-2 border-emerald-300 bg-white p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('safetyDisputeTitle')}</h3>
            <p className="text-sm text-slate-600">{t('safetyDisputeDesc')}</p>
          </motion.div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-2xl border-2 border-emerald-200">
          <p className="text-center text-slate-700" dangerouslySetInnerHTML={{ __html: t('safetyPrincipleText') }}></p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="rounded-3xl bg-white/80 backdrop-blur border shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase font-semibold text-sky-700 tracking-wide">{t('howItWorksLabel')}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mt-1">{t('howItWorksTitle')}</h2>
            </div>
            <a
              href="/stays"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
            >
              {t('howItWorksExplore')}
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {howItWorks.map((item, idx) => (
              <div key={item.title} className="p-4 md:p-5 rounded-2xl border bg-slate-50/60 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-sky-900">{item.title}</h3>
                  <span className="text-sm font-semibold text-sky-700">{idx + 1}</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed flex-1">{item.body}</p>
                {item.action && (
                  <a
                    href={item.action.href}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-900"
                  >
                    {item.action.label} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why we're different */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="rounded-3xl bg-white/80 backdrop-blur border shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase font-semibold text-sky-700 tracking-wide">{t('diffLabel')}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mt-1">{t('diffTitle')}</h2>
            </div>
            <a
              href="/list"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
            >
              {t('diffStartListing')}
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
