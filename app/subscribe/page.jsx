"use client";
import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import EarlyBirdModal from "../../components/EarlyBirdModal";
import { motion } from "framer-motion";
import { SUBSCRIPTION_PLANS } from "../../utils/subscription";
import { useLanguage } from "../../components/LanguageProvider";

function SubscribeContent() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [selectedTier, setSelectedTier] = useState(searchParams.get("tier") || "SEARCHER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const returnTo = searchParams.get("returnTo") || "/";
  const isEarlyBird = searchParams.get("promo") === "EARLYBIRD3";

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = `/auth/signin?returnTo=/subscribe?tier=${selectedTier}&returnTo=${returnTo}`;
    }
  }, [status, selectedTier, returnTo]);


  // Use static Stripe Payment Links
  const paymentLinks = {
    SEARCHER: isEarlyBird 
      ? process.env.NEXT_PUBLIC_STRIPE_EARLYBIRD_SEARCHER_LINK || "https://buy.stripe.com/fZudR17aPeAR5xU7my63K01"
      : "https://buy.stripe.com/fZudR17aPeAR5xU7my63K01",
    LISTER: isEarlyBird
      ? process.env.NEXT_PUBLIC_STRIPE_EARLYBIRD_LISTER_LINK || "https://buy.stripe.com/dRm4grdzd0K17G2dKW63K00"
      : "https://buy.stripe.com/dRm4grdzd0K17G2dKW63K00"
  };

  const handleSubscribe = (tier) => {
    window.location.href = paymentLinks[tier];
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

  const plans = [
    { ...SUBSCRIPTION_PLANS.SEARCHER, tier: "SEARCHER" },
    { ...SUBSCRIPTION_PLANS.LISTER, tier: "LISTER" },
  ];

  return (
    <main>
      <Navbar />
      <EarlyBirdModal trigger="payment" />
      <AnimatedPage>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isEarlyBird && (
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white py-3 px-6 rounded-xl text-center mb-6 max-w-3xl mx-auto">
                <p className="font-bold text-lg">
                  Early Bird Special: 3 Months FREE! Card required; no charges today.
                </p>
              </div>
            )}
            
            <h1 className="text-4xl font-bold text-center text-sky-900 mb-4">
              {isEarlyBird ? "Claim Your 3 Months Free" : t('chooseYourPlan')}
            </h1>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              {isEarlyBird 
                ? "Lock in your early bird discount. Full access for 3 months, then continue at regular price or cancel anytime." 
                : t('subscribeSubtitle')}
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                <p className="text-red-600 text-center">{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <motion.div
                  key={plan.tier}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white rounded-2xl shadow-lg p-8 border-2 ${
                    selectedTier === plan.tier
                      ? "border-sky-500"
                      : "border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h2>
                    {isEarlyBird && (
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
                        3 MONTHS FREE
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline mb-6 gap-3">
                    {isEarlyBird ? (
                      <>
                        <span className="text-5xl font-extrabold text-sky-600">
                          €0
                        </span>
                        <span className="text-gray-600">for 3 months</span>
                        <span className="text-sm text-gray-500 ml-2">
                          then €{plan.price}/mo
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-gray-400 line-through">
                          €{plan.price}
                        </span>
                        <span className="text-5xl font-extrabold text-green-600">
                          €0
                        </span>
                        <span className="text-gray-600 ml-2">{t('perMonth')}</span>
                      </>
                    )}
                  </div>
                  {!isEarlyBird && (
                    <div className="mb-4">
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        90-day free trial
                      </span>
                    </div>
                  )}

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
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
                    onClick={() => handleSubscribe(plan.tier)}
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.tier === "LISTER"
                        ? "bg-gradient-to-r from-sky-600 to-amber-600 hover:from-sky-700 hover:to-amber-700 text-white"
                        : "bg-sky-600 hover:bg-sky-700 text-white"
                    }`}
                  >
                    {loading ? t('processing') : (isEarlyBird ? "Start 3-Month Free Trial" : plan.cta)}
                  </button>
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    {isEarlyBird 
                      ? "Card required to start; no charges for 3 months. Cancel anytime before trial ends." 
                      : "Card required to start; no charges until day 91. We will notify you before the first payment."}
                    {" "}<a href="/subscribe/terms" className="text-sky-600 underline">Subscription Terms</a>
                  </div>

                  {plan.tier === "LISTER" && (
                    <div className="mt-4 text-center">
                      <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {t('mostPopular')}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500">
                {t('trialInfo')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {t('needHelp')} <a href="/about" className="text-sky-600 hover:underline">{t('contactUs')}</a>
              </p>
            </div>
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />
    </main>
  );
}

export default function SubscribePage() {
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
      <SubscribeContent />
    </Suspense>
  );
}
