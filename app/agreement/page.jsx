"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";
import { useLanguage } from "../../components/LanguageProvider";

export default function Agreement() {
  const { t } = useLanguage();

  const clauses = [
    { title: t("clauseBasicsTitle"), en: t("clauseBasicsEn"), de: t("clauseBasicsDe") },
    { title: t("clauseCultureTitle"), en: t("clauseCultureEn"), de: t("clauseCultureDe") },
    { title: t("clauseMutualExitTitle"), en: t("clauseMutualExitEn"), de: t("clauseMutualExitDe") },
    { title: t("clausePaymentsTitle"), en: t("clausePaymentsEn"), de: t("clausePaymentsDe") },
    { title: t("clauseHouseRulesTitle"), en: t("clauseHouseRulesEn"), de: t("clauseHouseRulesDe") },
    { title: t("clauseDisputesTitle"), en: t("clauseDisputesEn"), de: t("clauseDisputesDe") }
  ];

  return (
    <main>
      <Navbar />
      <AnimatedPage>
        <section className="max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-sky-900 mb-8 text-center">
              {t("agreementTitle")}<span className="text-amber-500 text-2xl align-super">™</span>
            </h1>

            {/* Preamble */}
            <div className="bg-white shadow-sm border rounded-2xl p-6 mb-10">
              <h2 className="text-xl font-semibold text-sky-700 mb-3">Trust Preamble</h2>
              <p className="text-sm leading-relaxed text-slate-700 mb-4">{t("agreementPreambleEn")}</p>
              <p className="text-sm leading-relaxed text-slate-700 italic">{t("agreementPreambleDe")}</p>
            </div>

            {/* Core Clauses */}
            <div className="space-y-6 mb-10">
              {clauses.map((c, idx) => (
                <div key={idx} className="bg-white border rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-sky-700 mb-2 text-sm tracking-wide">{c.title}</h3>
                  <p className="text-sm text-slate-700 mb-2">{c.en}</p>
                  <p className="text-sm text-slate-700 italic">{c.de}</p>
                </div>
              ))}
            </div>

            {/* Template Examples */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border rounded-2xl p-6 mb-10 text-sm leading-relaxed text-slate-700">
              <h2 className="text-lg font-semibold text-sky-800 mb-4">Plain-Language Template</h2>
              <h3 className="font-semibold text-sky-700 mb-2">{t("agreementEnglish")}</h3>
              <p>{t("agreementTemplateEn")}</p>
              <h3 className="font-semibold text-amber-600 mt-6 mb-2">{t("agreementGerman")}</h3>
              <p>{t("agreementTemplateDe")}</p>
            </div>

            {/* Country Notes */}
            <div className="bg-white shadow-sm border rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-sky-800 mb-3">{t("countryNotesTitle")}</h2>
              <p className="text-sm text-slate-700 mb-2">{t("countryNotesEn")}</p>
              <p className="text-sm text-slate-700 italic">{t("countryNotesDe")}</p>
              <div className="mt-4 text-xs text-slate-500 space-y-1">
                <p><strong>Placeholders:</strong> [NoticeDays], [DueDay], [Method]</p>
                <p>Replace with local legal norms before signing. We will automate country defaults soon.</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic text-center">{t("agreementDisclaimer")}</p>
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />
    </main>
  );
}
