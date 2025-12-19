"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnimatedPage from "../../components/AnimatedPage";
import { motion } from "framer-motion";

export default function Contact() {
  const contactEmails = [
    {
      title: "General Inquiries",
      email: "hello@seasoners.eu",
      icon: "👋",
      description: "Questions about Seasoners, partnerships, or general information",
      color: "blue"
    },
    {
      title: "Customer Support",
      email: "support@seasoners.eu",
      icon: "💬",
      description: "Account issues, technical problems, or assistance with using the platform",
      color: "green"
    },
    {
      title: "Safety & Trust",
      email: "safety@seasoners.eu",
      icon: "🔒",
      description: "Report suspicious activity, safety concerns, or trust & safety issues",
      color: "red"
    },
    {
      title: "Billing & Payments",
      email: "billing@seasoners.eu",
      icon: "💰",
      description: "Subscription issues, payment problems, or invoice requests",
      color: "purple"
    },
    {
      title: "Founder",
      email: "tremayne@seasoners.eu",
      icon: "🚀",
      description: "Direct line to the founder for feedback, suggestions, or important matters",
      color: "orange"
    },
    {
      title: "Press & Media",
      email: "press@seasoners.eu",
      icon: "📰",
      description: "Media inquiries, press releases, or interview requests",
      color: "indigo"
    }
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700"
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      button: "bg-green-600 hover:bg-green-700"
    },
    red: {
      bg: "bg-red-50",
      icon: "text-red-600",
      button: "bg-red-600 hover:bg-red-700"
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      button: "bg-purple-600 hover:bg-purple-700"
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      button: "bg-orange-600 hover:bg-orange-700"
    },
    indigo: {
      bg: "bg-indigo-50",
      icon: "text-indigo-600",
      button: "bg-indigo-600 hover:bg-indigo-700"
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <Navbar />
        
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're here to help. Choose the department that best matches your needs.
              </p>
            </motion.div>

            {/* Contact Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {contactEmails.map((contact, index) => {
                const colors = colorClasses[contact.color];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${colors.bg} rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow`}
                  >
                    <div className={`text-5xl mb-4 ${colors.icon}`}>
                      {contact.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {contact.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 min-h-[3rem]">
                      {contact.description}
                    </p>
                    <a
                      href={`mailto:${contact.email}`}
                      className={`block w-full text-center ${colors.button} text-white py-2 px-4 rounded-lg transition font-medium`}
                    >
                      {contact.email}
                    </a>
                  </motion.div>
                );
              })}
            </div>

            {/* Response Time Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-lg shadow-md p-8 mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                ⏱️ Response Times
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    2 hours
                  </div>
                  <p className="text-gray-600">Safety Issues</p>
                  <p className="text-sm text-gray-500">Priority response</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    24 hours
                  </div>
                  <p className="text-gray-600">Support & Billing</p>
                  <p className="text-sm text-gray-500">Business days</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    48 hours
                  </div>
                  <p className="text-gray-600">General Inquiries</p>
                  <p className="text-sm text-gray-500">All inquiries</p>
                </div>
              </div>
            </motion.div>

            {/* Office Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    📍 Headquarters
                  </h3>
                  <p className="text-gray-700 mb-2">Seasoners</p>
                  <p className="text-gray-600">Vienna, Austria</p>
                  <p className="text-gray-600">European Union</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    🌐 Other Channels
                  </h3>
                  <div className="space-y-2">
                    <a 
                      href="/help" 
                      className="block text-blue-600 hover:text-blue-700 transition"
                    >
                      → Help Center & FAQs
                    </a>
                    <a 
                      href="/help/safety" 
                      className="block text-blue-600 hover:text-blue-700 transition"
                    >
                      → Safety Resources
                    </a>
                    <a 
                      href="/about" 
                      className="block text-blue-600 hover:text-blue-700 transition"
                    >
                      → About Seasoners
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Emergency Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8 bg-red-50 border-l-4 border-red-600 rounded-lg p-6"
            >
              <div className="flex items-start">
                <span className="text-3xl mr-4">🚨</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Emergency Situations
                  </h3>
                  <p className="text-gray-700 mb-2">
                    If you are in immediate danger, contact local emergency services first:
                  </p>
                  <p className="text-gray-700">
                    <strong>Austria:</strong> Police 133 | Ambulance 144 | EU Emergency 112
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Then contact <a href="mailto:safety@seasoners.eu" className="text-red-600 hover:underline font-semibold">safety@seasoners.eu</a> to report the incident
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedPage>
  );
}
