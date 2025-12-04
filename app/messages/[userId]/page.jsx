"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AnimatedPage from "../../../components/AnimatedPage";
import Toast from "../../../components/Toast";
import { motion } from "framer-motion";
import { useLanguage } from "../../../components/LanguageProvider";
import { detectLanguage } from "../../../utils/translation";

// Helper functions for date formatting
const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
};

const formatDateSeparator = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  
  const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  if (daysDiff < 7) return date.toLocaleDateString('en-US', { weekday: 'long' });
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
};

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [recipient, setRecipient] = useState(null);
  const [listing, setListing] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState('');
  const [threadError, setThreadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emailVisible, setEmailVisible] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState(new Map());
  const [translatingId, setTranslatingId] = useState(null);
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastPollTimeRef = useRef(null);

  const listingId = searchParams.get("listingId");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push(`/auth/signin?returnTo=/messages/${params.userId}${listingId ? `?listingId=${listingId}` : ''}`);
      return;
    }
    fetchRecipient();
    if (listingId) fetchListing();
    fetchThread();
    
    // Set up optimized polling for new messages every 15 seconds (reduced from 10)
    // Uses /api/messages/poll endpoint for incremental updates
    pollingIntervalRef.current = setInterval(() => {
      pollNewMessages();
    }, 15000);
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [session, status, params.userId, listingId]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchRecipient = async () => {
    try {
      const response = await fetch(`/api/user/profile/${params.userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user');
      }
      
      setRecipient(data.user);
      
      // Determine if contact info should be visible
      // Email is hidden by default, user can choose to show if email and phone verified
      const isVerified = data.user.emailVerified && data.user.phoneVerified;
      const emailShown = data.user.emailPrivacy === 'VISIBLE' && isVerified;
      const phoneShown = data.user.phonePrivacy === 'VISIBLE' && isVerified;
      
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
      // Listing fetch failed silently
    }
  };

  const fetchThread = async (silent = false) => {
    try {
      if (!silent) setIsRefreshing(true);
      const url = `/api/messages/thread?userId=${params.userId}${listingId ? `&listingId=${listingId}` : ''}`;
      const res = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(Array.isArray(data.messages) ? data.messages : []);
        lastPollTimeRef.current = new Date().toISOString();
        // Trigger navbar unread count update
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('messagesRead'));
        }
      } else {
        if (!silent) setThreadError(data.error || 'Failed to load messages');
      }
    } catch (err) {
      if (!silent) setThreadError('Failed to load messages');
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  const pollNewMessages = async () => {
    // Optimized polling - only fetch messages since last check
    try {
      const since = lastPollTimeRef.current || new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const url = `/api/messages/poll?userId=${params.userId}&since=${encodeURIComponent(since)}&limit=50`;
      const res = await fetch(url, {
        cache: 'no-store',
      });
      
      if (res.status === 429) {
        // Rate limited - back off
        return;
      }

      const data = await res.json();
      if (res.ok && data.messages && data.messages.length > 0) {
        // Append only new messages
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newMessages = data.messages.filter(m => !existingIds.has(m.id));
          return [...prev, ...newMessages];
        });
        lastPollTimeRef.current = data.timestamp;
        
        // Trigger navbar unread count update
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('messagesRead'));
        }
      }
    } catch (err) {
      // Silent fail for polling - don't disrupt UX
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    const optimistic = {
      id: `temp-${Date.now()}`,
      body: input.trim(),
      senderId: session?.user?.id || 'me',
      recipientId: params.userId,
      createdAt: new Date().toISOString(),
      listingId: listingId || null,
      optimistic: true,
    };
    setMessages(prev => [...prev, optimistic]);
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: params.userId, listingId, message: input })
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages(prev => prev.map(m => m.id === optimistic.id ? data.message : m));
      } else {
        setThreadError(data.error || 'Failed to send message');
        setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      }
    } catch (err) {
      setThreadError('Failed to send message');
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    } finally {
      setSending(false);
      setInput('');
      setTimeout(() => {
        fetchThread(true);
        // Trigger navbar unread count update after sending
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('messageSent'));
        }
      }, 500);
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

  const handleTranslate = async (messageId, text) => {
    setTranslatingId(messageId);
    try {
      // Use browser's language preference or user's preferredLanguage
      const targetLang = session?.user?.preferredLanguage || navigator.language.split('-')[0] || 'en';
      
      // Simple translation using browser API (experimental)
      // For production, you'd want to use Google Translate API, DeepL, etc.
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          targetLang,
          sourceLang: detectLanguage(text)
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setTranslatedMessages(prev => new Map(prev).set(messageId, data.translatedText));
      } else {
        // Fallback: show a notice
        setTranslatedMessages(prev => new Map(prev).set(messageId, `[Auto-translate unavailable]`));
      }
    } catch (error) {
      console.error('Translation failed:', error);
      setToast({ message: 'Translation service unavailable', type: 'error' });
    } finally {
      setTranslatingId(null);
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
            {/* Listing Context Banner - Show prominently at top */}
            {listing && (
              <div className="mb-6 p-6 bg-gradient-to-r from-sky-50 to-amber-50 rounded-2xl border border-sky-200">
                <div className="flex items-start gap-4">
                  {listing.photos && listing.photos[0] && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={listing.photos[0]}
                        alt={listing.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-xs text-sky-600 font-semibold uppercase mb-1">Contact About This Listing</p>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">{listing.title}</h2>
                    <p className="text-sm text-slate-600">
                      {listing.type === 'JOB' ? '💼 Job Opportunity' : listing.type === 'FLATSHARE' ? '🏠 Flatshare' : '🏡 Accommodation'} • {listing.location}
                    </p>
                    {listing.price && (
                      <p className="text-sm font-semibold text-slate-700 mt-1">
                        €{listing.price}/month
                      </p>
                    )}
                  </div>
                  <a
                    href={`/listings/${listing.id}`}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    View Listing
                  </a>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                {recipient?.profilePicture ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={recipient.profilePicture}
                      alt={recipient.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
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

              {/* Messages Thread */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">{t('conversation') || t('messagesTitle')}</h2>
                  <button
                    onClick={() => fetchThread(false)}
                    disabled={isRefreshing}
                    className="px-3 py-1.5 text-xs font-medium text-sky-600 hover:bg-sky-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
                {threadError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{threadError}</div>
                )}
                <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1 scroll-smooth">
                  {messages.length === 0 && !threadError && (
                    <div className="p-8 bg-gradient-to-br from-slate-50 to-sky-50 rounded-2xl text-center border-2 border-dashed border-slate-200">
                      <div className="text-4xl mb-3">💬</div>
                      <p className="text-sm font-medium text-slate-700 mb-1">{t('emptyThread')}</p>
                      <p className="text-xs text-slate-500">Send your first message below</p>
                    </div>
                  )}
                  {messages.map((msg, idx) => {
                    const isMine = msg.senderId === (session?.user?.id);
                    const prevMsg = idx > 0 ? messages[idx - 1] : null;
                    const showDateSeparator = !prevMsg || !isSameDay(new Date(prevMsg.createdAt), new Date(msg.createdAt));
                    return (
                      <div key={msg.id}>
                        {showDateSeparator && (
                          <div className="flex items-center justify-center my-4">
                            <span className="px-3 py-1 bg-slate-200 text-slate-600 text-xs font-medium rounded-full">
                              {formatDateSeparator(new Date(msg.createdAt))}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl text-sm shadow-sm border ${isMine ? 'bg-sky-600 text-white border-sky-500' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                            <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                            {translatedMessages.has(msg.id) && (
                              <div className={`mt-2 pt-2 border-t ${isMine ? 'border-sky-400' : 'border-slate-300'}`}>
                                <p className={`text-xs ${isMine ? 'text-sky-100' : 'text-slate-500'} mb-1`}>🌐 Translated:</p>
                                <p className="whitespace-pre-wrap break-words">{translatedMessages.get(msg.id)}</p>
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-1">
                              <p className={`text-[10px] ${isMine ? 'text-sky-100/80' : 'text-slate-500'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{msg.optimistic ? ' …' : ''}
                              </p>
                              {!isMine && !msg.optimistic && !translatedMessages.has(msg.id) && (
                                <button
                                  onClick={() => handleTranslate(msg.id, msg.body)}
                                  disabled={translatingId === msg.id}
                                  className="text-[10px] ml-2 px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 transition disabled:opacity-50"
                                  title="Translate this message"
                                >
                                  {translatingId === msg.id ? '...' : '🌐'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                {/* Message Form */}
                <form onSubmit={handleSend} className="mt-4 flex gap-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={listing ? `${t('contactAboutListing')}: ${listing.title}` : t('messagePlaceholder')}
                    className="flex-1 resize-none h-16 px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className={`px-5 h-16 rounded-xl text-sm font-semibold transition-colors ${sending || !input.trim() ? 'bg-slate-200 text-slate-500' : 'bg-sky-600 text-white hover:bg-sky-700'}`}
                  >
                    {sending ? t('sending') : t('sendMessage')}
                  </button>
                </form>
              </div>

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
