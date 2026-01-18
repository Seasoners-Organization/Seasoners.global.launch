"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AnimatedPage from "../../../components/AnimatedPage";
import SubscriptionGate from "../../../components/SubscriptionGate";
import SaveListingButton from "../../../components/SaveListingButton";
import { motion } from "framer-motion";
import { canContactSellers } from "../../../utils/subscription";
import { REGION_ENUM_TO_DISPLAY } from "../../../utils/regions";
import { useLanguage } from "../../../components/LanguageProvider";
import { useUserProfile } from "../../../hooks/useUserProfile";
import ReportModal from "../../../components/ReportModal";
import { generateListingStructuredData } from "../../../utils/structured-data";

export default function ListingDetailPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const { user } = useUserProfile();
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSubscriptionGate, setShowSubscriptionGate] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);

  const userCanContact = user ? canContactSellers(user) : false;

  const isOwnListing = () => {
    return session?.user?.email && user?.id && listing?.userId === user.id;
  };

  useEffect(() => {
    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/listings/${params.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch listing');
      }
      
      setListing(data);
    } catch (err) {
      setError(err.message || 'Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!listing?.userId) return;
    if (!session) {
      router.push(`/auth/signin?returnTo=${encodeURIComponent(`/messages/${listing.userId}?listingId=${params.id}`)}`);
      return;
    }
    if (!userCanContact) {
      setShowSubscriptionGate(true);
      return;
    }
    router.push(`/messages/${listing.userId}?listingId=${params.id}`);
  };

  const handleUpgrade = async (tier) => {
    window.location.href = `/subscribe?tier=${tier}&returnTo=/listings/${params.id}`;
  };

  const nextPhoto = () => {
    if (listing?.photos && listing.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % listing.photos.length);
    }
  };

  const prevPhoto = () => {
    if (listing?.photos && listing.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + listing.photos.length) % listing.photos.length);
    }
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-600">{t('loadingListing')}</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || t('listingNotFound')}</p>
            <a href="/stays" className="text-sky-600 hover:underline">{t('browseAllListings')}</a>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const regionDisplay = listing.region ? REGION_ENUM_TO_DISPLAY[listing.region] : null;

  return (
    <main>
      {listing && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateListingStructuredData(listing)) }}
        />
      )}
      <Navbar />
      <AnimatedPage>
        <section className="max-w-5xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <a href={listing.type === 'JOB' ? '/jobs' : '/stays'} className="text-sky-600 hover:underline">
                ← {t('backTo')} {listing.type === 'JOB' ? t('jobs') : t('stays')}
              </a>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border p-8">
                  {/* Photo Gallery */}
                  {listing.photos && listing.photos.length > 0 && (
                    <div className="mb-8 -mx-8 -mt-8">
                      <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden rounded-t-2xl">
                        <img 
                          src={listing.photos[currentPhotoIndex]} 
                          alt={`${listing.title} - Photo ${currentPhotoIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Navigation Arrows */}
                        {listing.photos.length > 1 && (
                          <>
                            <button
                              onClick={prevPhoto}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
                            >
                              ‹
                            </button>
                            <button
                              onClick={nextPhoto}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
                            >
                              ›
                            </button>
                          </>
                        )}

                        {/* Photo Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                          {currentPhotoIndex + 1} / {listing.photos.length}
                        </div>
                      </div>

                      {/* Thumbnail Strip */}
                      {listing.photos.length > 1 && (
                        <div className="flex gap-2 px-8 py-4 overflow-x-auto">
                          {listing.photos.map((photo, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentPhotoIndex(idx)}
                              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                                idx === currentPhotoIndex 
                                  ? 'border-sky-500 ring-2 ring-sky-200' 
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <img 
                                src={photo} 
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        listing.type === 'JOB' 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {listing.type}
                      </span>
                      {listing.verified && (
                        <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                          ✓ {t('verified')}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">{listing.title}</h1>
                    <div className="flex items-center gap-2 text-slate-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>
                        {listing.city && `${listing.city}, `}
                        {regionDisplay || listing.location}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-sky-900">€{listing.price}</span>
                      <span className="text-slate-600">{t('pricePerMonth')}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('description')}</h2>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {listing.description}
                    </p>
                  </div>

                  <div className="mb-6 pb-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('details')}</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">{t('listingPosted')}</p>
                        <p className="font-medium">{new Date(listing.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">{t('listingRegion')}</p>
                        <p className="font-medium">{regionDisplay || 'Austria'}</p>
                      </div>
                      {listing.city && (
                        <div>
                          <p className="text-sm text-slate-500">{t('listingCity')}</p>
                          <p className="font-medium">{listing.city}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-slate-500">{t('listingType')}</p>
                        <p className="font-medium">{listing.type === 'JOB' ? t('seasonalJob') : t('shortTermStay')}</p>
                      </div>
                    </div>
                  </div>

                  {listing.reviews && listing.reviews.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        {t('reviews')} ({listing.reviews.length})
                      </h2>
                      <div className="space-y-4">
                        {listing.reviews.map((review) => (
                          <div key={review.id} className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{review.reviewer.name}</span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-slate-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-600 text-sm">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-24">
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {listing.type === 'JOB' ? t('employer') : t('host')}
                    </h3>
                    <div className="flex flex-col items-center text-center mb-4">
                      {listing.user.profilePicture ? (
                        <img 
                          src={listing.user.profilePicture} 
                          alt={listing.user.name}
                          className="w-24 h-24 rounded-full object-cover mb-3"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-amber-400 rounded-xl flex items-center justify-center text-white text-3xl font-bold mb-3">
                          {listing.user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <p className="font-semibold text-gray-900 text-lg">{listing.user.name}</p>
                      {listing.user.occupation && (
                        <p className="text-sm text-slate-600">{listing.user.occupation}</p>
                      )}
                      {listing.user.nationality && (
                        <p className="text-xs text-slate-500 mt-1">{listing.user.nationality}</p>
                      )}
                    </div>

                    {listing.user.aboutMe && (
                      <div className="mb-4 pb-4 border-b">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">{t('about')}</h4>
                        <p className="text-sm text-slate-600 line-clamp-4">{listing.user.aboutMe}</p>
                      </div>
                    )}

                    {listing.user.spokenLanguages && listing.user.spokenLanguages.length > 0 && (
                      <div className="mb-4 pb-4 border-b">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">{t('languages')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {listing.user.spokenLanguages.map((lang, idx) => (
                            <span key={idx} className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {listing.user.interests && listing.user.interests.length > 0 && (
                      <div className="mb-4 pb-4 border-b">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">{t('interests')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {listing.user.interests.map((interest, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{t('trustScore')}</span>
                        <span className="font-medium text-amber-600">⭐ {listing.user.trustScore.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{t('responseRate')}</span>
                        <span className="font-medium text-green-600">{(listing.user.responseRate * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{t('memberSince')}</span>
                        <span className="font-medium text-slate-900">{new Date(listing.user.createdAt).getFullYear()}</span>
                      </div>
                    </div>
                  </div>

                  {isOwnListing() ? (
                    <button
                      onClick={() => router.push(`/listings/${listing.id}/edit`)}
                      className="w-full py-3 px-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-xl transition-all"
                    >
                      {t('editListing')}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={handleContact}
                        className="w-full py-3 px-6 bg-gradient-to-r from-sky-600 to-amber-600 hover:from-sky-700 hover:to-amber-700 text-white font-semibold rounded-xl transition-all"
                      >
                        {listing.type === 'JOB' ? t('contactEmployer') : t('contactHost')}
                      </button>
                      <div className="flex gap-2">
                        <SaveListingButton
                          listingId={listing.id}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}

                  {!session && (
                    <p className="text-xs text-center text-slate-500 mt-3">
                      {t('signInRequired')}
                    </p>
                  )}

                  {!isOwnListing() && (
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="w-full mt-3 py-2 text-sm text-slate-600 hover:text-red-600 transition"
                    >
                      {t('reportListing')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />

      <SubscriptionGate
        isOpen={showSubscriptionGate}
        onClose={() => setShowSubscriptionGate(false)}
        requiredTier="PLUS"
        action="send unlimited messages"
        onUpgrade={handleUpgrade}
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        listingId={listing.id}
        listingTitle={listing.title}
      />
    </main>
  );
}
