"use client";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AnimatedPage from "../../../components/AnimatedPage";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageProvider";

export default function PaymentHelp() {
  const { t } = useLanguage();
  const faqs = [
    {
      q: t('helpPaymentsQ1'),
      a: t('helpPaymentsA1')
    },
    {
      q: t('helpPaymentsQ2'),
      a: t('helpPaymentsA2')
    },
    {
      q: t('helpPaymentsQ3'),
      a: t('helpPaymentsA3')
    },
    {
      q: t('helpPaymentsQ4'),
      a: t('helpPaymentsA4')
    },
    {
      q: "Why was my payment declined?",
      a: "Common reasons: insufficient funds, expired card, incorrect billing address, or fraud prevention by your bank. Try a different card or contact your bank. If issues persist, contact support@seasoners.eu."
    },
    {
      q: "Can I switch between monthly and annual plans?",
      a: "Yes. Go to your Subscription settings and select 'Change Plan'. When switching from monthly to annual, you'll be charged the difference immediately. When switching from annual to monthly, the change takes effect at the end of your current billing period."
    },
    {
      q: "Do you offer discounts or promotions?",
      a: "We occasionally offer promotional discounts for annual subscriptions and early adopters. Sign up for our newsletter to be notified of special offers."
    },
    {
      q: t('helpPaymentsQ7') || "What happens if my payment fails?",
      a: t('helpPaymentsA7') || "We'll retry the payment up to 3 times over 7 days. You'll receive email notifications. If all retries fail, your subscription will be downgraded to the free tier and your listings may be hidden."
    },
    {
      q: t('helpPaymentsQ8') || "Is my payment information secure?",
      a: t('helpPaymentsA8') || "Yes. We use Stripe for payment processing, which is PCI-DSS Level 1 certified. We never store your full credit card details on our servers. All transactions are encrypted."
    },
    {
      q: t('helpPaymentsQ9') || "Can I pause my subscription?",
      a: t('helpPaymentsA9') || "We don't offer subscription pausing. You can cancel and resubscribe later, but you'll lose any remaining time on your current subscription period."
    },
    {
      q: t('helpPaymentsQ10') || "Do you offer invoices or receipts?",
      a: t('helpPaymentsA10') || "Yes. After each payment, you'll receive an email receipt. You can also download invoices from Profile → Settings → Subscription → Billing History."
    },
    {
      q: t('helpPaymentsQ11') || "What currency are payments processed in?",
      a: t('helpPaymentsA11') || "All prices are in Euros (EUR). If your card is in a different currency, your bank will convert it at their exchange rate and may charge a foreign transaction fee."
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
              <div className="text-6xl mb-4">💰</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t('helpPaymentsTitle')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('helpPaymentsSubtitle')}
              </p>
            </motion.div>

            {/* Back Link */}
            <Link 
              href="/help"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
            >
              ← {t('helpBackToCenter')}
            </Link>

            {/* FAQs */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
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

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 bg-green-50 rounded-lg p-8 text-center"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('helpPaymentsSecure')}
              </h3>
              <p className="text-gray-600">
                {t('helpPaymentsSecureDesc')}
              </p>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 bg-blue-50 rounded-lg p-8 text-center"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('helpPaymentsNotResolved')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('helpPaymentsContactBilling')}
              </p>
              <a
                href="mailto:support@seasoners.eu"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                {t('helpContactBillingSupport')}
              </a>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedPage>
  );
}
