"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RoommateIndicator from '../../components/RoommateIndicator';
import { useLanguage } from '../../components/LanguageProvider';
import FilterSidebar from '../../components/FilterSidebar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ListingGridSkeleton } from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';

export default function FlatsharesPage() {
  const { t } = useLanguage();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hydrated, setHydrated] = useState(false);

  // Legacy regions removed; FilterSidebar now controls filters end-to-end

  useEffect(() => {
    fetchListings();
  }, []);

  // mark hydrated once mounted (FilterSidebar reads URL and syncs itself)
  useEffect(() => { setHydrated(true); }, []);

  // URL sync handled entirely by FilterSidebar

  async function fetchListings() {
    setLoading(true);
    try {
      const res = await fetch('/api/listings?type=FLATSHARE');
      if (res.ok) {
        const data = await res.json();
        setListings(Array.isArray(data.listings) ? data.listings : []);
      }
    } catch (error) {
      console.error('Failed to fetch flatshares:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  // filtered list is provided by FilterSidebar via setFiltered

  // FilterSidebar provides full filtering
  useEffect(() => {
    setFiltered(listings);
  }, [listings]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              🏠 Flatshares
            </h1>
            <p className="text-lg text-slate-600">
              Find your next shared apartment with compatible roommates
            </p>
          </div>

          {/* Filters Sidebar + Results */}
          <div className="grid lg:grid-cols-[260px_1fr] gap-8 mb-6">
            <FilterSidebar context="flatshares" listings={listings} onFiltered={setFiltered} />
            <div>
              {loading ? (
                <ListingGridSkeleton count={6} />
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon="🏠"
                  title="No flatshares found"
                  description="Try adjusting your filters or be the first to list a flatshare."
                  actionLabel="List Your Flatshare"
                  actionHref="/list"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map(listing => (
                    <div
                      key={listing.id}
                      className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Photo Cover */}
                      {listing.photos && listing.photos.length > 0 && (
                        <Link href={`/listings/${listing.id}`} className="block">
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <img 
                              src={listing.photos[0]} 
                              alt={listing.title}
                              loading="lazy"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            {listing.photos.length > 1 && (
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                📷 {listing.photos.length}
                              </div>
                            )}
                          </div>
                        </Link>
                      )}
                      <div className="p-5 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          {listing.user?.profilePicture ? (
                            <img 
                              src={listing.user.profilePicture} 
                              alt={listing.user.name}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-sky-400 to-amber-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                              {listing.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{listing.user?.name || 'Anonymous'}</p>
                            {listing.user?.trustScore !== undefined && (
                              <div className="mt-1">
                                <span className="text-xs text-amber-600 font-medium">
                                  ⭐ {listing.user.trustScore.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link href={`/listings/${listing.id}`} className="block p-5">
                        <h3 className="font-semibold text-lg text-slate-900 hover:text-sky-700 transition-colors mb-2">
                          {listing.title}
                        </h3>
                        <div className="text-sm text-slate-500 mb-2">
                          €{listing.price}/mo
                        </div>
                        <div className="text-sm text-slate-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{listing.city || listing.location}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional listings section removed (duplicated and referenced undefined state) */}
        </div>
      </div>

      <Footer />
    </main>
  );
}
