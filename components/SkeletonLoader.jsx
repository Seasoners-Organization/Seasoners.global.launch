"use client";

export function ListingSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-slate-200" />
      
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        
        {/* Location */}
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        
        {/* Price */}
        <div className="h-5 bg-slate-200 rounded w-1/3" />
        
        {/* Description lines */}
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-slate-200 rounded" />
          <div className="h-3 bg-slate-200 rounded w-5/6" />
        </div>
        
        {/* Button */}
        <div className="h-10 bg-slate-200 rounded mt-4" />
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 6 }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ListingSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-1/4" />
        </div>
      </div>
      
      {/* Content rows */}
      <div className="space-y-4">
        <div className="h-4 bg-slate-200 rounded" />
        <div className="h-4 bg-slate-200 rounded w-5/6" />
        <div className="h-4 bg-slate-200 rounded w-4/6" />
      </div>
    </div>
  );
}

export function TrustScoreSkeleton() {
  return (
    <div className="bg-white rounded-2xl border p-6 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
      <div className="h-12 bg-slate-200 rounded mb-4" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
      </div>
    </div>
  );
}
