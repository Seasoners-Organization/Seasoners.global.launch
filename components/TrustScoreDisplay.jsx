"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TrustScoreDisplay({ userId }) {
  const [trustData, setTrustData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchTrustScore();
  }, []);

  const fetchTrustScore = async () => {
    try {
      const res = await fetch('/api/user/trust-score');
      if (res.ok) {
        const data = await res.json();
        setTrustData(data);
      }
    } catch (error) {
      console.error('Failed to fetch trust score:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-6 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (!trustData) {
    return null;
  }

  const { score, level, factors, suggestions } = trustData;
  const colorClasses = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    sky: 'bg-sky-50 border-sky-200 text-sky-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    slate: 'bg-slate-50 border-slate-200 text-slate-600',
  };

  return (
    <div className="bg-white rounded-2xl border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Trust Score</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-sky-600 hover:text-sky-700 font-medium"
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </button>
      </div>

      {/* Score Display */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={level.color === 'emerald' ? '#10b981' : 
                      level.color === 'sky' ? '#0ea5e9' : 
                      level.color === 'amber' ? '#f59e0b' : '#94a3b8'}
              strokeWidth="8"
              strokeDasharray={`${(score / 100) * 251.2} 251.2`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">{score}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${colorClasses[level.color]} text-sm font-medium mb-1`}>
            <span>{level.icon}</span>
            <span>{level.name}</span>
          </div>
          <p className="text-sm text-slate-600">{level.description}</p>
        </div>
      </div>

      {/* Details Panel */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t pt-4 mt-4"
        >
          {/* Trust Factors */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Trust Factors</h4>
            <div className="space-y-2">
              {Object.entries(factors).map(([key, factor]) => {
                const f = factor;
                const percentage = f.earned ? (f.earned / f.max) * 100 : 0;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-xs font-medium text-slate-700">
                          {f.earned}/{f.max}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-sky-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suggestions */}
          {suggestions && suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Improve Your Score</h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-sm p-2 rounded bg-sky-50 border border-sky-100"
                  >
                    <span className="text-sky-600 mt-0.5">+{suggestion.impact}</span>
                    <span className="flex-1 text-slate-700">{suggestion.action}</span>
                    {suggestion.link && (
                      <a
                        href={suggestion.link}
                        className="text-sky-600 hover:text-sky-700 font-medium text-xs"
                      >
                        Go →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
