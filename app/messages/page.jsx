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

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push('/auth/signin?returnTo=/messages');
      return;
    }
    
    // In the future, fetch real conversations from API
    // For now, show placeholder
    setLoading(false);
  }, [session, status, router]);

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
            <h1 className="text-4xl font-bold text-sky-900 mb-2">Messages</h1>
            <p className="text-slate-600 mb-8">
              Your conversations with hosts and employers
            </p>

            {conversations.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-12 text-center">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                  No messages yet
                </h2>
                <p className="text-slate-600 mb-6">
                  When you contact hosts or employers, your conversations will appear here
                </p>
                <div className="flex gap-4 justify-center">
                  <a
                    href="/stays"
                    className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors"
                  >
                    Browse Stays
                  </a>
                  <a
                    href="/jobs"
                    className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Find Jobs
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((conv, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(`/messages/${conv.userId}`)}
                  >
                    {/* Conversation preview - to be implemented */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-sky-600 flex items-center justify-center text-white font-semibold">
                        {conv.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{conv.name}</h3>
                        <p className="text-sm text-slate-600">{conv.lastMessage}</p>
                      </div>
                      <div className="text-xs text-slate-500">{conv.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </AnimatedPage>
      <Footer />
    </main>
  );
}
