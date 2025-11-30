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

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push('/auth/signin?returnTo=/messages');
      return;
    }
    
    fetchInbox();
  }, [session, status, router]);

  const fetchInbox = async () => {
    try {
      const res = await fetch('/api/messages/inbox');
      const data = await res.json();
      if (res.ok) {
        setConversations(Array.isArray(data.conversations) ? data.conversations : []);
      } else {
        setError(data.error || 'Failed to load inbox');
      }
    } catch (err) {
      setError('Failed to load inbox');
    } finally {
      setLoading(false);
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
            <h1 className="text-4xl font-bold text-sky-900 mb-2">{t('messagesTitle')}</h1>
            <p className="text-slate-600 mb-8">{t('messagesSubtitle')}</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
            )}
            {conversations.length === 0 && !error ? (
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-12 text-center">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">{t('noMessagesYet') || t('emptyThread')}</h2>
                <p className="text-slate-600 mb-6">{t('startConversationPrompt') || t('messagesSubtitle')}</p>
                <div className="flex gap-4 justify-center">
                  <a
                    href="/stays"
                    className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors"
                  >
                    {t('browseStays')}
                  </a>
                  <a
                    href="/jobs"
                    className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    {t('findJobs')}
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
