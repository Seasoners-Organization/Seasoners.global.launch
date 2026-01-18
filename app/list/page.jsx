"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { useLanguage } from "../../components/LanguageProvider";
import SubscriptionGate from "../../components/SubscriptionGate";
import UnsavedChangesWarning from "../../components/UnsavedChangesWarning";
import EarlyBirdModal from "../../components/EarlyBirdModal";
import { motion } from "framer-motion";
import { getCountriesBySeason, getRegionsByCountry, getLocations, getCountryName } from "../../utils/geo";
import { canCreateListings } from "../../utils/subscription";

export default function List() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSubscriptionGate, setShowSubscriptionGate] = useState(false);
  const [userCanCreate, setUserCanCreate] = useState(false);
  const [listingType, setListingType] = useState("");
  const [currentRoommates, setCurrentRoommates] = useState([]);
  const [totalRoommates, setTotalRoommates] = useState(2);
  const [photos, setPhotos] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // Location cascade
  const [season, setSeason] = useState('all');
  const [country, setCountry] = useState('all');
  const [region, setRegion] = useState('all');

  useEffect(() => {
    if (session?.user) {
      // Fetch full user details including subscription info
      fetch('/api/user/me')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUserCanCreate(canCreateListings(data.user));
          }
        })
        .catch(err => {
          // Failed to fetch user details
        });
    }
  }, [session]);

  const handleUpgrade = async (tier) => {
    // Redirect to checkout or subscription management
    window.location.href = `/subscribe?tier=${tier}&returnTo=/list`;
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setHasUnsavedChanges(true);
    // Limit to 10 photos total
    if (photos.length + files.length > 10) {
      setError("Maximum 10 photos allowed per listing");
      return;
    }

    setUploadingPhoto(true);
    setError("");

    try {
      const newPhotos = [];
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }

        // Validate file size (max 5MB per photo)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds 5MB limit`);
        }

        // Convert to base64
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newPhotos.push(dataUrl);
      }

      setPhotos([...photos, ...newPhotos]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const countries = getCountriesBySeason(season);
  const regions = country === 'all' ? [] : getRegionsByCountry(country);

  useEffect(() => { setCountry('all'); setRegion('all'); }, [season]);
  useEffect(() => { setRegion('all'); }, [country]);

  const submit = async (e) => {
    e.preventDefault();
    
    // Check if user can create listings
    if (!userCanCreate) {
      setShowSubscriptionGate(true);
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      title: formData.get("title"),
      description: formData.get("details"),
      listingType: formData.get("listingType"),
      city: formData.get("city"),
      photos: photos, // Add photos array (empty for jobs)
    };

    // Price for accommodations, wage for jobs
    if (listingType === "Seasonal Job") {
      const wage = formData.get("wage");
      if (wage) data.price = wage; // Store wage as price for now
      data.jobType = formData.get("jobType");
      data.industry = formData.get("industry");
      data.benefits = formData.get("benefits");
    } else {
      data.price = formData.get("price");
    }

    // Only include region if Austria selected and region chosen
    if (country === 'AT' && region !== 'all') {
      data.region = region;
    }

    // Add flatshare-specific data
    if (listingType === "Flatshare") {
      data.totalRoommates = totalRoommates;
      data.currentRoommates = currentRoommates;
      data.lookingForGender = formData.get("lookingForGender");
      data.spotsAvailable = totalRoommates - currentRoommates.length;
    }

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create listing");
      }

      setOk(true);
      setHasUnsavedChanges(false);
      e.target.reset();
      setPhotos([]); // Clear photos
      setCurrentRoommates([]);
      setListingType("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <EarlyBirdModal trigger="payment" />
      <AnimatedPage>
        <section className="max-w-xl mx-auto px-3 sm:px-6 py-8 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-sky-800 mb-4 sm:mb-6 text-center">{t('listPlaceOrJob')}</h1>
            
            {/* Quick Start Banner */}
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200 rounded-lg p-4 sm:p-6 mb-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl flex-shrink-0">⚡</span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-sky-900 mb-2">Quick Start - Get Listed in Minutes</h2>
                  <p className="text-sky-700 text-xs sm:text-sm mb-3">Complete your basic listing details below. You can add more details and photos anytime.</p>
                  <div className="grid grid-cols-3 gap-2 text-xs text-sky-600">
                    <div className="flex items-center gap-1">✓ <span>Basic info</span></div>
                    <div className="flex items-center gap-1">✓ <span>Photos</span></div>
                    <div className="flex items-center gap-1">✓ <span>Go live</span></div>
                  </div>
                </div>
              </div>
            </div>
            
            {status === "unauthenticated" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 mb-4">
                <p className="text-amber-800 text-center text-sm sm:text-base">
                  {t('pleaseSignInToList').replace('sign in', '')}
                  <a href="/auth/signin" className="underline font-semibold">{t('signIn')}</a>
                </p>
              </div>
            )}

        {ok ? (
          <p className="text-green-600 text-center font-semibold">{t('thanksListingSubmitted')}</p>
        ) : (
          <>
            {/* Progress Indicator */}
            {/* Progress Indicator */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">Progress</span>
                <span className="text-xs sm:text-sm text-slate-500">{photos.length > 0 ? '3 of 3' : listingType ? '2 of 3' : '1 of 3'}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${photos.length > 0 ? 100 : listingType ? 66 : 33}%` }}
                />
              </div>
            </div>
          
            <form onSubmit={submit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

            <div>
              <label htmlFor="title" className="sr-only">{t('listingTitle')}</label>
              <input id="title" name="title" className="w-full border border-slate-300 p-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed" placeholder={t('listingTitle')} required disabled={status === "unauthenticated" || loading} />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-semibold text-slate-800 mb-3">{t('selectListingType')}</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { value: "Apartment/Room", label: "🏘️ Apartment/Room", icon: "🏘️" },
                  { value: "Staff Housing", label: "🏗️ Staff Housing", icon: "🏗️" },
                  { value: "Flatshare", label: "🏠 Flatshare/WG", icon: "🏠" },
                  { value: "Seasonal Job", label: "💼 Job", icon: "💼" }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setListingType(option.value)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-center font-medium min-h-[80px] sm:min-h-[100px] flex flex-col items-center justify-center touch-manipulation active:scale-95 ${
                      listingType === option.value
                        ? 'border-sky-500 bg-sky-50 text-sky-900'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-sky-300'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl mb-1">{option.icon}</div>
                    <div className="text-xs sm:text-sm">{option.label.split(' ')[1]} {option.label.split(' ')[2] || ''}</div>
                  </button>
                ))}
              </div>
            </div>

            {listingType === "Flatshare" && (
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 sm:p-4 space-y-4">
                <h3 className="font-semibold text-sky-800 text-sm sm:text-base">Flatshare Details</h3>
                
                <div>
                  <label htmlFor="totalRoommates" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Roommates (including you)
                  </label>
                  <input 
                    type="number" 
                    id="totalRoommates"
                    min="2" 
                    max="10"
                    value={totalRoommates}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 2;
                      setTotalRoommates(val);
                      // Reset current roommates if exceeds new total
                      if (currentRoommates.length >= val) {
                        setCurrentRoommates([]);
                      }
                    }}
                    className="w-full border p-2 sm:p-3 rounded-lg text-base min-h-[44px]"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Roommates ({currentRoommates.length}/{totalRoommates - 1})
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {currentRoommates.map((gender, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-white border rounded-lg px-3 py-1">
                        <span>{gender === 'FEMALE' ? 'F' : gender === 'MALE' ? 'M' : ''}</span>
                        <button
                          type="button"
                          onClick={() => setCurrentRoommates(currentRoommates.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 ml-1"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  {currentRoommates.length < totalRoommates - 1 && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentRoommates([...currentRoommates, 'FEMALE'])}
                        className="flex-1 border border-pink-300 bg-pink-50 hover:bg-pink-100 text-pink-700 py-2 rounded-lg"
                        disabled={loading}
                      >
                        Female
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentRoommates([...currentRoommates, 'MALE'])}
                        className="flex-1 border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg"
                        disabled={loading}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentRoommates([...currentRoommates, 'ANY'])}
                        className="flex-1 border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg"
                        disabled={loading}
                      >
                        Any
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="lookingForGender" className="block text-sm font-medium text-gray-700 mb-1">
                    Looking For
                  </label>
                  <select 
                    id="lookingForGender" 
                    name="lookingForGender"
                    className="w-full border p-2 sm:p-3 rounded-lg text-base min-h-[44px]"
                    disabled={loading}
                  >
                    <option value="ANY">Any Gender</option>
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>

                <p className="text-sm text-gray-600">
                  Available spots: <strong>{totalRoommates - currentRoommates.length}</strong>
                </p>
              </div>
            )}

            {/* Location cascade: Season -> Country -> Region (when AT) -> Location */}
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                  <select aria-label="Season" className="w-full border p-2 sm:p-3 rounded-lg text-base min-h-[44px]" value={season} onChange={e=>setSeason(e.target.value)} disabled={status === "unauthenticated" || loading}>
                    <option value="all">All</option>
                    <option value="winter">winter</option>
                    <option value="summer">summer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select aria-label="Country" className="w-full border p-2 sm:p-3 rounded-lg text-base min-h-[44px]" value={country} onChange={e=>setCountry(e.target.value)} disabled={status === "unauthenticated" || loading}>
                    <option value="all">Select country</option>
                    {countries.map(c => <option key={c} value={c}>{getCountryName(c)}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region / City {country === 'AT' && <span className="text-xs text-gray-500">(Austrian federal states)</span>}
                  </label>
                  <select aria-label="Region" className="w-full border p-2 sm:p-3 rounded-lg text-base min-h-[44px]" value={region} onChange={e=>setRegion(e.target.value)} disabled={status === "unauthenticated" || loading || country==='all'}>
                    <option value="all">{country === 'all' ? 'Select country first' : 'Select a city or town'}</option>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Select your city or resort location.</p>
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Or enter custom city</label>
                  <input id="city" name="city" className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed" placeholder="e.g., Innsbruck, Sydney" disabled={status === "unauthenticated" || loading} />
                  <p className="text-xs text-gray-500 mt-1">Enter if your location isn't in the list above.</p>
                </div>
              </div>
            </div>

            {listingType === "Seasonal Job" ? (
              <>
                {/* Job-specific fields */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-amber-800">Job Details</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                      <select id="jobType" name="jobType" className="w-full border p-2 sm:p-3 rounded-lg text-base min-h-[44px]" disabled={loading}>
                        <option value="">Select type</option>
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="SEASONAL">Seasonal</option>
                        <option value="TEMPORARY">Temporary</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <select id="industry" name="industry" className="w-full border p-2 sm:p-3 rounded-lg text-base min-h-[44px]" disabled={loading}>
                        <option value="">Select industry</option>
                        <option value="HOSPITALITY">Hospitality</option>
                        <option value="FOOD_SERVICE">Food Service</option>
                        <option value="RETAIL">Retail</option>
                        <option value="OUTDOOR">Outdoor / Ski Ops</option>
                        <option value="TRAVEL">Travel</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="wage" className="block text-sm font-medium text-gray-700 mb-1">Wage / Salary (optional)</label>
                    <input id="wage" name="wage" type="text" className="w-full border border-slate-300 p-2 sm:p-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed min-h-[44px]" placeholder="e.g., €1,500/month or $20/hour" disabled={loading} />
                    <p className="text-xs text-gray-500 mt-1">Leave blank if not disclosing wage</p>
                  </div>

                  <div>
                    <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">Benefits / Perks</label>
                    <textarea id="benefits" name="benefits" className="w-full border border-slate-300 p-2 sm:p-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none disabled:bg-slate-50 disabled:cursor-not-allowed" rows="2" placeholder="e.g., Free accommodation, Meals included, Ski pass, Travel allowance" disabled={loading} />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="price" className="sr-only">{t('priceLabel')}</label>
                <input id="price" name="price" type="number" step="0.01" className="w-full border border-slate-300 p-2 sm:p-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed min-h-[44px]" placeholder={t('pricePlaceholderShort')} disabled={status === "unauthenticated" || loading} />
              </div>
            )}

            <div>
              <label htmlFor="details" className="sr-only">{t('descriptionLabel')}</label>
              <textarea id="details" name="details" className="w-full border border-slate-300 p-2 sm:p-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none disabled:bg-slate-50 disabled:cursor-not-allowed" rows="4" placeholder={listingType === "Seasonal Job" ? "Job description, responsibilities, required skills, schedule, etc." : t('detailsPlaceholderShort')} required disabled={status === "unauthenticated" || loading} />
            </div>

{listingType !== "Seasonal Job" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📷 Photos (max 10)
                </label>
                
                {/* Photo Grid */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                    {photos.map((photo, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
                        <img 
                          src={photo} 
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={loading || uploadingPhoto}
                        >
                          ×
                        </button>
                        {idx === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent py-1">
                            <p className="text-white text-xs text-center font-semibold">Cover</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {photos.length < 10 && (
                  <div className="relative">
                    <input
                      type="file"
                      id="photoUpload"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={status === "unauthenticated" || loading || uploadingPhoto}
                    />
                    <label
                      htmlFor="photoUpload"
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
                        uploadingPhoto 
                          ? 'border-gray-300 bg-gray-50 cursor-wait' 
                          : 'border-sky-300 bg-sky-50 hover:bg-sky-100 hover:border-sky-400'
                      }`}
                    >
                      {uploadingPhoto ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mb-2"></div>
                          <p className="text-sm text-sky-700">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <svg className="w-10 h-10 text-sky-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <p className="text-sm text-sky-700 font-medium">Click to upload photos</p>
                          <p className="text-xs text-gray-500 mt-1">JPEG, PNG or WebP (max 5MB each)</p>
                        </>
                      )}
                    </label>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  First photo will be the cover image. Add up to 10 photos to showcase your listing.
                </p>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-amber-700 hover:brightness-110 text-white font-semibold py-3 sm:py-4 rounded-xl text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700 active:scale-95 touch-manipulation min-h-[48px]"
              disabled={status === "unauthenticated" || loading}
            >
              {loading ? t('submittingGeneric') : t('submitGeneric')}
            </button>
            
            {/* Success Encouragement */}
            <div className="mt-4 sm:mt-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-xs sm:text-sm text-green-700">
                <span className="font-semibold">💡 Pro Tip:</span> Early hosts get featured! Your listing will be highlighted to help you attract the first guests.
              </p>
            </div>
            </form>
          </>
        )}
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />
      
      <SubscriptionGate
        isOpen={showSubscriptionGate}
        onClose={() => setShowSubscriptionGate(false)}
        requiredTier="PLUS"
        action="create listings"
        onUpgrade={handleUpgrade}
      />

      <UnsavedChangesWarning hasUnsavedChanges={hasUnsavedChanges} />
    </main>
  );
}
