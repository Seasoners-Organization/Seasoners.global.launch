"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";
import { useLanguage } from "../../components/LanguageProvider";
import { useState } from "react";
import Link from "next/link";

export default function FAQ() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqCategories = [
    {
      category: t('faqGettingStarted') || "Getting Started",
      icon: "🚀",
      questions: [
        {
          q: t('faqQ1') || "How do I create an account?",
          a: t('faqA1') || "Click 'Sign Up' in the top right corner and follow the simple registration process. You can sign up using your email or Google account."
        },
        {
          q: t('faqQ2') || "Is Seasoners free to use?",
          a: t('faqA2') || "YES! Browsing is completely free. You get 10 free messages per month. Plus members (€9.90/month) get unlimited messaging and priority support. Cancel anytime."
        },
        {
          q: t('faqQ3') || "What countries does Seasoners operate in?",
          a: t('faqA3') || "We're currently focused on Austria with plans to expand globally. You can find opportunities in major Austrian cities and ski resorts."
        },
        {
          q: t('faqQ4') || "How do I verify my account?",
          a: t('faqA4') || "Complete your profile with accurate information and upload a government-issued ID. Our team reviews verification requests within 24-48 hours."
        }
      ]
    },
    {
      category: t('faqListingsSearch') || "Listings & Search",
      icon: "🏠",
      questions: [
        {
          q: t('faqQ5') || "How do I create a listing?",
          a: t('faqA5') || "Go to your profile, click 'Create Listing', and fill in the details. All users can create listings for free! Make sure to include clear photos and detailed descriptions."
        },
        {
          q: t('faqQ6') || "How do I search for opportunities?",
          a: t('faqA6') || "Use the search filters on the Jobs or Stays pages. You can filter by location, dates, price range, and specific amenities or job types."
        },
        {
          q: t('faqQ7') || "Can I save listings for later?",
          a: t('faqA7') || "Yes! Click the heart icon on any listing to save it to your favorites. Access saved listings from your profile."
        },
        {
          q: t('faqQ8') || "Can I boost my listing?",
          a: t('faqA8') || "Yes! Boost your listing to appear at the top for 7 days (€9.90) or 30 days (€29.90). Great for getting more visibility!"
        }
      ]
    },
    {
      category: t('faqAccountsVerification') || "Accounts & Verification",
      icon: "✅",
      questions: [
        {
          q: t('faqQ9') || "Why should I verify my account?",
          a: t('faqA9') || "Verified accounts build trust, get priority in search results, and unlock additional features. It helps create a safer community for everyone."
        },
        {
          q: t('faqQ10') || "What documents are needed for verification?",
          a: t('faqA10') || "A valid government-issued ID (passport, driver's license, or national ID card). We never share your documents and use them only for verification."
        },
        {
          q: t('faqQ11') || "How long does verification take?",
          a: t('faqA11') || "Most verifications are completed within 24-48 hours. You'll receive an email notification once approved."
        },
        {
          q: t('faqQ12') || "Can I change my email address?",
          a: t('faqA12') || "Yes, go to Profile Settings > Account > Email. You'll need to verify your new email address."
        }
      ]
    },
    {
      category: t('faqPaymentsSubscriptions') || "Payments & Subscriptions",
      icon: "💳",
      questions: [
        {
          q: t('faqQ13') || "What payment methods do you accept?",
          a: t('faqA13') || "We accept all major credit/debit cards (Visa, Mastercard, Amex) and SEPA payments through our secure payment processor Stripe."
        },
        {
          q: t('faqQ14') || "How much does Plus cost?",
          a: t('faqA14') || "Plus costs just €9.90/month and includes unlimited messaging, unlimited saved searches, and instant email alerts. Cancel anytime."
        },
        {
          q: t('faqQ15') || "Is there a free trial?",
          a: t('faqA15') || "Start with our FREE tier (10 messages/month, all basic features). Upgrade to Plus anytime to unlock unlimited messaging."
        },
        {
          q: t('faqQ16') || "Can I cancel anytime?",
          a: t('faqA16') || "Yes! Cancel your Plus subscription anytime from your account settings. No hidden fees, no long-term commitment."
        },
        {
          q: t('faqQ17') || "Can I cancel anytime?",
          a: t('faqA17') || "Yes! Cancel your Plus subscription anytime from your account settings. No hidden fees, no long-term commitment."
        }
      ]
    },
    {
      category: t('faqTrustSafety') || "Trust & Safety",
      icon: "🛡️",
      questions: [
        {
          q: t('faqQ18') || "How does Seasoners ensure safety?",
          a: t('faqA18') || "We use Trust Scores, verification badges, community reviews, and agreements. Report any suspicious behavior immediately to support@seasoners.eu."
        },
        {
          q: t('faqQ19') || "What is a Trust Score?",
          a: t('faqA19') || "Trust Scores (0-100) measure reliability based on verification, reviews, responsiveness, and community standing. Higher scores indicate more trustworthy users."
        },
        {
          q: t('faqQ20') || "How do I report inappropriate content?",
          a: t('faqA20') || "Click the flag icon on any listing or profile, or email support@seasoners.eu with details. We investigate all reports within 24 hours."
        },
        {
          q: t('faqQ21') || "What are Zone Agreements?",
          a: t('faqA21') || "Digital agreements between hosts and guests that outline expectations, responsibilities, and terms. Both parties sign before booking."
        }
      ]
    },
    {
      category: "Communication",
      icon: "💬",
      questions: [
        {
          q: "How do I contact a host or employer?",
          a: "Click 'Contact' on any listing to send a message. Both parties will receive email notifications. Keep all communication on Seasoners for safety."
        },
        {
          q: "Why keep communication on the platform?",
          a: "It protects both parties, provides a record of agreements, and helps us assist if issues arise. Moving off-platform violates our terms."
        },
        {
          q: "Can I share my phone number?",
          a: "Yes, but only after initial contact through the platform. We recommend waiting until after booking confirmation."
        },
        {
          q: "I'm not receiving email notifications",
          a: "Check your spam folder and ensure notifications are enabled in Profile Settings > Notifications. Add noreply@seasoners.eu to your contacts."
        }
      ]
    }
  ];

  const quickLinks = [
    { title: "Account Help", href: "/help/account", icon: "" },
    { title: "Listing Issues", href: "/help/listings", icon: "" },
    { title: "Payment Support", href: "/help/payments", icon: "" },
    { title: "Safety Resources", href: "/help/safety", icon: "" },
    { title: "Contact Support", href: "/contact", icon: "" }
  ];

  const filteredCategories = searchQuery
    ? faqCategories.map(cat => ({
        ...cat,
        questions: cat.questions.filter(
          q =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.questions.length > 0)
    : faqCategories;

  return (
    <main>
      <Navbar />
      <AnimatedPage>
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-6 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-extrabold text-sky-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Search our knowledge base or browse categories below
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-12 text-lg border-2 border-sky-200 rounded-2xl focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all"
                />
                <svg
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              {quickLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="p-4 bg-white rounded-xl border-2 border-slate-100 hover:border-sky-300 hover:shadow-lg transition-all group"
                >
                  <div className="text-3xl mb-2">{link.icon}</div>
                  <div className="text-sm font-semibold text-slate-700 group-hover:text-sky-600">
                    {link.title}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FAQ Categories */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="space-y-8">
            {filteredCategories.map((category, catIdx) => (
              <motion.div
                key={catIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-sky-900 flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    {category.category}
                  </h2>
                </div>

                <div className="divide-y divide-slate-100">
                  {category.questions.map((faq, faqIdx) => {
                    const faqId = `${catIdx}-${faqIdx}`;
                    const isExpanded = expandedFaq === faqId;

                    return (
                      <div key={faqIdx} className="px-6">
                        <button
                          onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                          className="w-full py-5 flex items-start justify-between gap-4 text-left group"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">
                              {faq.q}
                            </h3>
                          </div>
                          <svg
                            className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pb-5"
                          >
                            <p className="text-slate-600 leading-relaxed pl-1">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Still Need Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-8 text-center text-white shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-3">Still need help?</h2>
            <p className="text-sky-100 mb-6 text-lg">
              Our support team is here to help you with any questions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-3 bg-white text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition-colors shadow-lg"
              >
                📧 Contact Us
              </a>
              <Link
                href="/community"
                className="px-8 py-3 bg-sky-400 text-white rounded-xl font-semibold hover:bg-sky-300 transition-colors"
              >
                💬 Community Forum
              </Link>
            </div>
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />
    </main>
  );
}
