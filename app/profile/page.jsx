"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import TrustScoreDisplay from "../../components/TrustScoreDisplay";
import ProfileEditor from "../../components/ProfileEditor";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
const PhoneVerification = dynamic(() => import("../../components/PhoneVerification"), { ssr: false });
import { formatSubscriptionStatus, formatExpiryDate, SUBSCRIPTION_PLANS } from "../../utils/subscription";
import { useLanguage } from "../../components/LanguageProvider";
import Toast from "../../components/Toast";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [verificationToast, setVerificationToast] = useState("");
  const [toast, setToast] = useState(null);
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get('success') === 'email_verified') {
      setVerificationToast('Email verified successfully');
      setTimeout(() => setVerificationToast(''), 3000);
    }
  }, []);
  const [profileCompleteness, setProfileCompleteness] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?returnTo=/profile");
    }
  }, [status, router]);

  useEffect(() => {
    if (user) {
      calculateProfileCompleteness();
    }
  }, [user]);

  const calculateProfileCompleteness = () => {
    let score = 0;
    const checks = [
      { condition: user.profilePicture, weight: 15, label: 'Profile picture' },
      { condition: user.emailVerified, weight: 10, label: 'Email verified' },
      { condition: user.phoneVerified, weight: 10, label: 'Phone verified' },
      { condition: user.aboutMe && user.aboutMe.length > 50, weight: 15, label: 'Bio (50+ characters)' },
      { condition: user.spokenLanguages && user.spokenLanguages.length > 0, weight: 10, label: 'Languages' },
      { condition: user.skills && user.skills.length > 0, weight: 10, label: 'Skills' },
      { condition: user.interests && user.interests.length > 0, weight: 10, label: 'Interests' },
      { condition: user.occupation, weight: 5, label: 'Occupation' },
      { condition: user.nationality, weight: 5, label: 'Nationality' },
      { condition: user.dateOfBirth, weight: 5, label: 'Date of birth' },
      { condition: user.preferredRegions && user.preferredRegions.length > 0, weight: 5, label: 'Preferred regions' },
    ];
    checks.forEach(check => {
      if (check.condition) score += check.weight;
    });
    setProfileCompleteness(score);
  };

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
      fetchUserListings();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/me");
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserListings = async () => {
    try {
      const response = await fetch("/api/listings/my-listings");
      const data = await response.json();
      if (data.listings) {
        setListings(data.listings);
      }
    } catch (err) {
      console.error("Failed to load listings:", err);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm(t('areYouSure'))) return;

    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setListings(listings.filter((l) => l.id !== listingId));
        fetchUserData(); // Refresh to update totalListings count
      } else {
        alert("Failed to delete listing");
      }
    } catch (err) {
      alert("Error deleting listing");
    }
  };

  const handleProfilePictureUpload = async (file) => {
    if (!file) return;

    setUploadingPicture(true);
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await fetch('/api/user/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        // Refresh user data to show new picture
        await fetchUserData();
        setToast({ type: 'success', message: 'Profile picture updated successfully!' });
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to upload picture' });
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Error uploading picture' });
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      setToast({ type: 'warning', message: 'Please type "DELETE MY ACCOUNT" to confirm' });
      return;
    }

    setDeletingAccount(true);

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ type: 'success', message: 'Your account has been deleted. Signing out...' });
        // Sign out and redirect after delay
        setTimeout(() => {
          window.location.href = '/api/auth/signout';
        }, 1500);
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to delete account' });
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Error deleting account' });
    } finally {
      setDeletingAccount(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText("");
    }
  };

  if (status === "loading" || loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-600">Loading profile...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-600">Failed to load profile</p>
        </div>
        <Footer />
      </main>
    );
  }

  const plan = SUBSCRIPTION_PLANS[user.subscriptionTier] || SUBSCRIPTION_PLANS.FREE;

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
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-sky-900 mb-2">{t('myProfile')}</h1>
              <p className="text-slate-600">{t('manageProfileSubtitle')}</p>
            </div>

            {/* Profile Completeness Bar */}
            {profileCompleteness < 100 && (
              <div className="bg-gradient-to-r from-sky-50 to-amber-50 border border-sky-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Complete Your Profile</h3>
                    <p className="text-xs text-slate-600">A complete profile builds trust and gets better results</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-sky-700">{profileCompleteness}%</div>
                    <div className="text-xs text-slate-500">Complete</div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${profileCompleteness}%` }}
                  ></div>
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-xs text-sky-700 hover:text-sky-800 font-medium"
                >
                  → Edit profile to complete
                </button>
              </div>
            )}

            {/* User Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-amber-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProfilePictureUpload(e.target.files[0])}
                      className="hidden"
                      id="profile-picture-upload-header"
                      disabled={uploadingPicture}
                    />
                    <label
                      htmlFor="profile-picture-upload-header"
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full cursor-pointer transition-all"
                    >
                      <svg 
                        className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                    {uploadingPicture && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                    <p className="text-slate-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.subscriptionTier === 'LISTER' 
                          ? 'bg-gradient-to-r from-sky-100 to-amber-100 text-sky-900'
                          : user.subscriptionTier === 'SEARCHER'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {plan.name} {t('plan')}
                      </span>
                      {user.subscriptionStatus === 'ACTIVE' && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {t('active')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">{t('memberSince')}</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <p className="text-sm text-slate-500 mb-1">{t('totalListings')}</p>
                <p className="text-3xl font-bold text-sky-900">{user.totalListings}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <p className="text-sm text-slate-500 mb-1">{t('trustScore')}</p>
                <p className="text-3xl font-bold text-amber-600">{user.trustScore.toFixed(1)}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <p className="text-sm text-slate-500 mb-1">{t('responseRate')}</p>
                <p className="text-3xl font-bold text-green-600">{(user.responseRate * 100).toFixed(0)}%</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-6">
              <div className="flex gap-6">
                {["overview", "profile", "listings", "subscription", "settings"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-1 font-medium transition-colors relative ${
                      activeTab === tab
                        ? "text-sky-700"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab === 'overview' && t('overview')}
                    {tab === 'profile' && 'Edit Profile'}
                    {tab === 'listings' && t('myListings')}
                    {tab === 'subscription' && t('subscription')}
                    {tab === 'settings' && t('settings')}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-700"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {verificationToast && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
                    {verificationToast}
                  </div>
                )}
                {/* Profile Insights */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Trust Score Card */}
                  <TrustScoreDisplay userId={user.id} />

                  {/* Profile Strength */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">Profile Strength</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Completeness</span>
                        <span className="text-lg font-bold text-sky-700">{profileCompleteness}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-sky-500 to-amber-500 h-2 rounded-full transition-all"
                          style={{ width: `${profileCompleteness}%` }}
                        ></div>
                      </div>
                      <div className="pt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          {user.profilePicture ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-slate-300">○</span>
                          )}
                          <span className="text-sm text-slate-700">Profile picture</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.aboutMe && user.aboutMe.length > 50 ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-slate-300">○</span>
                          )}
                          <span className="text-sm text-slate-700">Detailed bio</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.emailVerified && user.phoneVerified ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-slate-300">○</span>
                          )}
                          <span className="text-sm text-slate-700">Verified contacts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.skills && user.skills.length >= 3 ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-slate-300">○</span>
                          )}
                          <span className="text-sm text-slate-700">Skills listed (3+)</span>
                        </div>
                      </div>
                      {profileCompleteness < 100 && (
                        <button
                          onClick={() => setActiveTab('profile')}
                          className="w-full mt-3 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg font-medium transition"
                        >
                          Complete Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('verificationStatus')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">{t('email')}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.emailVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {user.emailVerified ? `✓ ${t('verified')}` : t('pending')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-700">{t('phone')}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.phoneVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {user.phoneVerified ? `✓ ${t('verified')}` : t('notVerified')}
                      </span>
                    </div>
                    <PhoneVerification
                      userId={user.id}
                      initialPhone={user.phoneNumber}
                      verified={user.phoneVerified}
                      onVerified={() => {
                        setVerificationToast('Phone verified successfully');
                        // refresh user data subtly
                        fetchUserData();
                        setTimeout(() => setVerificationToast(''), 3000);
                      }}
                    />
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                      <strong>ID verification coming soon.</strong> For now, only phone and email verification are available.
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('quickActions')}</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <a
                      href="/list"
                      className="p-4 border-2 border-slate-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition"
                    >
                      <div className="font-medium text-slate-900">Create Listing</div>
                      <div className="text-sm text-slate-500">Post a job or stay</div>
                    </a>
                    <a
                      href="/stays"
                      className="p-4 border-2 border-slate-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition"
                    >
                      <div className="font-medium text-slate-900">Browse Stays</div>
                      <div className="text-sm text-slate-500">Find accommodation</div>
                    </a>
                    <a
                      href="/jobs"
                      className="p-4 border-2 border-slate-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition"
                    >
                      <div className="font-medium text-slate-900">Browse Jobs</div>
                      <div className="text-sm text-slate-500">Find seasonal work</div>
                    </a>
                    <a
                      href="/subscribe"
                      className="p-4 border-2 border-amber-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition"
                    >
                      <div className="font-medium text-slate-900">Manage Subscription</div>
                      <div className="text-sm text-slate-500">Upgrade or change plan</div>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <ProfileEditor user={user} onSave={(updatedUser) => setUser(updatedUser)} />
            )}

            {activeTab === "listings" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">My Listings</h3>
                  <a
                    href="/list"
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition"
                  >
                    + Create New
                  </a>
                </div>

                {listings.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                    <p className="text-slate-600 mb-4">You haven't created any listings yet</p>
                    <a
                      href="/list"
                      className="inline-block px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition"
                    >
                      Create Your First Listing
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <div key={listing.id} className="bg-white rounded-xl shadow-sm border p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{listing.title}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                listing.type === 'JOB' 
                                  ? 'bg-blue-100 text-blue-700'
                                  : listing.type === 'FLATSHARE'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {listing.type}
                              </span>
                              {listing.verified && (
                                <span className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full text-xs font-medium">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">{listing.description}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="font-medium text-sky-700">€{listing.price}/mo</span>
                              <span>•</span>
                              <span>{listing.location}</span>
                              <span>•</span>
                              <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => router.push(`/listings/${listing.id}/edit`)}
                              className="px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-50 rounded-lg transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteListing(listing.id)}
                              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "subscription" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{plan.name}</p>
                      <p className="text-slate-600">€{plan.price}/month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Status</p>
                      <p className={`font-medium ${
                        user.subscriptionStatus === 'ACTIVE' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {formatSubscriptionStatus(user.subscriptionStatus)}
                      </p>
                    </div>
                  </div>

                  {user.subscriptionExpiresAt && (
                    <div className="mb-6">
                      <p className="text-sm text-slate-500">
                        {user.subscriptionStatus === 'ACTIVE' ? 'Renews on' : 'Expires on'}
                      </p>
                      <p className="font-medium">{formatExpiryDate(user.subscriptionExpiresAt)}</p>
                    </div>
                  )}

                  <div className="space-y-2 mb-6">
                    <p className="text-sm font-medium text-slate-700">Plan Features:</p>
                    <ul className="space-y-1">
                      {plan.features?.map((feature, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    {user.subscriptionTier !== 'LISTER' && (
                      <a
                        href="/subscribe"
                        className="px-6 py-2 bg-gradient-to-r from-sky-600 to-amber-600 hover:from-sky-700 hover:to-amber-700 text-white rounded-lg font-medium transition"
                      >
                        Upgrade Plan
                      </a>
                    )}
                    {user.subscriptionStatus === 'ACTIVE' && user.subscriptionTier !== 'FREE' && (
                      <button
                        onClick={() => setToast({ type: 'info', message: 'Cancel subscription feature coming soon' })}
                        className="px-6 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition"
                      >
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full border border-slate-300 rounded-lg p-3"
                      disabled
                    />
                    <p className="text-sm text-slate-500 mt-1">Contact support to update your name</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full border border-slate-300 rounded-lg p-3"
                      disabled
                    />
                    <p className="text-sm text-slate-500 mt-1">Contact support to update your email</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue={user.phoneNumber || 'Not provided'}
                      className="w-full border border-slate-300 rounded-lg p-3"
                      disabled
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => setToast({ type: 'info', message: 'Password change feature coming soon' })}
                      className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition"
                    >
                      Change Password
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-6 mt-6 border-t-2 border-red-200">
                    <h4 className="text-lg font-semibold text-red-600 mb-3">⚠️ Danger Zone</h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-red-800 mb-2">
                        <strong>Delete Account</strong>
                      </p>
                      <p className="text-sm text-red-700 mb-3">
                        Once you delete your account, there is no going back. This will permanently delete:
                      </p>
                      <ul className="text-sm text-red-700 list-disc list-inside space-y-1 mb-4">
                        <li>Your profile and all personal information</li>
                        <li>All your listings ({user.totalListings || 0} listings)</li>
                        <li>Your trust score and reviews</li>
                        <li>All agreements and history</li>
                        <li>Your subscription (no refunds)</li>
                      </ul>
                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                        >
                          Delete My Account
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm text-red-800 font-semibold">
                            Type "DELETE MY ACCOUNT" to confirm:
                          </p>
                          <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="DELETE MY ACCOUNT"
                            className="w-full border-2 border-red-300 rounded-lg p-3 focus:border-red-500 focus:outline-none"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={handleDeleteAccount}
                              disabled={deletingAccount || deleteConfirmText !== "DELETE MY ACCOUNT"}
                              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
                            >
                              {deletingAccount ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                            <button
                              onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeleteConfirmText("");
                              }}
                              className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
