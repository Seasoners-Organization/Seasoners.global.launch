"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CommunityPage() {
  const features = [
    {
      icon: "",
      title: "Community Discussions",
      description: "Share experiences, ask questions, and connect with seasonal workers worldwide"
    },
    {
      icon: "",
      title: "Destination Guides",
      description: "Crowdsourced tips and recommendations for every zone we operate in"
    },
    {
      icon: "",
      title: "Success Stories",
      description: "Read inspiring stories from members who've built amazing seasonal careers"
    },
    {
      icon: "",
      title: "Peer Support",
      description: "Get advice from experienced seasonal workers in your industry"
    },
    {
      icon: "",
      title: "Verified Badges",
      description: "See trusted community members and verified hosts sharing insights"
    },
    {
      icon: "",
      title: "Global Network",
      description: "Connect with seasonal workers across 12+ countries and counting"
    }
  ];

  return (
    <main>
      <Navbar />
      <AnimatedPage>
        <section className="max-w-6xl mx-auto px-6 py-20">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Community Forum
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-6">
              Connect with thousands of seasonal workers, share experiences, and build lasting relationships
            </p>
            <div className="inline-block px-6 py-3 bg-amber-100 text-amber-900 rounded-lg font-semibold">
              Coming Soon
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Waitlist Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border-2 border-sky-200 p-12 text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Be the first to join
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8">
              The community forum is launching soon. Join our waitlist to get early access and help shape the future of seasonal worker connections.
            </p>
            <Link
              href="/waitlist"
              className="inline-block px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all"
            >
              Join Waitlist →
            </Link>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              In the meantime, connect with members
            </h2>
            <p className="text-slate-600 mb-6">
              Start building relationships through direct messaging and collaborative listings
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/stays"
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
              >
                Browse Opportunities →
              </Link>
              <Link
                href="/messages"
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Start Messaging
              </Link>
            </div>
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />
    </main>
  );
}
