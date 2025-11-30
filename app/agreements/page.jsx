'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AgreementSignModal from '../../components/AgreementSignModal';
import { downloadAgreementPDF } from '../../utils/pdf-generator';

/**
 * Agreements dashboard page
 * Lists all agreements for the authenticated user
 */
export default function AgreementsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, host, guest
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAgreements();
    }
  }, [status, filter, statusFilter]);

  const fetchAgreements = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('role', filter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/agreements?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAgreements(data);
      }
    } catch (error) {
      // Error fetching agreements
    } finally {
      setLoading(false);
    }
  };

  const openAgreementModal = async (agreementId) => {
    try {
      const response = await fetch(`/api/agreements/${agreementId}`);
      if (response.ok) {
        const agreement = await response.json();
        setSelectedAgreement(agreement);
        setIsModalOpen(true);
      }
    } catch (error) {
      // Error fetching agreement
    }
  };

  const handleSign = async (updatedAgreement) => {
    // Refresh agreements list
    await fetchAgreements();
  };

  const getStatusBadge = (status) => {
    const badges = {
      DRAFT: { color: 'bg-gray-100 text-gray-700', icon: '⏱️', label: 'Draft' },
      PENDING_HOST: { color: 'bg-amber-100 text-amber-700', icon: '⏱️', label: 'Pending Host' },
      PENDING_GUEST: { color: 'bg-amber-100 text-amber-700', icon: '⏱️', label: 'Pending Guest' },
      FULLY_SIGNED: { color: 'bg-emerald-100 text-emerald-700', icon: '✓', label: 'Signed' },
      ACTIVE: { color: 'bg-sky-100 text-sky-700', icon: '✓', label: 'Active' },
      COMPLETED: { color: 'bg-emerald-100 text-emerald-700', icon: '✓', label: 'Completed' },
      CANCELLED: { color: 'bg-gray-100 text-gray-700', icon: '✕', label: 'Cancelled' },
      DISPUTED: { color: 'bg-red-100 text-red-700', icon: '⚠️', label: 'Disputed' },
    };

    const badge = badges[status] || badges.DRAFT;

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <span>{badge.icon}</span>
        <span>{badge.label}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading agreements...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Agreements</h1>
            <p className="text-gray-600">
              View and manage your Smart Stay Agreements with hosts and guests
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div className="flex space-x-2">
                {['all', 'host', 'guest'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setFilter(role)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === role
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING_HOST">Pending Host</option>
                <option value="PENDING_GUEST">Pending Guest</option>
                <option value="FULLY_SIGNED">Signed</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="DISPUTED">Disputed</option>
              </select>
            </div>
          </div>

          {/* Agreements List */}
          {agreements.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <span className="text-6xl">📄</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">No agreements found</h3>
              <p className="text-gray-600">
                {filter === 'all'
                  ? "You haven't created or received any agreements yet."
                  : `You don't have any agreements as ${filter}.`}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {agreements.map((agreement) => {
                const isHost = agreement.host.id === session?.user?.id;
                const otherParty = isHost ? agreement.guest : agreement.host;
                const needsMySignature =
                  (isHost && agreement.status === 'PENDING_HOST') ||
                  (!isHost && agreement.status === 'PENDING_GUEST') ||
                  agreement.status === 'DRAFT';

                return (
                  <div
                    key={agreement.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div 
                      className="cursor-pointer"
                      onClick={() => openAgreementModal(agreement.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {agreement.listing.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {agreement.listing.location || `${agreement.listing.city}, ${agreement.listing.region}`}
                          </p>
                        </div>
                        {getStatusBadge(agreement.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <span>👤</span>
                          <div>
                            <p className="text-xs text-gray-500">
                              {isHost ? 'Guest' : 'Host'}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {otherParty.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>📅</span>
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(agreement.startDate)} - {formatDate(agreement.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {needsMySignature && (
                        <div className="flex items-center space-x-2 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <span className="flex-shrink-0">⚠️</span>
                          <p className="text-sm text-amber-700 font-medium">
                            Action required: Your signature is needed
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Download PDF Button for Fully Signed Agreements */}
                    {agreement.status === 'FULLY_SIGNED' || agreement.status === 'ACTIVE' || agreement.status === 'COMPLETED' ? (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadAgreementPDF(agreement);
                          }}
                          className="w-full px-4 py-2 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
                        >
                          <span>📄</span>
                          <span>Download PDF</span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Sign Modal */}
      <AgreementSignModal
        agreement={selectedAgreement}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAgreement(null);
        }}
        onSign={handleSign}
      />
    </div>
  );
}
