"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";
import { useLanguage } from "../../components/LanguageProvider";
import { useState } from "react";
import Link from "next/link";

export default function Documentation() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: "🚀",
      content: {
        intro: "Welcome to Seasoners! This guide will help you get started on your seasonal adventure.",
        topics: [
          {
            title: "Create Your Account",
            content: "Sign up in seconds using your email or Google account. Complete your profile with a photo and bio to make a great first impression."
          },
          {
            title: "Explore Opportunities",
            content: "Browse jobs and stays by location, dates, and your preferences. Use filters to find exactly what you're looking for."
          },
          {
            title: "Build Your Trust Score",
            content: "Complete verification, respond promptly to messages, and maintain good reviews to increase your Trust Score and unlock more opportunities."
          },
          {
            title: "Make Connections",
            content: "Reach out to hosts or employers directly through the platform. Keep all communication on Seasoners for your safety."
          }
        ]
      }
    },
    {
      id: "hosts",
      title: "For Hosts & Employers",
      icon: "🏠",
      content: {
        intro: "List your property or job opportunity and connect with quality seasonal workers and travelers.",
        topics: [
          {
            title: "Creating Effective Listings",
            content: "Include high-quality photos, detailed descriptions, accurate pricing, and clear expectations. Highlight unique amenities or job benefits. Be specific about dates, requirements, and what makes your opportunity special."
          },
          {
            title: "Screening Applicants",
            content: "Review applicant profiles, Trust Scores, and reviews. Look for verified accounts and positive feedback. Ask relevant questions before confirming bookings."
          },
          {
            title: "Zone Agreements",
            content: "Use digital agreements to formalize arrangements. Include house rules, work expectations, payment terms, and cancellation policies. Both parties sign electronically for legal protection."
          },
          {
            title: "Managing Bookings",
            content: "Respond to inquiries within 24 hours for best results. Update your calendar regularly. Communicate clearly about check-in procedures, expectations, and any changes."
          },
          {
            title: "Building Your Reputation",
            content: "Maintain accurate listings, honor commitments, and provide great experiences. Request reviews from guests to build social proof and attract quality applicants."
          }
        ]
      }
    },
    {
      id: "seekers",
      title: "For Job & Stay Seekers",
      icon: "🌍",
      content: {
        intro: "Find and secure your next seasonal adventure with confidence.",
        topics: [
          {
            title: "Finding the Right Opportunity",
            content: "Use filters to narrow by location, dates, budget, and preferences. Save favorites to compare later. Read reviews and check host/employer Trust Scores before applying."
          },
          {
            title: "Crafting Your Application",
            content: "Personalize each message explaining why you're interested and what you offer. Mention specific details from the listing. Include relevant experience and be professional yet friendly."
          },
          {
            title: "Understanding Agreements",
            content: "Read Zone Agreements carefully before signing. Ensure all terms are clear including dates, payment, cancellation policy, and expectations. Ask questions if anything is unclear."
          },
          {
            title: "Preparing for Arrival",
            content: "Confirm dates, address, and check-in details before traveling. Pack appropriately for the season and location. Have emergency contacts and backup plans ready."
          },
          {
            title: "Making the Most of Your Experience",
            content: "Communicate openly with hosts/employers. Honor commitments and be professional. Immerse yourself in the local culture. Document your experience and leave thoughtful reviews."
          }
        ]
      }
    },
    {
      id: "trust-safety",
      title: "Trust & Safety",
      icon: "🛡️",
      content: {
        intro: "Your safety is our top priority. Learn how we protect our community.",
        topics: [
          {
            title: "Trust Score System",
            content: "Trust Scores (0-100) measure reliability based on verification status, review ratings, response time, and community standing. Higher scores unlock better opportunities and build confidence."
          },
          {
            title: "Account Verification",
            content: "Upload a government ID to become verified. Verified accounts get priority placement, trust badges, and access to premium features. Documents are encrypted and never shared."
          },
          {
            title: "Secure Communication",
            content: "All messages are monitored for suspicious content. Never send money outside the platform. Keep conversations on Seasoners until booking is confirmed."
          },
          {
            title: "Reporting Issues",
            content: "Report inappropriate content, scams, or safety concerns immediately. Click the flag icon or email support@seasoners.eu. All reports are investigated within 24 hours."
          },
          {
            title: "Red Flags to Watch",
            content: "Be cautious of: requests to pay outside the platform, listings with no photos/reviews, overly urgent requests, requests for personal financial info, or pressure to decide quickly."
          },
          {
            title: "Emergency Support",
            content: "For urgent safety issues, contact local authorities first. Then notify Seasoners at support@seasoners.eu with 'URGENT' in the subject line."
          }
        ]
      }
    },
    {
      id: "payments",
      title: "Payments & Billing",
      icon: "💳",
      content: {
        intro: "Understand how payments work on Seasoners.",
        topics: [
          {
            title: "Payment Methods",
            content: "We accept Visa, Mastercard, Amex, and SEPA payments via Stripe. All transactions are encrypted and secure. Payment information is never stored on our servers."
          },
          {
            title: "Founding Member Benefits",
            content: "€30/month or €300/year (save €60). Benefits include: unlimited listings, verification badge, priority search placement, early feature access, dedicated support, and no ads."
          },
          {
            title: "Payment Schedule",
            content: "Monthly subscriptions renew automatically. Annual subscriptions are charged upfront. You'll receive email reminders before renewal. Manage billing in Account Settings."
          },
          {
            title: "Cancellation & Refunds",
            content: "Cancel anytime from Account Settings. Annual plans have 14-day money-back guarantee. Monthly plans are non-refundable but can be canceled to prevent future charges."
          },
          {
            title: "Direct Payments Between Users",
            content: "Seasoners doesn't process booking payments between hosts and guests. Arrange payment details directly (bank transfer, PayPal, etc.). Always use secure methods and document agreements."
          }
        ]
      }
    },
    {
      id: "features",
      title: "Platform Features",
      icon: "⚡",
      content: {
        intro: "Discover everything Seasoners has to offer.",
        topics: [
          {
            title: "Advanced Search & Filters",
            content: "Filter by location, dates, price, amenities, job type, accommodation type, and more. Save searches to get notifications for new matching listings."
          },
          {
            title: "Favorites & Collections",
            content: "Save listings to your favorites for easy access. Organize opportunities into custom collections for different trips or seasons."
          },
          {
            title: "Messaging System",
            content: "Communicate directly with hosts and seekers. Receive email notifications for new messages. Access conversation history anytime from your dashboard."
          },
          {
            title: "Zone Agreements",
            content: "Create, sign, and manage digital agreements. Templates available for stays and jobs. Both parties receive copies. Legally binding and securely stored."
          },
          {
            title: "Reviews & Ratings",
            content: "Leave reviews after experiences. Rate cleanliness, accuracy, communication, and value. Reviews build trust and help others make informed decisions."
          },
          {
            title: "Profile Customization",
            content: "Add photos, bio, languages, skills, and interests. Verified badges and Trust Scores display automatically. Showcase your best self to the community."
          }
        ]
      }
    },
    {
      id: "community",
      title: "Community Guidelines",
      icon: "🤝",
      content: {
        intro: "Be part of a respectful, supportive global community.",
        topics: [
          {
            title: "Respect & Inclusion",
            content: "Treat everyone with dignity regardless of background, nationality, religion, or identity. Discrimination and hate speech are strictly prohibited and result in immediate removal."
          },
          {
            title: "Honest Representation",
            content: "Provide accurate information in listings and profiles. Use real photos and truthful descriptions. Misrepresentation damages trust and may result in account suspension."
          },
          {
            title: "Communication Standards",
            content: "Respond to inquiries within 24-48 hours. Be professional and courteous. If plans change, communicate promptly. Good communication builds strong relationships."
          },
          {
            title: "Commitment to Agreements",
            content: "Honor your commitments once confirmed. Cancellations affect Trust Scores and future opportunities. If emergencies arise, communicate immediately and work toward fair resolutions."
          },
          {
            title: "Prohibited Activities",
            content: "No scams, fraud, harassment, spam, or illegal activities. No listing properties you don't own/manage. No discriminatory practices. Violations result in permanent bans."
          },
          {
            title: "Giving Back",
            content: "Share experiences, leave thoughtful reviews, and help newcomers. Contribute to forum discussions. Report issues to keep the community safe. Together we build something special."
          }
        ]
      }
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: "🔧",
      content: {
        intro: "Troubleshoot common technical issues.",
        topics: [
          {
            title: "Account Access Issues",
            content: "Forgot password? Use 'Forgot Password' on login page. Not receiving emails? Check spam folder and add noreply@seasoners.eu to contacts. Still stuck? Contact support."
          },
          {
            title: "Browser Compatibility",
            content: "Seasoners works best on Chrome, Firefox, Safari, and Edge (latest versions). Clear browser cache if experiencing issues. Disable ad blockers if pages aren't loading correctly."
          },
          {
            title: "Mobile Experience",
            content: "Seasoners is fully responsive on mobile devices. For best experience, use portrait mode on phones. Native apps coming soon!"
          },
          {
            title: "Upload Issues",
            content: "Supported formats: JPG, PNG, WEBP (max 10MB). If uploads fail, try resizing images or different file formats. Check your internet connection."
          },
          {
            title: "Performance Problems",
            content: "Slow loading? Clear cache and cookies. Try different browser. Check internet connection. Report persistent issues to support@seasoners.eu with details."
          }
        ]
      }
    }
  ];

  const activeContent = sections.find(s => s.id === activeSection);

  return (
    <main>
      <Navbar />
      <AnimatedPage>
        {/* Header */}
        <section className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-5xl font-extrabold mb-4">Documentation</h1>
              <p className="text-xl text-sky-100">
                Everything you need to know about using Seasoners
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-64 flex-shrink-0"
            >
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 sticky top-4">
                <h3 className="font-bold text-slate-700 mb-4 px-2">Contents</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        activeSection === section.id
                          ? "bg-sky-100 text-sky-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-lg">{section.icon}</span>
                      <span className="text-sm">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.aside>

            {/* Main Content */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{activeContent.icon}</span>
                  <h2 className="text-3xl font-bold text-slate-800">
                    {activeContent.title}
                  </h2>
                </div>

                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  {activeContent.content.intro}
                </p>

                <div className="space-y-8">
                  {activeContent.content.topics.map((topic, idx) => (
                    <div key={idx} className="border-l-4 border-sky-300 pl-6">
                      <h3 className="text-xl font-semibold text-slate-800 mb-3">
                        {topic.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {topic.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <div className="flex items-start gap-4">
                  <svg className="w-8 h-8 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Can't find what you're looking for?
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Check our FAQ or reach out to our support team
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/help"
                        className="px-4 py-2 bg-white text-sky-600 rounded-lg font-medium hover:bg-sky-50 transition-colors border border-sky-200"
                      >
                        View FAQ
                      </Link>
                      <a
                        href="mailto:support@seasoners.eu"
                        className="px-4 py-2 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors"
                      >
                        Contact Support
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </AnimatedPage>
      <Footer />
    </main>
  );
}
