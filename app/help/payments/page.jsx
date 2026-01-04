"use client";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AnimatedPage from "../../../components/AnimatedPage";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentHelp() {
  const faqs = [
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit and debit cards (Visa, Mastercard, American Express), as well as various local payment methods through Stripe. All payments are processed securely."
    },
    {
      q: "When will I be charged for my subscription?",
      a: "You'll be charged after your 90-day free trial ends. If you subscribe monthly, you'll be charged on the same day each month. Annual subscriptions are charged once per year."
    },
    {
      q: "Can I get a refund?",
      a: "Subscriptions can be cancelled anytime during your 90-day free trial at no cost. After the trial, subscriptions are non-refundable for the current billing period, but you can cancel to prevent future charges."
    },
    {
      q: "How do I update my payment method?",
      a: "Go to Profile → Settings → Subscription → Update Payment Method. Enter your new card details. Your next payment will use the updated method."
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
      q: "What happens if my payment fails?",
      a: "We'll retry the payment up to 3 times over 7 days. You'll receive email notifications. If all retries fail, your subscription will be downgraded to the free tier and your listings may be hidden."
    },
    {
      q: "Is my payment information secure?",
      a: "Yes. We use Stripe for payment processing, which is PCI-DSS Level 1 certified. We never store your full credit card details on our servers. All transactions are encrypted."
    },
    {
      q: "Can I pause my subscription?",
      a: "We don't offer subscription pausing. You can cancel and resubscribe later, but you'll lose any remaining time on your current subscription period."
    },
    {
      q: "Do you offer invoices or receipts?",
      a: "Yes. After each payment, you'll receive an email receipt. You can also download invoices from Profile → Settings → Subscription → Billing History."
    },
    {
      q: "What currency are payments processed in?",
      a: "All prices are in Euros (EUR). If your card is in a different currency, your bank will convert it at their exchange rate and may charge a foreign transaction fee."
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
                Payment Support
              </h1>
              <p className="text-xl text-gray-600">
                Billing, subscriptions, and payment issues
              </p>
            </motion.div>

            {/* Back Link */}
            <Link 
              href="/help"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
            >
              ← Back to Help Center
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
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Payment Processing
              </h3>
              <p className="text-gray-600">
                All payments are processed securely through Stripe. We never store your complete credit card information.
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
                Payment issue not resolved?
              </h3>
              <p className="text-gray-600 mb-4">
                Contact our billing team for personalized assistance
              </p>
              <a
                href="mailto:support@seasoners.eu"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Contact Billing Support
              </a>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedPage>
  );
}
