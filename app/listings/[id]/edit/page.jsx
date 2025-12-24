"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import { useLanguage } from "../../../../components/LanguageProvider";

export default function EditListing() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const listingId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/signin?returnTo=/listings/${listingId}/edit`);
    }
  }, [status, listingId, router]);

  useEffect(() => {
    if (listingId && status === "authenticated") {
      fetchListing();
    }
  }, [listingId, status]);

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/${listingId}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to load listing");
      }

      setListing(data);
      setFormData({
        title: data.title || "",
        description: data.description || "",
        price: data.price?.toString() || "",
        city: data.city || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update listing");
      }

      setSuccess("Listing updated successfully!");
      setTimeout(() => {
        router.push(`/listings/${listingId}`);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (status === "loading" || loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error && !listing) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push("/profile")}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              Back to Profile
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="max-w-3xl mx-auto px-6 py-16 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-sky-900 mb-2">
            {t('editListing') || 'Edit Listing'}
          </h1>
          <p className="text-slate-700">
            Update your listing details
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              {t('title') || 'Title'}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Enter listing title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              {t('description') || 'Description'}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Describe your listing"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              {t('priceLabel') || 'Price (€/month)'}
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              {t('city') || 'City/Location'}
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Enter city or location"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-sky-600 to-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-sky-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {saving ? t('saving') || 'Saving...' : t('saveChanges') || 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/listings/${listingId}`)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              {t('cancel') || 'Cancel'}
            </button>
          </div>
        </form>
      </section>
      <Footer />
    </main>
  );
}
