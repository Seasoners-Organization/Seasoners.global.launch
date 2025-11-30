"use client";
import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import SubscriptionGate from "../../components/SubscriptionGate";
import TrustBadge from "../../components/TrustBadge";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { REGIONS } from "../../utils/regions";
import { SEASONS, locationSeasonMap } from "../../utils/destinations";
import FilterSidebar from "../../components/FilterSidebar";
import { applyFilters } from "../../utils/geo";
import { canContactSellers } from "../../utils/subscription";
import { useLanguage } from "../../components/LanguageProvider";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ListingGridSkeleton } from "../../components/SkeletonLoader";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";

export default function JobsPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hydrated, setHydrated] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSubscriptionGate, setShowSubscriptionGate] = useState(false);
  const [userCanContact, setUserCanContact] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/me')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUserCanContact(canContactSellers(data.user));
          }
        })
        .catch(err => {
          // Failed to fetch user details
        });
    }
  }, [session]);

  const handleContactEmployer = (e, listing) => {
    e.preventDefault();
    if (!session) {
      window.location.href = `/auth/signin?returnTo=${encodeURIComponent(`/messages/${listing.userId}?listingId=${listing.id}`)}`;
      return;
    }
    if (!userCanContact) {
      setShowSubscriptionGate(true);
      return;
    }
    window.location.href = `/messages/${listing.userId}?listingId=${listing.id}`;
  };

  const handleUpgrade = async (tier) => {
    window.location.href = `/subscribe?tier=${tier}&returnTo=/jobs`;
  };

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/listings?type=JOB`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch jobs");
        }
        
        setJobs(data.listings || []);
      } catch (err) {
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Sidebar supplies filtered list
  return (
    <main>
      <Navbar />
      <AnimatedPage>
        <section className="max-w-6xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-sky-900 mb-2">{t('jobsTitle')}</h1>
        <p className="text-slate-700 mb-8">
          {t('jobsSubtitle')}
        </p>
        <div className="grid lg:grid-cols-[260px_1fr] gap-8 mb-8">
          <FilterSidebar context="jobs" listings={jobs} onFiltered={setFilteredJobs} />
          <div>
            {loading && <ListingGridSkeleton count={6} />}
            
            {error && (
              <ErrorState
                title="Failed to load jobs"
                description={error}
                onRetry={() => window.location.reload()}
              />
            )}
            
            {!loading && !error && filteredJobs.length === 0 && (
              <EmptyState
                icon="💼"
                title="No jobs found"
                description="Try adjusting your filters or check back later for new opportunities."
                actionLabel="Post a Job"
                actionHref="/list"
              />
            )}
            {!loading && !error && filteredJobs.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {job.photos && job.photos.length > 0 && (
                      <a href={`/listings/${job.id}`} className="block">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img 
                            src={job.photos[0]} 
                            alt={job.title}
                            loading="lazy"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          {job.photos.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                              📷 {job.photos.length}
                            </div>
                          )}
                        </div>
                      </a>
                    )}
                    <div className="p-5 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        {job.user?.profilePicture ? (
                          <img 
                            src={job.user.profilePicture} 
                            alt={job.user.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-sky-400 to-amber-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                            {job.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{job.user?.name || t('anonymous')}</p>
                          {job.user?.trustScore !== undefined && (
                            <div className="mt-1">
                              <TrustBadge score={Math.round(job.user.trustScore)} size="xs" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <a href={`/listings/${job.id}`} className="block p-5">
                      <div className="font-semibold hover:text-sky-700 transition-colors mb-2">{job.title}</div>
                      <div className="text-sm text-slate-500 mb-3">
                        €{job.price}/mo • {job.city ? `${job.city}, ` : ''}{job.location}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        {(() => {
                          const map = locationSeasonMap();
                          const locName = (job.city || job.location || '').toString();
                          const sVal = map.get(locName);
                          return sVal ? (
                            <span className={`text-xs px-2 py-1 rounded-full border ${sVal==='winter' ? 'border-sky-300 text-sky-700 bg-sky-50' : 'border-amber-300 text-amber-700 bg-amber-50'}`}>{sVal.charAt(0).toUpperCase()+sVal.slice(1)}</span>
                          ) : null;
                        })()}
                        {(job.city || job.location) && (
                          <span className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-700 bg-slate-50">{job.city || job.location}</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-3">{job.description}</p>
                    </a>
                    <div className="px-5 pb-5">
                      <button
                        onClick={(e) => handleContactEmployer(e, job)}
                        className="w-full py-2 text-sm text-sky-700 hover:bg-sky-50 border border-sky-200 rounded-lg font-medium transition"
                      >
                        {t('contactEmployer')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-slate-600">{t('loadingJobs')}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">{t('noJobsFound')} <a href="/list" className="text-sky-700 underline">{t('listOne')}</a>!</p>
          </div>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Photo Cover */}
                {job.photos && job.photos.length > 0 && (
                  <a href={`/listings/${job.id}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={job.photos[0]} 
                        alt={job.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {job.photos.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                          📷 {job.photos.length}
                        </div>
                      )}
                    </div>
                  </a>
                )}

                {/* Profile Section */}
                <div className="p-5 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {job.user?.profilePicture ? (
                      <img 
                        src={job.user.profilePicture} 
                        alt={job.user.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-sky-400 to-amber-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {job.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{job.user?.name || t('anonymous')}</p>
                      {job.user?.trustScore !== undefined && (
                        <div className="mt-1">
                          <TrustBadge score={Math.round(job.user.trustScore)} size="xs" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Listing Content */}
                <a href={`/listings/${job.id}`} className="block p-5">
                  <div className="font-semibold hover:text-sky-700 transition-colors mb-2">{job.title}</div>
                  <div className="text-sm text-slate-500 mb-3">
                    €{job.price}/mo • {job.city ? `${job.city}, ` : ''}{job.location}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    {(() => {
                      const map = locationSeasonMap();
                      const locName = (job.city || job.location || '').toString();
                      const sVal = map.get(locName);
                      return sVal ? (
                        <span className={`text-xs px-2 py-1 rounded-full border ${sVal==='winter' ? 'border-sky-300 text-sky-700 bg-sky-50' : 'border-amber-300 text-amber-700 bg-amber-50'}`}>{sVal.charAt(0).toUpperCase()+sVal.slice(1)}</span>
                      ) : null;
                    })()}
                    {(job.city || job.location) && (
                      <span className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-700 bg-slate-50">{job.city || job.location}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3">{job.description}</p>
                </a>
                
                {/* Contact Button */}
                <div className="px-5 pb-5">
                  <button
                    onClick={(e) => handleContactEmployer(e, job)}
                    className="w-full py-2 text-sm text-sky-700 hover:bg-sky-50 border border-sky-200 rounded-lg font-medium transition"
                  >
                    {t('contactEmployer')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />
      
      <SubscriptionGate
        isOpen={showSubscriptionGate}
        onClose={() => setShowSubscriptionGate(false)}
        requiredTier="SEARCHER"
        action="contact employers"
        onUpgrade={handleUpgrade}
      />
    </main>
  );
}
