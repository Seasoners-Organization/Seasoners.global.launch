"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";
import { useLanguage } from "../../components/LanguageProvider";

export default function MessagesInbox() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push('/auth/signin?returnTo=/messages');
      return;
    }
    
    fetchInbox();
  }, [session, status, router]);

  const fetchInbox = async (silent = false) => {
    try {
      if (!silent) setIsRefreshing(true);
      const res = await fetch('/api/messages/inbox', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });
      const data = await res.json();
      if (res.ok) {
        setConversations(Array.isArray(data.conversations) ? data.conversations : []);
      } else {
        if (!silent) setError(data.error || 'Failed to load inbox');
      }
    } catch (err) {
      if (!silent) setError('Failed to load inbox');
    } finally {
      setLoading(false);
      if (!silent) setIsRefreshing(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading messages...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <AnimatedPage>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-sky-900 mb-2">{t('messagesTitle')}</h1>
                <p className="text-slate-600">{t('messagesSubtitle')}</p>
              </div>
              <button
                onClick={() => fetchInbox(false)}
                disabled={isRefreshing}
                className="px-4 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
            )}
            {conversations.length === 0 && !error ? (
              <div className="bg-gradient-to-br from-white via-sky-50 to-amber-50 rounded-2xl shadow-lg border-2 border-slate-200 p-16 text-center">
                <div className="text-7xl mb-6">💬</div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">{t('noMessagesYet') || 'No messages yet'}</h2>
                <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">{t('startConversationPrompt') || 'Start connecting with hosts and employers to find your next adventure!'}</p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <a
                    href="/stays"
                    className="px-8 py-4 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-xl font-bold hover:from-sky-700 hover:to-sky-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                  >
                    <span>🏡</span>
                    {t('browseStays') || 'Browse Stays'}
                  </a>
                  <a
                    href="/jobs"
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                  >
                    <span>💼</span>
                    {t('findJobs') || 'Find Jobs'}
                  </a>
                </div>
              </div>
            ) : conversations.length > 0 ? (
              <div className="space-y-4">
                {conversations.map((conv, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col gap-2"
                    onClick={() => router.push(`/messages/${conv.userId}${conv.listingId ? `?listingId=${conv.listingId}` : ''}`)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-sky-600 flex items-center justify-center text-white font-semibold">
                        {conv.userId.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">{conv.listing ? conv.listing.title : (t('conversation') || t('messagesTitle'))}</h3>
                        <p className="text-xs text-slate-500 mb-2">{t('lastMessage') || 'Last message'} • {new Date(conv.lastSentAt).toLocaleString()}</p>
                        <p className="text-sm text-slate-600 line-clamp-2">{conv.lastMessage}</p>
                        {conv.listing && (
                          <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">{conv.listing.type}</span>
                        )}
                        {conv.unreadCount > 0 && (
                          <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            {conv.unreadCount} unread
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </motion.div>
        </div>
      </AnimatedPage>
      <Footer />
    </main>
  );
}
