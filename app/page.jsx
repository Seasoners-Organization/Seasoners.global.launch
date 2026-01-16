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
      title: "❌ Corporate real estate platforms",
      problem: "Middlemen taking 20-30% commissions. Massive fees that inflate prices.",
      solution: "Direct connections. You keep 100% of the negotiation power.",
    },
    {
      title: "❌ Scammers and fake listings",
      problem: "Unverified accounts and elaborate scams. You never know who's real.",
      solution: "ID verification. Real people with real trust scores. Accountability matters.",
    },
    {
      title: "❌ Complex contracts and hidden terms",
      problem: "Legal jargon and surprise fees. Unclear what you're actually paying for.",
      solution: "Simple, clear agreements between two people. A handshake, but digital.",
    },
    {
      title: "❌ Algorithm-driven isolation",
      problem: "Platforms force communities. You find random strangers, not people like you.",
      solution: "YOU choose who you connect with. Direct messaging. Real conversations.",
    },
  ];

  const differentiators = [
    {
      title: "🤝 Simple handshake agreements",
      body: "6-12 month leases with real people. No corporate landlords, no forced contracts. Just you and them, working it out.",
    },
    {
      title: "🛡️ Verified people, not platforms",
      body: "ID and phone verification mean real accountability. Scammers get filtered out. Trust is earned, not faked.",
    },
    {
      title: "💰 Zero platform fees",
      body: "You negotiate directly with owners and employers. No middlemen. No hidden commissions. What you agree to is what you pay.",
    },
    {
      title: "🌍 Travel and work freely",
      body: "Live your dream. Work in Innsbruck for the ski season. Live in Barcelona for the summer. Stay as long as you want, move freely.",
    },
  ];

  const howItWorks = [
    {
      title: "Create your profile",
      body: "Verify who you are. Build your real identity and trust score. Make an actual connection with hosts.",
      action: { label: "Get started", href: "/auth/signin" },
    },
    {
      title: "Find people and places",
      body: "Browse stays, jobs, and people looking for seasonal help. Message directly. No algorithms. No bots. Real conversations.",
      action: { label: "Browse listings", href: "/stays" },
    },
    {
      title: "Agree and move forward",
      body: "Talk it through. Agree on terms together. Simple, clear, done. No lawyers, no fees, no corporate middlemen.",
      action: { label: "Start connecting", href: "/messages" },
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
          Travel, live, and work where you dream
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-slate-700/90 max-w-2xl leading-relaxed mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          No corporate landlords. No agent fees. No scammers. Just people connecting directly for seasonal work and living — the way it used to be.
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
            Find seasonal stays
          </a>
          <a
            href="/jobs"
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
          >
            Find seasonal work
          </a>
        </motion.div>
      </section>

      {/* What We're Fighting Against */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-sm uppercase font-semibold text-sky-700 tracking-wide mb-2">Why Seasoners is different</p>
          <h2 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4">We're bringing back simple seasonal living</h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">No corporate middlemen. No agent fees. No scams. Just direct connections between real people.</p>
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
              <p className="text-sm text-red-700 mb-3"><strong>The problem:</strong> {item.problem}</p>
              <p className="text-sm text-emerald-700"><strong>Our solution:</strong> {item.solution}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Safety & Legal Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl">
        <div className="text-center mb-12">
          <p className="text-sm uppercase font-semibold text-emerald-700 tracking-wide mb-2">Your Peace of Mind</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Safe, Legal, and Protected</h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">Simple doesn't mean unprotected. We believe in direct connections WITH legal safeguards.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            className="rounded-2xl border-2 border-emerald-300 bg-white p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Identities</h3>
            <p className="text-sm text-slate-600">ID and phone verification for every user. No anonymity. Real accountability. Real safety.</p>
          </motion.div>

          <motion.div 
            className="rounded-2xl border-2 border-emerald-300 bg-white p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-4xl mb-3">⚖️</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Clear Terms & Conditions</h3>
            <p className="text-sm text-slate-600">Legal protections are built in. You have <a href="/terms" className="text-sky-600 hover:text-sky-700 font-semibold">clear T&Cs</a> and <a href="/privacy" className="text-sky-600 hover:text-sky-700 font-semibold">privacy rights</a> that protect you.</p>
          </motion.div>

          <motion.div 
            className="rounded-2xl border-2 border-emerald-300 bg-white p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Dispute Resolution</h3>
            <p className="text-sm text-slate-600">If something goes wrong, we have processes to help. Direct support and fair resolution between parties.</p>
          </motion.div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-2xl border-2 border-emerald-200">
          <p className="text-center text-slate-700"><strong>Simple principles:</strong> Direct connections YES. Zero legal protection NO. We keep it simple but we keep you safe.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="rounded-3xl bg-white/80 backdrop-blur border shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase font-semibold text-sky-700 tracking-wide">How it works</p>
              <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mt-1">Three simple steps to freedom</h2>
            </div>
            <a
              href="/stays"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
            >
              Explore opportunities →
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
              <p className="text-sm uppercase font-semibold text-sky-700 tracking-wide">What makes us different</p>
              <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mt-1">Built for real seasonal living</h2>
            </div>
            <a
              href="/list"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
            >
              Start listing →
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
