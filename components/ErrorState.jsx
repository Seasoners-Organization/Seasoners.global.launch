"use client";
import { motion } from "framer-motion";

export default function ErrorState({ 
  title = "Something went wrong", 
  description = "We encountered an error while loading this content.",
  onRetry,
  showRetry = true
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-6 max-w-md">{description}</p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      )}
    </motion.div>
  );
}
