"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";
import { useLanguage } from "../../components/LanguageProvider";

export default function About() {
  const { t } = useLanguage();
  
  return (
    <main>
      <Navbar />
      <AnimatedPage>
        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-sky-900 mb-6">{t('aboutTitle')}</h1>
            <p className="text-slate-700 mb-4">{t('aboutMission')}</p>
            <blockquote className="text-slate-800 bg-sky-50 border border-sky-100 rounded-xl p-5 mb-6 italic leading-relaxed">
              “{t('founderQuote')}”
              <div className="mt-2 text-sm text-sky-700 font-medium">{t('founderQuoteAttribution')}</div>
            </blockquote>
            <p className="text-slate-700 mb-4">{t('aboutHumanConnection')}</p>
            <p className="text-slate-700 mb-4">{t('aboutWhyItMatters')}</p>
            <div className="mt-8 grid gap-4 text-left">
              <div className="p-4 rounded-lg bg-white shadow-sm border">
                <h3 className="font-semibold text-sky-800 mb-1">{t('pillarConnectionTitle')}</h3>
                <p className="text-sm text-slate-600">{t('pillarConnectionBody')}</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm border">
                <h3 className="font-semibold text-sky-800 mb-1">{t('pillarFairnessTitle')}</h3>
                <p className="text-sm text-slate-600">{t('pillarFairnessBody')}</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm border">
                <h3 className="font-semibold text-sky-800 mb-1">{t('pillarCultureTitle')}</h3>
                <p className="text-sm text-slate-600">{t('pillarCultureBody')}</p>
              </div>
            </div>
            <p className="text-slate-700 mt-8 mb-4">{t('aboutInvitation')}</p>
            <p className="text-sm text-slate-500 italic mt-6">{t('aboutDisclaimer')}</p>
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />
    </main>
  );
}
