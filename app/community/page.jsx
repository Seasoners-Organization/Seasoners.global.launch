"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CommunityPage() {
  const features = [
    {
      icon: "💬",
      title: "Community Discussions",
      description: "Share experiences, ask questions, and connect with seasonal workers worldwide"
    },
    {
      icon: "📍",
      title: "Destination Guides",
      description: "Crowdsourced tips and recommendations for every zone we operate in"
    },
    {
      icon: "⭐",
      title: "Success Stories",
      description: "Read inspiring stories from members who've built amazing seasonal careers"
    },
    {
      icon: "🤝",
      title: "Peer Support",
      description: "Get advice from experienced seasonal workers in your industry"
    },
    {
      icon: "🎯",
      title: "Verified Badges",
      description: "See trusted community members and verified hosts sharing insights"
    },
    {
      icon: "🌍",
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
              🚀 Coming Soon
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
                <div className="text-4xl mb-3">{feature.icon}</div>
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

          {/* Timeline Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl border border-slate-200 p-8 mb-16"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
              Development Timeline
            </h2>
            <div className="space-y-6">
              {[
                { phase: "Phase 1", date: "December 2025", status: "In Progress", items: ["Core forum infrastructure", "Discussion threads", "Category system"] },
                { phase: "Phase 2", date: "January 2026", status: "Planned", items: ["Verified member badges", "Reputation system", "Search & discovery"] },
                { phase: "Phase 3", date: "February 2026", status: "Planned", items: ["Community moderation tools", "Member profiles", "Integration with messaging"] }
              ].map((phase, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-sky-100 border-2 border-sky-600 flex items-center justify-center font-bold text-sky-600">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{phase.phase}</h3>
                      <span className="text-sm text-slate-600">{phase.date}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        phase.status === 'In Progress' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {phase.status}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {phase.items.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600">✓ {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
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
