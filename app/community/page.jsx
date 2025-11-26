"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";
import { useLanguage } from "../../components/LanguageProvider";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CommunityForum() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", icon: "🌍", count: 247 },
    { id: "destinations", name: "Destinations", icon: "📍", count: 89 },
    { id: "tips", name: "Tips & Advice", icon: "💡", count: 64 },
    { id: "experiences", name: "Experiences", icon: "✨", count: 53 },
    { id: "jobs", name: "Job Talk", icon: "💼", count: 31 },
    { id: "support", name: "Support", icon: "🆘", count: 10 }
  ];

  const discussions = [
    {
      id: 1,
      category: "destinations",
      title: "Best ski resorts in Austria for seasonal workers?",
      author: "Anna M.",
      authorVerified: true,
      replies: 23,
      views: 450,
      lastActivity: "2 hours ago",
      trending: true,
      excerpt: "Looking for recommendations on which Austrian ski resorts offer the best experience for seasonal hospitality workers..."
    },
    {
      id: 2,
      category: "tips",
      title: "How to increase your Trust Score quickly",
      author: "Marco P.",
      authorVerified: true,
      replies: 47,
      views: 892,
      lastActivity: "5 hours ago",
      pinned: true,
      excerpt: "Here are my top tips for building trust and getting verified fast..."
    },
    {
      id: 3,
      category: "experiences",
      title: "My 6 months in Innsbruck - AMA",
      author: "Sarah K.",
      authorVerified: true,
      replies: 31,
      views: 567,
      lastActivity: "1 day ago",
      trending: true,
      excerpt: "Just finished an amazing winter season working at a hotel in Innsbruck. Ask me anything!"
    },
    {
      id: 4,
      category: "jobs",
      title: "What to expect: Hotel receptionist positions",
      author: "Luis R.",
      authorVerified: false,
      replies: 15,
      views: 234,
      lastActivity: "1 day ago",
      excerpt: "Sharing my experience working hotel reception during ski season..."
    },
    {
      id: 5,
      category: "tips",
      title: "Packing list for winter season work",
      author: "Emma L.",
      authorVerified: true,
      replies: 19,
      views: 378,
      lastActivity: "2 days ago",
      excerpt: "Essential items you'll need for working in Austrian ski resorts..."
    },
    {
      id: 6,
      category: "destinations",
      title: "Vienna vs Salzburg for summer work?",
      author: "Tom B.",
      authorVerified: false,
      replies: 12,
      views: 289,
      lastActivity: "3 days ago",
      excerpt: "Trying to decide between these two cities for summer season..."
    },
    {
      id: 7,
      category: "experiences",
      title: "Made lifelong friends working at Kitzbühel",
      author: "Julia F.",
      authorVerified: true,
      replies: 8,
      views: 156,
      lastActivity: "4 days ago",
      excerpt: "The community aspect of seasonal work is incredible..."
    },
    {
      id: 8,
      category: "support",
      title: "How to handle difficult guests professionally",
      author: "David M.",
      authorVerified: true,
      replies: 24,
      views: 412,
      lastActivity: "5 days ago",
      excerpt: "Looking for advice on managing challenging customer situations..."
    }
  ];

  const filteredDiscussions = selectedCategory === "all" 
    ? discussions 
    : discussions.filter(d => d.category === selectedCategory);

  const stats = [
    { label: "Active Members", value: "1,247", icon: "👥" },
    { label: "Discussions", value: "247", icon: "💬" },
    { label: "Countries", value: "28", icon: "🌍" },
    { label: "This Week", value: "+34", icon: "📈" }
  ];

  return (
    <main>
      <Navbar />
      <AnimatedPage>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-5xl font-extrabold mb-4">Community Forum</h1>
              <p className="text-xl text-purple-100 mb-8">
                Connect with seasonal workers and hosts from around the world
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-purple-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-64 flex-shrink-0"
            >
              {/* New Discussion Button */}
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-xl p-6 mb-6 text-center shadow-lg">
                <h3 className="font-bold text-lg mb-3">Start a Discussion</h3>
                <p className="text-sm text-sky-100 mb-4">
                  Share your story or ask the community
                </p>
                {session ? (
                  <button className="w-full px-4 py-2 bg-white text-sky-600 rounded-lg font-semibold hover:bg-sky-50 transition-colors">
                    ✏️ New Post
                  </button>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="block w-full px-4 py-2 bg-white text-sky-600 rounded-lg font-semibold hover:bg-sky-50 transition-colors"
                  >
                    Sign In to Post
                  </Link>
                )}
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4">
                <h3 className="font-bold text-slate-700 mb-4">Categories</h3>
                <nav className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? "bg-purple-100 text-purple-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span className="text-sm">{cat.name}</span>
                      </span>
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Community Guidelines */}
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">📋</span>
                  <div>
                    <h4 className="font-semibold text-amber-900 text-sm mb-1">
                      Community Guidelines
                    </h4>
                    <p className="text-xs text-amber-800 mb-2">
                      Be respectful, helpful, and authentic
                    </p>
                    <Link
                      href="/docs"
                      className="text-xs text-amber-700 hover:text-amber-900 underline"
                    >
                      Read full guidelines →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Discussions List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  {categories.find(c => c.id === selectedCategory)?.name || "All Topics"}
                </h2>
                <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Latest Activity</option>
                  <option>Most Popular</option>
                  <option>Most Replies</option>
                  <option>Newest</option>
                </select>
              </div>

              {/* Discussions */}
              <div className="space-y-4">
                {filteredDiscussions.map((discussion, idx) => (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0 flex items-center justify-center text-white font-bold">
                        {discussion.author[0]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {discussion.pinned && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">
                              📌 Pinned
                            </span>
                          )}
                          {discussion.trending && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                              🔥 Trending
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                            {categories.find(c => c.id === discussion.category)?.icon}{" "}
                            {categories.find(c => c.id === discussion.category)?.name}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-800 mb-2 hover:text-purple-600 transition-colors">
                          {discussion.title}
                        </h3>

                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {discussion.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              {discussion.author}
                              {discussion.authorVerified && (
                                <span className="text-sky-500">✓</span>
                              )}
                            </span>
                            <span>💬 {discussion.replies}</span>
                            <span>👁️ {discussion.views}</span>
                          </div>
                          <span className="text-xs">{discussion.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <div className="mt-8 text-center">
                <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                  Load More Discussions
                </button>
              </div>

              {/* Coming Soon Notice */}
              <div className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Full Forum Coming Soon!
                </h3>
                <p className="text-slate-600 mb-4">
                  We're building an amazing community space with profiles, notifications,
                  threads, reactions, and more. Stay tuned!
                </p>
                <p className="text-sm text-slate-500">
                  For now, join the conversation via{" "}
                  <a href="mailto:hello@seasoners.eu" className="text-purple-600 hover:underline">
                    email
                  </a>
                  {" "}or connect with us on social media.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </AnimatedPage>
      <Footer />
    </main>
  );
}
