"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";
import { useLanguage } from "../../components/LanguageProvider";

export default function Agreement() {
  const { t } = useLanguage();

  const clauses = [
    { title: t("clauseBasicsTitle"), content: t("clauseBasics") },
    { title: t("clauseCultureTitle"), content: t("clauseCulture") },
    { title: t("clauseMutualExitTitle"), content: t("clauseMutualExit") },
    { title: t("clausePaymentsTitle"), content: t("clausePayments") },
    { title: t("clauseHouseRulesTitle"), content: t("clauseHouseRules") },
    { title: t("clauseDisputesTitle"), content: t("clauseDisputes") }
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
              <p className="text-sm leading-relaxed text-slate-700">{t("agreementPreamble")}</p>
            </div>

            {/* Core Clauses */}
            <div className="space-y-6 mb-10">
              {clauses.map((c, idx) => (
                <div key={idx} className="bg-white border rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-sky-700 mb-2 text-sm tracking-wide">{c.title}</h3>
                  <p className="text-sm text-slate-700">{c.content}</p>
                </div>
              ))}
            </div>

            {/* Template Examples */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border rounded-2xl p-6 mb-10 text-sm leading-relaxed text-slate-700">
              <h2 className="text-lg font-semibold text-sky-800 mb-4">Plain-Language Template</h2>
              <p>{t("agreementTemplate")}</p>
            </div>

            {/* Country Notes */}
            <div className="bg-white shadow-sm border rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-sky-800 mb-3">{t("countryNotesTitle")}</h2>
              <p className="text-sm text-slate-700">{t("countryNotes")}</p>
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
