"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroWithCTA() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-sky-700 text-white py-20"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
        >
          Ready to Start Your Seasonal Adventure?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-sky-100 mb-8 max-w-2xl mx-auto"
        >
          Join thousands of seasonal workers and hosts who are already using Seasoners. 
          Verified, safe, and transparent.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-white text-sky-600 rounded-lg font-bold hover:bg-sky-50 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Free →
          </Link>
          <Link
            href="/about"
            className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors"
          >
            Learn More About Us
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-wrap gap-4 justify-center items-center text-sm text-sky-100"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>Verified Users</span>
          </div>
          <span className="text-sky-400">•</span>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span>Safe & Secure</span>
          </div>
          <span className="text-sky-400">•</span>
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <span>Protected Agreements</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
