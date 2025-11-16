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

export default function StaysPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  // Sidebar will manage filters; keep a local filtered list state
  const [filteredStays, setFilteredStays] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hydrated, setHydrated] = useState(false);
  const [stays, setStays] = useState([]);
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
        .catch(err => console.error('Failed to fetch user details:', err));
    }
  }, [session]);

  const handleContactSeller = (e, stayId) => {
    e.preventDefault();
    if (!session) {
      window.location.href = '/auth/signin?returnTo=/stays';
      return;
    }
    if (!userCanContact) {
      setShowSubscriptionGate(true);
      return;
    }
    // TODO: Implement actual contact/messaging functionality
    alert('Contact functionality coming soon!');
  };

  const handleUpgrade = async (tier) => {
    window.location.href = `/subscribe?tier=${tier}&returnTo=/stays`;
  };

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    const fetchStays = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/listings?type=STAY`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch stays");
        setStays(data.listings || []);
      } catch (err) {
        setError(err.message || "Failed to load stays");
      } finally {
        setLoading(false);
      }
    };
    fetchStays();
  }, []);

  // FilterSidebar will supply filtered list via callback
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
            <h1 className="text-4xl font-extrabold text-sky-900 mb-2">{t('staysTitle')}</h1>
        <p className="text-slate-700 mb-6">
          {t('staysSubtitle')}
        </p>
        <div className="grid lg:grid-cols-[260px_1fr] gap-8 mb-8">
          <FilterSidebar listings={stays} onFiltered={setFilteredStays} />
          <div>
            {loading && (
              <div className="text-center py-12">
                <p className="text-slate-600">{t('loadingStays')}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            {!loading && !error && filteredStays.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600">{t('noStaysFound')} <a href="/list" className="text-sky-700 underline">{t('listOne')}</a>!</p>
              </div>
            )}
            {!loading && !error && filteredStays.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStays.map((stay) => (
                  <div key={stay.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {stay.photos && stay.photos.length > 0 && (
                      <a href={`/listings/${stay.id}`} className="block">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img 
                            src={stay.photos[0]} 
                            alt={stay.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          {stay.photos.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                              📷 {stay.photos.length}
                            </div>
                          )}
                        </div>
                      </a>
                    )}
                    <div className="p-5 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        {stay.user?.profilePicture ? (
                          <img 
                            src={stay.user.profilePicture} 
                            alt={stay.user.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-sky-400 to-amber-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                            {stay.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{stay.user?.name || t('anonymous')}</p>
                          {stay.user?.trustScore !== undefined && (
                            <div className="mt-1">
                              <TrustBadge score={Math.round(stay.user.trustScore)} size="xs" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <a href={`/listings/${stay.id}`} className="block p-5">
                      <div className="font-semibold hover:text-sky-700 transition-colors mb-2">{stay.title}</div>
                      <div className="text-sm text-slate-500 mb-3">
                        €{stay.price}/mo • {stay.city ? `${stay.city}, ` : ''}{stay.location}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        {(() => {
                          const map = locationSeasonMap();
                          const locName = (stay.city || stay.location || '').toString();
                          const sVal = map.get(locName);
                          return sVal ? (
                            <span className={`text-xs px-2 py-1 rounded-full border ${sVal==='winter' ? 'border-sky-300 text-sky-700 bg-sky-50' : 'border-amber-300 text-amber-700 bg-amber-50'}`}>{sVal.charAt(0).toUpperCase()+sVal.slice(1)}</span>
                          ) : null;
                        })()}
                        {(stay.city || stay.location) && (
                          <span className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-700 bg-slate-50">{stay.city || stay.location}</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-3">{stay.description}</p>
                    </a>
                    <div className="px-5 pb-5">
                      <button
                        onClick={(e) => handleContactSeller(e, stay.id)}
                        className="w-full py-2 text-sm text-sky-700 hover:bg-sky-50 border border-sky-200 rounded-lg font-medium transition"
                      >
                        {t('contactSeller')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />
      
      <SubscriptionGate
        isOpen={showSubscriptionGate}
        onClose={() => setShowSubscriptionGate(false)}
        requiredTier="SEARCHER"
        action="contact sellers"
        onUpgrade={handleUpgrade}
      />
    </main>
  );
}
