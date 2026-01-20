"use client";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AnimatedPage from "../../../components/AnimatedPage";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageProvider";

export default function SafetyHelp() {
  const { t } = useLanguage();
  const safetyTips = [
    {
      title: "Before You Meet",
      icon: "👋",
      tips: [
        "Always communicate through Seasoners messaging until you're comfortable",
        "Video chat before meeting in person to verify identity",
        "Google the person's name and check their social media profiles",
        "Ask for references from previous hosts, guests, or employers",
        "Trust your instincts - if something feels off, it probably is"
      ]
    },
    {
      title: "During Your Stay or Job",
      icon: "🏠",
      tips: [
        "Keep important documents and valuables secure",
        "Share your location with trusted friends or family",
        "Have an emergency exit plan and know local emergency numbers",
        "Keep copies of all agreements and communications",
        "Report any safety concerns immediately to support@seasoners.eu"
      ]
    },
    {
      title: "Protecting Your Privacy",
      icon: "",
      tips: [
        "Don't share your full address in your listing description",
        "Use Seasoners messaging instead of personal email or phone initially",
        "Be cautious about sharing personal financial information",
        "Set boundaries about what information you're comfortable sharing",
        "Review privacy settings in your account regularly"
      ]
    },
    {
      title: "Recognizing Scams",
      icon: "⚠️",
      tips: [
        "Never send money outside of official payment channels",
        "Be suspicious of deals that seem too good to be true",
        "Watch for requests to communicate off-platform immediately",
        "Verify accommodation or job existence through independent sources",
        "Report suspicious listings or users immediately"
      ]
    }
  ];

  const faqs = [
    {
      q: t('helpSafetyQ1') || "How does Seasoners verify users?",
      a: t('helpSafetyA1') || "We verify email addresses, phone numbers, and government-issued IDs. Verified badges appear on profiles. However, verification doesn't guarantee safety - always use your judgment and follow safety guidelines."
    },
    {
      q: t('helpSafetyQ2') || "What should I do if I feel unsafe?",
      a: t('helpSafetyA2') || "Your safety is paramount. Leave the situation immediately if you feel threatened. Contact local authorities if necessary. Then report the incident to support@seasoners.eu with details and evidence."
    },
    {
      q: t('helpSafetyQ3') || "How do I report a suspicious listing or user?",
      a: t('helpSafetyA3') || "Click the 'Report' button on any listing or profile. Select the reason for reporting and provide details. We investigate all reports within 24 hours and take appropriate action."
    },
    {
      q: t('helpSafetyQ4') || "What happens after I report someone?",
      a: t('helpSafetyA4') || "Our trust & safety team reviews the report. Depending on severity: warning, temporary suspension, or permanent ban. You'll be notified of the outcome. Serious cases may be reported to authorities."
    },
    {
      q: t('helpSafetyQ5') || "Can I block or hide users?",
      a: t('helpSafetyA5') || "Yes. Go to their profile and select 'Block User'. They won't be able to message you or see your listings. You won't see their listings either."
    },
    {
      q: t('helpSafetyQ6') || "What is Trust Score and how does it work?",
      a: t('helpSafetyA6') || "Trust Score (0-100) is calculated from: verification status, profile completeness, positive reviews, response rate, and account age. Higher scores indicate more trustworthy users."
    },
    {
      q: t('helpSafetyQ7') || "Are background checks performed?",
      a: t('helpSafetyA7') || "We verify IDs but don't perform full background checks. We recommend: meeting in public first, checking references, and doing your own research before committing."
    },
    {
      q: t('helpSafetyQ8') || "What should I include in a rental agreement?",
      a: t('helpSafetyA8') || "Include: names, addresses, dates, payment terms, house rules, deposit information, cancellation policy, and emergency contacts. Both parties should sign. We provide agreement templates in your dashboard."
    },
    {
      q: t('helpSafetyQ9') || "How do I handle payment disputes?",
      a: t('helpSafetyA9') || "For Stripe payments: contact support@seasoners.eu with documentation. For cash/direct payments: we can't intervene but can ban users who violate terms. Always use traceable payment methods."
    },
    {
      q: t('helpSafetyQ10') || "What if someone asks me to pay outside Seasoners?",
      a: t('helpSafetyA10') || "NEVER do this. This is a common scam and violates our Terms of Service. All transactions should go through official channels. Report users who request off-platform payments immediately."
    }
  ];

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <Navbar />
        
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t('helpSafetyTitle')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('helpSafetySubtitle')}
              </p>
            </motion.div>

            {/* Back Link */}
            <Link 
              href="/help"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
            >
              ← {t('helpBackToCenter')}
            </Link>

            {/* Safety Tips */}
            <div className="mb-12 space-y-6">
              {safetyTips.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{section.icon}</span>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-gray-600 flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Emergency Contacts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-red-50 rounded-lg p-6 mb-12"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🚨</span>
                {t('helpSafetyEmergency')}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="font-semibold">{t('helpSafetyEmergencyAustria')}</p>
                  <p>Police: 133</p>
                  <p>Ambulance: 144</p>
                  <p>Fire: 122</p>
                  <p>EU Emergency: 112</p>
                </div>
                <div>
                  <p className="font-semibold">{t('helpSafetyEmergencySeasoners')}</p>
                  <p>Email: safety@seasoners.eu</p>
                  <p>Response time: Within 2 hours</p>
                  <p className="text-sm mt-2 text-gray-600">
                    {t('helpSafetyEmergencyNote')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* FAQs */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('helpSafetyFAQs')}
            </h2>
            <div className="space-y-4 mb-12">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Report Issue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-orange-50 rounded-lg p-8 text-center"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('helpSafetyReportConcern')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('helpSafetyReportDesc')}
              </p>
              <a
                href="mailto:safety@seasoners.eu"
                className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
              >
                {t('helpSafetyReportButton')}
              </a>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedPage>
  );
}
