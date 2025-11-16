"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { useLanguage } from "../../components/LanguageProvider";
import SubscriptionGate from "../../components/SubscriptionGate";
import { motion } from "framer-motion";
import { getCountriesBySeason, getRegionsByCountry, getLocations } from "../../utils/geo";
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
  // Location cascade
  const [season, setSeason] = useState('all');
  const [country, setCountry] = useState('all');
  const [region, setRegion] = useState('all');
  const [locationName, setLocationName] = useState('all');

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
        .catch(err => console.error('Failed to fetch user details:', err));
    }
  }, [session]);

  const handleUpgrade = async (tier) => {
    // Redirect to checkout or subscription management
    window.location.href = `/subscribe?tier=${tier}&returnTo=/list`;
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

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
  const locations = getLocations(season, country);

  useEffect(() => { setCountry('all'); setRegion('all'); setLocationName('all'); }, [season]);
  useEffect(() => { setRegion('all'); setLocationName('all'); }, [country]);
  useEffect(() => { setLocationName('all'); }, [region]);

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
      // For Austria (AT), region select below populates an Austrian region display name; otherwise leave empty
      region: country === 'AT' && region !== 'all' ? region : '',
      // Use selected location name as city to aid filtering/display
      city: locationName !== 'all' ? locationName : formData.get("city"),
      price: formData.get("price"),
      photos: photos, // Add photos array
    };

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
      <AnimatedPage>
        <section className="max-w-xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-sky-800 mb-6 text-center">{t('listPlaceOrJob')}</h1>
            
            {status === "unauthenticated" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-amber-800 text-center">
                  {t('pleaseSignInToList').replace('sign in', '')}
                  <a href="/auth/signin" className="underline font-semibold">{t('signIn')}</a>
                </p>
              </div>
            )}

            {status === "authenticated" && !userCanCreate && (
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-4">
                <p className="text-sky-800 text-center">
                  <strong>{t('listerRequired').split('. ')[0]}.</strong> {t('listerRequired').split('. ').slice(1).join('. ')}
                </p>
              </div>
            )}

        {ok ? (
          <p className="text-green-600 text-center font-semibold">{t('thanksListingSubmitted')}</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="title" className="sr-only">{t('listingTitle')}</label>
              <input id="title" name="title" className="w-full border p-3 rounded-lg" placeholder={t('listingTitle')} required disabled={status === "unauthenticated" || loading} />
            </div>

            <div>
              <label htmlFor="listingType" className="sr-only">{t('selectListingType')}</label>
              <select 
                id="listingType" 
                name="listingType" 
                className="w-full border p-3 rounded-lg" 
                required 
                disabled={status === "unauthenticated" || loading}
                value={listingType}
                onChange={(e) => setListingType(e.target.value)}
              >
                <option value="">{t('selectListingType')}</option>
                <option value="Apartment/Room">{t('apartmentRoom')}</option>
                <option value="Staff Housing">{t('staffHousing')}</option>
                <option value="Flatshare">🏠 Flatshare / WG</option>
                <option value="Seasonal Job">{t('seasonalJobOption')}</option>
              </select>
            </div>

            {listingType === "Flatshare" && (
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-sky-800">Flatshare Details</h3>
                
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
                    className="w-full border p-2 rounded-lg"
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
                        <span>{gender === 'FEMALE' ? '👩' : gender === 'MALE' ? '👨' : '👤'}</span>
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
                        👩 Female
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentRoommates([...currentRoommates, 'MALE'])}
                        className="flex-1 border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg"
                        disabled={loading}
                      >
                        👨 Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentRoommates([...currentRoommates, 'ANY'])}
                        className="flex-1 border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg"
                        disabled={loading}
                      >
                        👤 Any
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
                    className="w-full border p-2 rounded-lg"
                    disabled={loading}
                  >
                    <option value="ANY">👤 Any Gender</option>
                    <option value="FEMALE">👩 Female</option>
                    <option value="MALE">👨 Male</option>
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
                  <select aria-label="Season" className="w-full border p-3 rounded-lg" value={season} onChange={e=>setSeason(e.target.value)} disabled={status === "unauthenticated" || loading}>
                    <option value="all">All</option>
                    <option value="winter">winter</option>
                    <option value="summer">summer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select aria-label="Country" className="w-full border p-3 rounded-lg" value={country} onChange={e=>setCountry(e.target.value)} disabled={status === "unauthenticated" || loading}>
                    <option value="all">Select country</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                  <select aria-label="Region" className="w-full border p-3 rounded-lg" value={region} onChange={e=>setRegion(e.target.value)} disabled={status === "unauthenticated" || loading || country==='all'}>
                    <option value="all">{country==='AT' ? 'Select region' : 'N/A'}</option>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Region is required only for Austria.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select aria-label="Location" className="w-full border p-3 rounded-lg" value={locationName} onChange={e=>setLocationName(e.target.value)} disabled={status === "unauthenticated" || loading || season==='all'}>
                    <option value="all">Select location</option>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="city" className="sr-only">{t('city')}</label>
                <input id="city" name="city" className="w-full border p-3 rounded-lg" placeholder={t('cityPlaceholderShort')} disabled={status === "unauthenticated" || loading} />
                <p className="text-xs text-gray-500 mt-1">If no location selected above, you can type a city here.</p>
              </div>
            </div>

            <div>
              <label htmlFor="price" className="sr-only">{t('priceLabel')}</label>
              <input id="price" name="price" type="number" step="0.01" className="w-full border p-3 rounded-lg" placeholder={t('pricePlaceholderShort')} disabled={status === "unauthenticated" || loading} />
            </div>

            <div>
              <label htmlFor="details" className="sr-only">{t('descriptionLabel')}</label>
              <textarea id="details" name="details" className="w-full border p-3 rounded-lg" rows="4" placeholder={t('detailsPlaceholderShort')} required disabled={status === "unauthenticated" || loading} />
            </div>

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
                💡 First photo will be the cover image. Add up to 10 photos to showcase your listing.
              </p>
            </div>

            <button 
              type="submit"
              className="w-full bg-amber-700 hover:brightness-110 text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={status === "unauthenticated" || loading}
            >
              {loading ? t('submittingGeneric') : t('submitGeneric')}
            </button>
          </form>
        )}
          </motion.div>
        </section>
      </AnimatedPage>
      <Footer />
      
      <SubscriptionGate
        isOpen={showSubscriptionGate}
        onClose={() => setShowSubscriptionGate(false)}
        requiredTier="LISTER"
        action="create listings"
        onUpgrade={handleUpgrade}
      />
    </main>
  );
}
