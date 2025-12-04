"use client";
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, step }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
  >
    <div className="flex items-start gap-4 mb-4">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-sky-100 text-sky-600 text-xl">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
    {step && (
      <div className="inline-block text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-full">
        Step {step}
      </div>
    )}
  </motion.div>
);

export default function FeatureHighlights() {
  const features = [
    {
      icon: '✅',
      title: 'Verified Users',
      description: 'Every user is verified through email, phone, and optional ID verification. Hosts and employers know exactly who they\'re working with.',
    },
    {
      icon: '⭐',
      title: 'Trust Scores',
      description: 'Our algorithmic trust system rewards responsible behavior and helps users build their reputation on the platform.',
    },
    {
      icon: '📝',
      title: 'Smart Agreements',
      description: 'Digital agreements with e-signatures protect both parties. Clear terms, flexible arrangements, dispute resolution built-in.',
    },
    {
      icon: '🌐',
      title: 'Multi-Language',
      description: 'Connect with people worldwide. Real-time translation helps break down language barriers across 50+ languages.',
    },
    {
      icon: '💬',
      title: 'Secure Messaging',
      description: 'Encrypted in-app messaging keeps conversations private. No need to share personal contact info until you\'re ready.',
    },
    {
      icon: '🛡️',
      title: 'Safety First',
      description: 'Report system, blocking features, and community guidelines ensure a safe environment for everyone.',
    },
  ];

  const workflowSteps = [
    {
      icon: '🔍',
      title: 'Find Your Match',
      description: 'Browse verified listings, filter by location, season, and preferences. Preview profiles to find the perfect fit.',
      step: 1,
    },
    {
      icon: '💬',
      title: 'Connect & Chat',
      description: 'Message hosts or employees directly. Ask questions, discuss details, and build trust through conversation.',
      step: 2,
    },
    {
      icon: '📋',
      title: 'Create Agreement',
      description: 'Both parties sign a digital agreement with clear terms, expectations, and responsibilities.',
      step: 3,
    },
    {
      icon: '🚀',
      title: 'Get Started',
      description: 'Begin your seasonal adventure! Stay connected through the platform, share updates, and build your reputation.',
      step: 4,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      {/* Key Features */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
            Why Choose Seasoners?
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            We've built the safest and most transparent platform for seasonal work and housing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
            How It Works
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Four simple steps to find your next seasonal opportunity
          </p>
        </div>

        {/* Desktop Flow */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 mb-12">
          {workflowSteps.map((step, index) => (
            <div key={index} className="relative">
              <FeatureCard {...step} />
              {index < workflowSteps.length - 1 && (
                <div className="absolute top-12 -right-3 text-3xl text-sky-300">→</div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Flow */}
        <div className="md:hidden space-y-4">
          {workflowSteps.map((step, index) => (
            <div key={index} className="relative">
              <FeatureCard {...step} />
              {index < workflowSteps.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="text-2xl text-sky-300">↓</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
