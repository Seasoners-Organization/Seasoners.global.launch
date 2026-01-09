"use client";
import { useState } from "react";
import { REGIONS } from "../utils/regions";
import PhoneVerification from "./PhoneVerification";
import Toast from "./Toast";

export default function ProfileEditor({ user, onSave, phoneVerificationRef, bioSectionRef, emailVerificationRef, languageSectionRef, skillsSectionRef, interestsSectionRef, regionsSectionRef, profilePictureRef }) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    nationality: user?.nationality || '',
    spokenLanguages: user?.spokenLanguages || [],
    occupation: user?.occupation || '',
    workExperience: user?.workExperience || '',
    skills: user?.skills || [],
    aboutMe: user?.aboutMe || '',
    interests: user?.interests || [],
    availability: user?.availability || null,
    willingToRelocate: user?.willingToRelocate ?? true,
    hasWorkPermit: user?.hasWorkPermit ?? false,
    workPermitCountries: user?.workPermitCountries || [],
    profileVisibility: user?.profileVisibility || 'PUBLIC',
    openToOpportunities: user?.openToOpportunities ?? true,
    preferredRegions: user?.preferredRegions || [],
    emailPrivacy: user?.emailPrivacy || 'HIDDEN',
    phonePrivacy: user?.phonePrivacy || 'HIDDEN',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [newLanguage, setNewLanguage] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [autoSaving, setAutoSaving] = useState(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState('');

  let autoSaveTimer;
  const scheduleAutoSave = (data) => {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(async () => {
      try {
        setAutoSaving(true);
        const response = await fetch('/api/user/update-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          setAutoSaveMessage('Changes saved');
          setTimeout(() => setAutoSaveMessage(''), 1500);
        }
      } finally {
        setAutoSaving(false);
      }
    }, 600);
  };

  const handleProfilePictureUpload = async (file) => {
    if (!file) return;

    setUploadingPicture(true);
    const formDataUpload = new FormData();
    formDataUpload.append('profilePicture', file);

    try {
      const response = await fetch('/api/user/upload-profile-picture', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();
      if (response.ok) {
        setToast({ type: 'success', message: 'Profile picture updated successfully!' });
        // Reload after a short delay to allow toast to display
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to upload picture' });
      }
    } catch (error) {
      console.error('Picture upload error:', error);
      setToast({ type: 'error', message: 'Error uploading picture. Please try again.' });
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        // Automatically sync Stripe subscription if email was changed
        if (formData.email !== user?.email) {
          try {
            await fetch('/api/user/sync-stripe-subscription', { method: 'POST' });
          } catch (e) {
            console.error('Stripe sync failed:', e);
          }
        }
        setToast({ type: 'success', message: 'Profile updated successfully!' });
        if (onSave) onSave(data.user);
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Profile save error:', error);
      setToast({ type: 'error', message: 'Error updating profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const addToArray = (field, value) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value.trim()],
      });
    }
  };

  const removeFromArray = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const toggleRegion = (region) => {
    const current = formData.preferredRegions;
    if (current.includes(region)) {
      const next = current.filter(r => r !== region);
      setFormData({
        ...formData,
        preferredRegions: next,
      });
      scheduleAutoSave({ preferredRegions: next });
    } else {
      const next = [...current, region];
      setFormData({
        ...formData,
        preferredRegions: next,
      });
      scheduleAutoSave({ preferredRegions: next });
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Upload */}
      <div ref={profilePictureRef} className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-sky-400 to-amber-400 flex items-center justify-center text-white text-3xl font-bold">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleProfilePictureUpload(e.target.files[0])}
              className="hidden"
              id="profile-picture-upload"
              disabled={uploadingPicture}
            />
            <label
              htmlFor="profile-picture-upload"
              className="inline-block px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              {uploadingPicture ? 'Uploading...' : 'Upload New Picture'}
            </label>
            <p className="text-sm text-slate-500 mt-2">JPG, PNG or WebP. Max 10MB for high resolution.</p>
          </div>
        </div>
      </div>

      {/* Contact & Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Contact & Basic Information</h3>
        <div className="grid gap-4">
          {/* Email */}
          <div ref={emailVerificationRef}>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            {user?.emailVerified ? (
              <div className="space-y-3">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
                  autoComplete="email"
                  disabled
                />
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-medium text-green-900">✓ Email Verified</p>
                  <p className="text-xs text-green-600 mt-1">Verified on {new Date(user.emailVerified).toLocaleDateString()}</p>
                </div>
                <p className="text-xs text-slate-500">To change your email, please contact support</p>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  autoComplete="email"
                />
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-yellow-900">⚠ Email Not Verified</p>
                      <p className="text-xs text-yellow-700 mt-1">Verify your email to unlock features and increase trust</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!formData.email) {
                      setToast({ type: 'error', message: 'Please enter an email address' });
                      return;
                    }
                    try {
                      const response = await fetch('/api/auth/resend-verification', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: formData.email }),
                      });
                      const data = await response.json();
                      if (response.ok) {
                        setToast({ type: 'success', message: 'Verification email sent! Check your inbox.' });
                      } else {
                        setToast({ type: 'error', message: data.error || 'Failed to send verification email' });
                      }
                    } catch (error) {
                      setToast({ type: 'error', message: 'Error sending verification email' });
                    }
                  }}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition"
                >
                  Send Verification Email
                </button>
              </div>
            )}
          </div>
          {/* Phone */}
          <div ref={phoneVerificationRef} tabIndex={-1}>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            {user?.phoneVerified && user?.phoneNumber ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-900">✓ Phone Verified</p>
                      <p className="text-sm text-green-700 mt-1">{user.phoneNumber}</p>
                      <p className="text-xs text-green-600 mt-1">Verified on {new Date(user.phoneVerified).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // Show the phone verification component to allow changing
                    const container = document.querySelector('[data-phone-container]');
                    if (container) {
                      container.classList.toggle('hidden');
                    }
                  }}
                  className="text-sm text-slate-600 hover:text-slate-800 underline"
                >
                  Change phone number
                </button>
                <div data-phone-container className="hidden">
                  <PhoneVerification
                    userId={user?.id}
                    initialPhone={formData.phoneNumber}
                    verified={false}
                    onVerified={() => {
                      // Delay reload to let animations finish
                      setTimeout(() => window.location.reload(), 1500);
                    }}
                  />
                </div>
              </div>
            ) : (
              <PhoneVerification
                userId={user?.id}
                initialPhone={formData.phoneNumber}
                verified={user?.phoneVerified}
                onVerified={() => {
                  // Delay reload to let animations finish
                  setTimeout(() => window.location.reload(), 1500);
                }}
              />
            )}
          </div>
          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-3"
            />
          </div>
          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nationality</label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, nationality: value });
                scheduleAutoSave({ nationality: value });
              }}
              placeholder="e.g., Austrian, German, etc."
              className="w-full border border-slate-300 rounded-lg p-3"
            />
          </div>
          {/* Occupation */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Occupation</label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, occupation: value });
                scheduleAutoSave({ occupation: value });
              }}
              placeholder="e.g., Student, Bartender, Ski Instructor"
              className="w-full border border-slate-300 rounded-lg p-3"
            />
          </div>
          {/* Work Experience */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Work Experience</label>
            <input
              type="text"
              value={formData.workExperience}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, workExperience: value });
                scheduleAutoSave({ workExperience: value });
              }}
              placeholder="e.g., 3 years in hospitality"
              className="w-full border border-slate-300 rounded-lg p-3"
            />
          </div>
        </div>
      </div>

      {/* About Me */}
      <div ref={bioSectionRef} className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">About Me</h3>
        <textarea
          value={formData.aboutMe}
          onChange={(e) => {
            const value = e.target.value;
            const next = { ...formData, aboutMe: value };
            setFormData(next);
            scheduleAutoSave({ aboutMe: value });
          }}
          rows="6"
          placeholder="Tell others about yourself, your experience, what you're looking for..."
          className="w-full border border-slate-300 rounded-lg p-3"
        />
        {autoSaving && <p className="text-xs text-slate-500 mt-1">Saving…</p>}
        {!autoSaving && autoSaveMessage && <p className="text-xs text-green-600 mt-1">{autoSaveMessage}</p>}
        <p className="text-sm text-slate-500 mt-2">This will be visible to potential employers and roommates.</p>
      </div>

      {/* Languages */}
      <div ref={languageSectionRef} className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Languages</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.spokenLanguages.map((lang, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-sky-100 text-sky-700 px-3 py-1 rounded-full">
              <span>{lang}</span>
              <button
                onClick={() => removeFromArray('spokenLanguages', idx)}
                className="text-sky-900 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addToArray('spokenLanguages', newLanguage);
                setNewLanguage('');
              }
            }}
            placeholder="Add a language"
            className="flex-1 border border-slate-300 rounded-lg p-2"
          />
          <button
            onClick={() => {
              addToArray('spokenLanguages', newLanguage);
              setNewLanguage('');
              scheduleAutoSave({ spokenLanguages: [...formData.spokenLanguages, newLanguage].filter(Boolean) });
            }}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Skills */}
      <div ref={skillsSectionRef} className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.skills.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              <span>{skill}</span>
              <button
                onClick={() => removeFromArray('skills', idx)}
                className="text-amber-900 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addToArray('skills', newSkill);
                setNewSkill('');
              }
            }}
            placeholder="Add a skill (e.g., Bartending, Skiing)"
            className="flex-1 border border-slate-300 rounded-lg p-2"
          />
          <button
            onClick={() => {
              addToArray('skills', newSkill);
              setNewSkill('');
              scheduleAutoSave({ skills: [...formData.skills, newSkill].filter(Boolean) });
            }}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Interests */}
      <div ref={interestsSectionRef} className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Interests & Hobbies</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.interests.map((interest, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
              <span>{interest}</span>
              <button
                onClick={() => removeFromArray('interests', idx)}
                className="text-green-900 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addToArray('interests', newInterest);
                setNewInterest('');
              }
            }}
            placeholder="Add an interest"
            className="flex-1 border border-slate-300 rounded-lg p-2"
          />
          <button
            onClick={() => {
              addToArray('interests', newInterest);
              setNewInterest('');
              scheduleAutoSave({ interests: [...formData.interests, newInterest].filter(Boolean) });
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Work Preferences */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Work Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Willing to Relocate</p>
              <p className="text-sm text-slate-500">Are you open to moving for opportunities?</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.willingToRelocate}
                onChange={(e) => setFormData({ ...formData, willingToRelocate: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Open to Opportunities</p>
              <p className="text-sm text-slate-500">Show your profile to employers and hosts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.openToOpportunities}
                onChange={(e) => setFormData({ ...formData, openToOpportunities: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Work Permit (EU)</p>
              <p className="text-sm text-slate-500">Do you have permission to work in the EU?</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasWorkPermit}
                onChange={(e) => setFormData({ ...formData, hasWorkPermit: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preferred Regions */}
      <div ref={regionsSectionRef} className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Preferred Regions</h3>
        <p className="text-sm text-slate-600 mb-3">Select regions where you'd like to work or live</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {REGIONS.map(region => (
            <button
              key={region}
              onClick={() => toggleRegion(region)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition ${
                formData.preferredRegions.includes(region)
                  ? 'border-sky-500 bg-sky-50 text-sky-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {region.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Profile Visibility</label>
            <select
              value={formData.profileVisibility}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, profileVisibility: value });
                scheduleAutoSave({ profileVisibility: value });
              }}
              className="w-full border border-slate-300 rounded-lg p-3"
            >
              <option value="PUBLIC">Public - Anyone can see your profile</option>
              <option value="SUBSCRIBERS_ONLY">Subscribers Only - Only paid members can see</option>
              <option value="PRIVATE">Private - Only visible to you</option>
            </select>
          </div>

          {/* Contact Privacy Controls */}
          {(user?.emailVerified && user?.phoneVerified) ? (
            <>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">✓ Verified!</span> You can now choose to show your contact information publicly.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Privacy</label>
                <select
                  value={formData.emailPrivacy}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, emailPrivacy: value });
                    scheduleAutoSave({ emailPrivacy: value });
                  }}
                  className="w-full border border-slate-300 rounded-lg p-3"
                >
                  <option value="HIDDEN">Hidden - Not displayed publicly (recommended)</option>
                  <option value="VISIBLE">Visible - Show on contact page</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Privacy</label>
                <select
                  value={formData.phonePrivacy}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, phonePrivacy: value });
                    scheduleAutoSave({ phonePrivacy: value });
                  }}
                  className="w-full border border-slate-300 rounded-lg p-3"
                >
                  <option value="HIDDEN">Hidden - Not displayed publicly (recommended)</option>
                  <option value="VISIBLE">Visible - Show on contact page</option>
                </select>
              </div>
            </>
          ) : (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Contact info is private by default.</span> Verify your email and phone to unlock the option to display your contact information publicly if you choose.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-gradient-to-r from-sky-600 to-amber-600 hover:from-sky-700 hover:to-amber-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
