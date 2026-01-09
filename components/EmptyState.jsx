"use client";
import { motion } from "framer-motion";

export default function EmptyState({ 
  icon = "📭", 
  title = "No results yet", 
  description = "Try adjusting your search criteria or explore our featured listings.",
  actionLabel,
  actionHref,
  actionOnClick
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-6 max-w-md">{description}</p>
      
      {(actionLabel && (actionHref || actionOnClick)) && (
        <a
          href={actionHref}
          onClick={actionOnClick}
          className="px-6 py-3 bg-gradient-to-r from-sky-600 to-amber-600 hover:from-sky-700 hover:to-amber-700 text-white rounded-lg font-medium transition"
        >
          {actionLabel}
        </a>
      )}
    </motion.div>
  );
}
