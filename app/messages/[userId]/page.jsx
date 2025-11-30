"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AnimatedPage from "../../../components/AnimatedPage";
import Toast from "../../../components/Toast";
import { motion } from "framer-motion";
import { useLanguage } from "../../../components/LanguageProvider";

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [recipient, setRecipient] = useState(null);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emailVisible, setEmailVisible] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const listingId = searchParams.get("listingId");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push(`/auth/signin?returnTo=/messages/${params.userId}${listingId ? `?listingId=${listingId}` : ''}`);
      return;
    }
    fetchRecipient();
    if (listingId) {
      fetchListing();
    }
  }, [session, status, params.userId, listingId]);

  const fetchRecipient = async () => {
    try {
      const response = await fetch(`/api/user/profile/${params.userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user');
      }
      
      setRecipient(data.user);
      
      // Determine if contact info should be visible
      // Email is hidden by default, user can choose to show if verified
      const isFullyVerified = data.user.emailVerified && data.user.phoneVerified && data.user.identityVerified === 'VERIFIED';
      const emailShown = data.user.emailPrivacy === 'VISIBLE' && isFullyVerified;
      const phoneShown = data.user.phonePrivacy === 'VISIBLE' && isFullyVerified;
      
      setEmailVisible(emailShown);
      setPhoneVisible(phoneShown);
    } catch (err) {
      setError(err.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/listings/${listingId}`);
      const data = await response.json();
      
      if (response.ok) {
        setListing(data.listing);
      }
    } catch (err) {
      console.error('Failed to fetch listing:', err);
    }
  };

  const handleEmailCopy = () => {
    if (recipient?.email) {
      navigator.clipboard.writeText(recipient.email);
      setToast({ message: 'Email copied to clipboard!', type: 'success' });
    }
  };

  const handlePhoneCopy = () => {
    if (recipient?.phoneNumber) {
      navigator.clipboard.writeText(recipient.phoneNumber);
      setToast({ message: 'Phone copied to clipboard!', type: 'success' });
    }
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-600">{t('loading')}</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="text-sky-600 hover:underline"
            >
              Go back
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const trustScore = recipient?.trustScore || 0;
  const hasHighTrust = trustScore >= 50;

  return (
    <main>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <Navbar />
      <AnimatedPage>
        <section className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                {recipient?.profilePicture ? (
                  <img
                    src={recipient.profilePicture}
                    alt={recipient.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center text-white font-semibold text-2xl">
                    {recipient?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-900">{recipient?.name || 'User'}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    {recipient?.emailVerified && (
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Email ✓</span>
                    )}
                    {recipient?.phoneVerified && (
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Phone ✓</span>
                    )}
                    {recipient?.identityVerified === 'VERIFIED' && (
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">ID ✓</span>
                    )}
                  </div>
                  {recipient?.trustScore !== null && (
                    <p className="text-sm text-slate-600 mt-1">
                      Trust Score: <span className="font-semibold">{recipient.trustScore}%</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Listing Context */}
              {listing && (
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Regarding:</p>
                  <p className="font-semibold text-slate-900">{listing.title}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {listing.type === 'JOB' ? 'Job' : listing.type === 'FLATSHARE' ? 'Flatshare' : 'Stay'} • {listing.location}
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Contact Information</h2>

                {/* Email */}
                {emailVisible ? (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Email</p>
                        <p className="font-medium text-slate-900">{recipient?.email}</p>
                      </div>
                      <button
                        onClick={handleEmailCopy}
                        className="px-3 py-2 text-sm bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                      >
                        Copy
                      </button>
                    </div>
                    <a
                      href={`mailto:${recipient?.email}?subject=${listing ? `Re: ${listing.title}` : 'Inquiry from Seasoners'}`}
                      className="mt-3 inline-block px-4 py-2 bg-gradient-to-r from-sky-600 to-amber-600 hover:from-sky-700 hover:to-amber-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Send Email
                    </a>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">Email hidden.</span> This user has reached a high trust level and opted to hide their email.
                      {!recipient?.emailVerified && (
                        <span className="block mt-2">They should verify their email to build more trust.</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Phone */}
                {phoneVisible ? (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Phone</p>
                        <p className="font-medium text-slate-900">{recipient?.phoneNumber}</p>
                      </div>
                      <button
                        onClick={handlePhoneCopy}
                        className="px-3 py-2 text-sm bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                      >
                        Copy
                      </button>
                    </div>
                    <a
                      href={`tel:${recipient?.phoneNumber}`}
                      className="mt-3 inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                    >
                      Call Now
                    </a>
                  </div>
                ) : recipient?.phoneNumber ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">Phone hidden.</span> This user has reached a high trust level and opted to hide their phone.
                    </p>
                  </div>
                ) : null}

                {/* Trust Notice */}
                {!hasHighTrust && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">📧 Email is public by default.</span> Once you reach a trust score of 50%+, you can choose to hide your contact details from your profile privacy settings.
                    </p>
                  </div>
                )}

                {hasHighTrust && emailVisible && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">✓ This user has high trust</span> and has chosen to keep their contact information public for easy communication.
                    </p>
                  </div>
                )}
              </div>

              {/* Safety Tips */}
              <div className="mt-8 p-4 bg-slate-100 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Safety Tips</h3>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Always verify the identity of the person you're contacting</li>
                  <li>• Never send money before meeting in person or signing an agreement</li>
                  <li>• Use Seasoners' Smart Stay Agreement for rentals</li>
                  <li>• Report suspicious behavior to support@seasoners.eu</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />
    </main>
  );
}
