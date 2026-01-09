"use client";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AnimatedPage from "../../../components/AnimatedPage";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ListingHelp() {
  const faqs = [
    {
      q: "Why was my listing rejected?",
      a: "Listings may be rejected for: incomplete information, inappropriate content, fake photos, discriminatory language, or violating our Terms of Service. Check your email for specific feedback from our moderation team."
    },
    {
      q: "How do I edit my listing?",
      a: "Go to your Profile → My Listings. Click on the listing you want to edit, then click 'Edit'. Make your changes and click 'Save'. Changes are reviewed before going live."
    },
    {
      q: "How do I delete my listing?",
      a: "Go to your Profile → My Listings. Click on the listing and select 'Delete'. Confirm the deletion. Note: Active bookings or applications will be cancelled, so contact any interested parties first."
    },
    {
      q: "Why isn't my listing showing up in search?",
      a: "Possible reasons: listing is still under review, your account isn't verified, listing expired, or it doesn't match common search filters. Make sure all required fields are completed and your account is verified."
    },
    {
      q: "How do I add more photos to my listing?",
      a: "Edit your listing and click 'Add Photos'. You can upload up to 10 photos. Use high-quality images that accurately represent your property or job. First photo will be the main thumbnail."
    },
    {
      q: "Can I have multiple listings?",
      a: "Free accounts: 1 active listing. Searcher plan: 3 listings. Lister plan: unlimited listings. Upgrade your subscription to post more listings."
    },
    {
      q: "How long do listings stay active?",
      a: "Listings remain active until you delete them or your subscription expires. We recommend updating your listings regularly to keep them fresh in search results."
    },
    {
      q: "How do I mark my listing as no longer available?",
      a: "Edit your listing and change the status to 'Unavailable' or 'Filled'. This removes it from search but keeps it in your profile for future reactivation."
    },
    {
      q: "What makes a good listing?",
      a: "Include: clear photos, detailed description, accurate location, fair pricing, availability dates, required qualifications (for jobs), house rules (for stays), and quick response to inquiries."
    },
    {
      q: "Can I promote my listing to appear higher in search?",
      a: "Featured listings (coming soon) will appear at the top of search results. Currently, listings are ranked by: recency, completeness, trust score, and relevance to search terms."
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
                Listing Issues
              </h1>
              <p className="text-xl text-gray-600">
                Create, manage, and optimize your listings
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

            {/* Tips Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 bg-green-50 rounded-lg p-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                💡 Pro Tips for Great Listings
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Use natural lighting for photos</li>
                <li>• Be specific about dates and requirements</li>
                <li>• Respond to inquiries within 24 hours</li>
                <li>• Update your listing regularly to boost visibility</li>
                <li>• Be honest about limitations and expectations</li>
              </ul>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 bg-blue-50 rounded-lg p-8 text-center"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Need more help with your listing?
              </h3>
              <p className="text-gray-600 mb-4">
                Our team can review your listing and provide personalized feedback
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
