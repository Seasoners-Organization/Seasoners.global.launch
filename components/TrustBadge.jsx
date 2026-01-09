"use client";

export default function TrustBadge({ score = 0, size = 'sm', showLabel = false }) {
  // Determine level and color based on score
  let level, color, icon;
  
  if (score >= 80) {
    level = 'Exceptional';
    color = 'emerald';
    icon = '';
  } else if (score >= 60) {
    level = 'Trusted';
    color = 'sky';
    icon = '';
  } else if (score >= 30) {
    level = 'Establishing';
    color = 'amber';
    icon = '';
  } else {
    level = 'New';
    color = 'slate';
    icon = '';
  }

  const colorClasses = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    sky: 'bg-sky-50 border-sky-200 text-sky-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    slate: 'bg-slate-50 border-slate-200 text-slate-500',
  };

  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <div 
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${colorClasses[color]} ${sizeClasses[size]}`}
      title={`Trust Score: ${score}/100 - ${level}`}
    >
      <span>{icon}</span>
      <span>{score}</span>
      {showLabel && <span className="hidden sm:inline">{level}</span>}
    </div>
  );
}
