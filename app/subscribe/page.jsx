"use client";
import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";
import { SUBSCRIPTION_PLANS, BOOST_PLANS } from "../../utils/subscription";
import { useLanguage } from "../../components/LanguageProvider";

function PricingContent() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    if (status === "unauthenticated") {
      window.location.href = `/auth/signin?returnTo=/subscribe`;
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/subscription/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: "PLUS",
          returnUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      setError("Failed to start upgrade process. Please try again.");
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-600">{t('loading')}</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <AnimatedPage>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-center text-sky-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
              Start for free. Upgrade only when you need unlimited messages. Listings are always free.
            </p>

            {/* Important Disclaimer */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 mb-12 max-w-4xl mx-auto">
              <p className="text-sm text-sky-900 text-center">
                <strong>Important:</strong> Seasoners does not process rent or wage payments. 
                All agreements and transactions are made directly between parties. 
                We provide the platform for connection only.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                <p className="text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* FREE PLAN */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center text-sky-900 mb-8">
                For Everyone
              </h2>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-8 border-2 border-slate-200 max-w-2xl mx-auto"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {SUBSCRIPTION_PLANS.FREE.name}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                    No card required
                  </span>
                </div>
                
                <div className="flex items-baseline mb-6 gap-2">
                  <span className="text-5xl font-extrabold text-sky-600">€0</span>
                  <span className="text-gray-600">/forever</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {SUBSCRIPTION_PLANS.FREE.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => window.location.href = status === "unauthenticated" ? "/auth/register" : "/stays"}
                  className="w-full py-3 px-6 rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                >
                  {status === "unauthenticated" ? "Get Started Free" : "Browse Listings"}
                </button>
              </motion.div>
            </div>

            {/* PLUS PLAN */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center text-sky-900 mb-8">
                For Active Searchers
              </h2>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-sky-50 to-white rounded-2xl shadow-xl p-8 border-2 border-sky-500 max-w-2xl mx-auto relative"
              >
                <div className="absolute top-0 right-0 bg-gradient-to-r from-sky-600 to-sky-700 text-white text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-xl">
                  MOST POPULAR
                </div>
                
                <div className="flex justify-between items-start mb-4 mt-4">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {SUBSCRIPTION_PLANS.PLUS.name}
                  </h3>
                </div>
                
                <div className="flex items-baseline mb-6 gap-2">
                  <span className="text-5xl font-extrabold text-sky-600">
                    €{SUBSCRIPTION_PLANS.PLUS.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>

                <p className="text-sm text-slate-600 mb-6">
                  7-day free trial. Cancel anytime.
                </p>

                <ul className="space-y-3 mb-8">
                  {SUBSCRIPTION_PLANS.PLUS.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-sky-600 mr-3 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : SUBSCRIPTION_PLANS.PLUS.cta}
                </button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  No commitment. Cancel anytime before trial ends.
                </p>
              </motion.div>
            </div>

            {/* BOOSTS FOR LISTERS */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center text-sky-900 mb-4">
                Optional Boosts for Hosts & Employers
              </h2>
              <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
                Listings and job posts are <strong>completely free</strong>. 
                Boost your visibility with optional featured placement.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {Object.values(BOOST_PLANS).map((boost, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {boost.name}
                    </h3>
                    
                    <div className="flex items-baseline mb-4 gap-2">
                      <span className="text-4xl font-extrabold text-amber-600">
                        €{boost.price}
                      </span>
                      <span className="text-gray-600">one-time</span>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {boost.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <svg
                            className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="text-xs text-gray-500 text-center">
                      Available when creating or editing your listing
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-sky-900 mb-8">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                <details className="bg-white rounded-lg shadow p-6 border">
                  <summary className="font-semibold text-gray-900 cursor-pointer">
                    Do I need to pay to create listings?
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm">
                    No! Creating stays and job listings is completely free. You only pay if you want to boost visibility with featured placement.
                  </p>
                </details>

                <details className="bg-white rounded-lg shadow p-6 border">
                  <summary className="font-semibold text-gray-900 cursor-pointer">
                    What happens when I reach 10 messages on the free plan?
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm">
                    You'll see a prompt to upgrade to Searcher Plus. Your existing conversations remain accessible, but you won't be able to start new conversations until next month or until you upgrade.
                  </p>
                </details>

                <details className="bg-white rounded-lg shadow p-6 border">
                  <summary className="font-semibold text-gray-900 cursor-pointer">
                    Can I cancel my Plus subscription anytime?
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm">
                    Yes! Cancel anytime. You'll retain Plus benefits until the end of your billing period, then revert to the free plan with its 10 messages/month limit.
                  </p>
                </details>

                <details className="bg-white rounded-lg shadow p-6 border">
                  <summary className="font-semibold text-gray-900 cursor-pointer">
                    Does Seasoners handle rent or wage payments?
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm">
                    No. Seasoners only facilitates connections. All rent payments, employment contracts, and wages are handled directly between tenants/hosts and employers/employees.
                  </p>
                </details>

                <details className="bg-white rounded-lg shadow p-6 border">
                  <summary className="font-semibold text-gray-900 cursor-pointer">
                    How do boosts work?
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm">
                    When you boost a listing, it appears at the top of search results for the duration you choose (7 or 30 days). This significantly increases visibility and applicant inquiries.
                  </p>
                </details>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500">
                Need help choosing? <a href="/contact" className="text-sky-600 hover:underline">Contact us</a>
              </p>
            </div>
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />
    </main>
  );
}

export default function PricingPage() {
  const { t } = useLanguage();
  
  return (
    <Suspense fallback={
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-600">{t('loading')}</p>
        </div>
        <Footer />
      </main>
    }>
      <PricingContent />
    </Suspense>
  );
}
