"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";
import { useLanguage } from "../../components/LanguageProvider";
import { downloadAgreementPDF } from "../../utils/pdf-generator";
import { useState } from "react";


export default function Agreement() {
  const { t } = useLanguage();
  // Demo/mock agreement object for PDF generation and signature status
  // In production, fetch real agreement data here
  const [agreement] = useState({
    id: "demo1234567890",
    listing: { title: "Sample Flatshare", city: "Berlin", region: "Berlin" },
    host: { name: "Alice Host", email: "alice@example.com", id: "host1" },
    guest: { name: "Bob Guest", email: "bob@example.com", id: "guest1" },
    startDate: "2025-12-01",
    endDate: "2026-01-01",
    preamble: t("agreementPreamble"),
    clauses: [
      { title: t("clauseBasicsTitle"), content: t("clauseBasics"), order: 1 },
      { title: t("clauseCultureTitle"), content: t("clauseCulture"), order: 2 },
      { title: t("clauseMutualExitTitle"), content: t("clauseMutualExit"), order: 3 },
      { title: t("clausePaymentsTitle"), content: t("clausePayments"), order: 4 },
      { title: t("clauseHouseRulesTitle"), content: t("clauseHouseRules"), order: 5 },
      { title: t("clauseDisputesTitle"), content: t("clauseDisputes"), order: 6 }
    ],
    signatures: [
      { userId: "host1", name: "Alice Host", signedAt: "2025-11-27T10:00:00Z", ipAddress: "1.2.3.4" },
      { userId: "guest1", name: "Bob Guest", signedAt: "2025-11-27T11:00:00Z", ipAddress: "5.6.7.8" }
    ],
    status: "FULLY_SIGNED",
    finalizedAt: "2025-11-27T12:00:00Z",
    hash: "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
  });

  // Check if both parties have signed
  const bothSigned = agreement && Array.isArray(agreement.signatures)
    && agreement.signatures.some(sig => sig.userId === agreement.host.id)
    && agreement.signatures.some(sig => sig.userId === agreement.guest.id);

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

            {/* Download PDF button, only if both parties have signed */}
            {bothSigned && (
              <div className="flex justify-center mb-8">
                <button
                  onClick={() => downloadAgreementPDF(agreement)}
                  className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center space-x-2 shadow"
                >
                  <span>📄</span>
                  <span>Download PDF</span>
                </button>
              </div>
            )}

            {/* Preamble */}
            <div className="bg-white shadow-sm border rounded-2xl p-6 mb-10">
              <h2 className="text-xl font-semibold text-sky-700 mb-3">Trust Preamble</h2>
              <p className="text-sm leading-relaxed text-slate-700">{t("agreementPreamble")}</p>
            </div>

            {/* Core Clauses */}
            <div className="space-y-6 mb-10">
              {agreement.clauses.map((c, idx) => (
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
