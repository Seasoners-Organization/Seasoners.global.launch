"use client";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AnimatedPage from "../../../components/AnimatedPage";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AccountHelp() {
  const faqs = [
    {
      q: "How do I reset my password?",
      a: "Click 'Forgot Password' on the sign-in page. Enter your email address and we'll send you a secure reset link. If you don't receive the email within 5 minutes, check your spam folder."
    },
    {
      q: "How do I update my profile information?",
      a: "Go to your Profile page and click 'Edit Profile'. You can update your name, bio, location, languages, and profile picture. Remember to click 'Save Changes' when you're done."
    },
    {
      q: "How do I verify my email address?",
      a: "After signing up, check your email for a verification link. Click the link to verify your email. If you didn't receive it, go to your profile and click 'Resend Verification Email'."
    },
    {
      q: "How do I verify my phone number?",
      a: "Go to your Profile → Settings → Phone Verification. Enter your phone number and click 'Send Code'. Enter the 6-digit code you receive via SMS to complete verification."
    },
    {
      q: "How do I get identity verified?",
      a: "Go to your Profile → Verification. Upload a clear photo of your government-issued ID (passport, driver's license, or national ID card). Our team reviews submissions within 24-48 hours."
    },
    {
      q: "Can I change my email address?",
      a: "Yes. Go to Settings → Account → Change Email. Enter your new email address and verify it by clicking the link we send to your new email. Your old email will remain active until the new one is verified."
    },
    {
      q: "How do I delete my account?",
      a: "Go to Settings → Account → Delete Account. You'll need to confirm the deletion and enter your password. Note: This action is permanent and cannot be undone. All your listings and messages will be deleted."
    },
    {
      q: "Why is my account suspended?",
      a: "Accounts may be suspended for violating our Terms of Service, such as posting fake listings, harassment, or fraudulent activity. If you believe this was a mistake, contact support@seasoners.eu with your account details."
    },
    {
      q: "How do I enable two-factor authentication?",
      a: "Go to Settings → Security → Two-Factor Authentication. Choose your preferred method (SMS or authenticator app) and follow the setup instructions. We highly recommend enabling this for added security."
    },
    {
      q: "Can I have multiple accounts?",
      a: "No. Each person is allowed one account only. Multiple accounts may result in suspension of all accounts. If you need to manage listings for a business, contact us about our business account options."
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
                Account Help
              </h1>
              <p className="text-xl text-gray-600">
                Manage your account, security, and verification
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

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 bg-blue-50 rounded-lg p-8 text-center"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Still need help?
              </h3>
              <p className="text-gray-600 mb-4">
                Our support team is here to assist you
              </p>
              <a
                href="mailto:support@seasoners.eu"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Contact Support
              </a>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedPage>
  );
}
