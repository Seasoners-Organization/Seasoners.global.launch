export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 animate-pulse">
      <div className="h-48 bg-slate-200 rounded-lg mb-4"></div>
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-slate-200 rounded-full w-20"></div>
        <div className="h-6 bg-slate-200 rounded-full w-20"></div>
      </div>
      <div className="h-10 bg-slate-200 rounded-lg"></div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
