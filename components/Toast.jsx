"use client";
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (message && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-sky-600',
    warning: 'bg-amber-600'
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3`}>
            <span className="text-xl font-bold">{icons[type]}</span>
            <p className="text-sm font-medium">{message}</p>
            <button
              onClick={onClose}
              className="ml-auto text-white hover:text-gray-200 transition"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
