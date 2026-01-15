"use client";
import { motion } from "framer-motion";

export default function EmptyState({ 
  icon = "📭", 
  title = "No results yet", 
  description = "Try adjusting your search criteria or explore our featured listings.",
  actionLabel,
  actionHref,
  actionOnClick,
  showSecondaryAction = false,
  secondaryActionLabel,
  secondaryActionHref,
  secondaryActionOnClick
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center min-h-[400px] sm:min-h-auto"
    >
      <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 break-words">{title}</h3>
      <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 max-w-sm sm:max-w-md leading-relaxed">{description}</p>
      
      <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-3 justify-center">
        {(actionLabel && (actionHref || actionOnClick)) && (
          <a
            href={actionHref}
            onClick={actionOnClick}
            className="px-6 sm:px-8 py-3 sm:py-3 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-lg font-semibold transition shadow-md hover:shadow-lg active:scale-95 min-h-[44px] flex items-center justify-center touch-manipulation"
          >
            {actionLabel}
          </a>
        )}
        
        {showSecondaryAction && (secondaryActionLabel && (secondaryActionHref || secondaryActionOnClick)) && (
          <a
            href={secondaryActionHref}
            onClick={secondaryActionOnClick}
            className="px-6 sm:px-8 py-3 sm:py-3 border-2 border-sky-600 text-sky-600 hover:bg-sky-50 rounded-lg font-semibold transition active:scale-95 min-h-[44px] flex items-center justify-center touch-manipulation"
          >
            {secondaryActionLabel}
          </a>
        )}
      </div>
    </motion.div>
  );
}
