"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";
import { useLanguage } from "../../components/LanguageProvider";
import FeatureHighlights from "../../components/FeatureHighlights";
import TrustAndSafety from "../../components/TrustAndSafety";

export default function About() {
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
  
  return (
    <main>
      <Navbar />
      <AnimatedPage>
        {/* Mission Section */}
        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-sky-900 mb-6">{t('aboutTitle')}</h1>
            <p className="text-slate-700 mb-4">{t('aboutMission')}</p>
            <blockquote className="text-slate-800 bg-sky-50 border border-sky-100 rounded-xl p-5 mb-6 italic leading-relaxed">
              "{t('founderQuote')}"
              <div className="mt-2 text-sm text-sky-700 font-medium">{t('founderQuoteAttribution')}</div>
            </blockquote>
            <p className="text-slate-700 mb-4">{t('aboutHumanConnection')}</p>
            <p className="text-slate-700 mb-4">{t('aboutWhyItMatters')}</p>
          </motion.div>
        </section>

        {/* What We're Fighting Against */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="text-center mb-12">
            <p className="text-sm uppercase font-semibold text-sky-700 tracking-wide mb-2">{t('whyDifferentLabel')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">{t('whyDifferentTitle')}</h2>
            <p className="text-slate-700 max-w-2xl mx-auto">{t('whyDifferentSubtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {whatWeFight.map((item, idx) => (
              <motion.div 
                key={idx}
                className="rounded-2xl border bg-gradient-to-br from-slate-50 to-slate-100 p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-red-700 mb-3"><strong>{t('theProblem')}</strong> {item.problem}</p>
                <p className="text-sm text-emerald-700"><strong>{t('ourSolution')}</strong> {item.solution}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why We're Different */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="text-center mb-12">
            <p className="text-sm uppercase font-semibold text-sky-700 tracking-wide mb-2">{t('diffLabel')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">{t('diffTitle')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {differentiators.map((item, idx) => (
              <motion.div 
                key={item.title} 
                className="bg-white rounded-2xl border p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-sky-900 mb-2">{item.title}</h3>
                <p className="text-slate-700 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section id="trust" className="max-w-3xl mx-auto px-6 pb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">{t('ourValuesTitle')}</h2>
            <p className="text-slate-700 max-w-2xl mx-auto">{t('ourValuesSubtitle')}</p>
          </div>
          <div className="grid gap-4">
            <motion.div 
              className="p-6 rounded-lg bg-white shadow-sm border"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h3 className="font-semibold text-sky-800 mb-2">{t('pillarConnectionTitle')}</h3>
              <p className="text-sm text-slate-600">{t('pillarConnectionBody')}</p>
            </motion.div>
            <motion.div 
              className="p-6 rounded-lg bg-white shadow-sm border"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold text-sky-800 mb-2">{t('pillarFairnessTitle')}</h3>
              <p className="text-sm text-slate-600">{t('pillarFairnessBody')}</p>
            </motion.div>
            <motion.div 
              className="p-6 rounded-lg bg-white shadow-sm border"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold text-sky-800 mb-2">{t('pillarCultureTitle')}</h3>
              <p className="text-sm text-slate-600">{t('pillarCultureBody')}</p>
            </motion.div>
          </div>
        </section>

        {/* Feature Highlights */}
        <FeatureHighlights />

        {/* Trust & Safety Details */}
        <TrustAndSafety />

        {/* Invitation */}
        <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="text-slate-700 mb-4">{t('aboutInvitation')}</p>
            <p className="text-sm text-slate-500 italic mt-6">{t('aboutDisclaimer')}</p>
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />
    </main>
  );
}
