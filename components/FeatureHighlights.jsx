"use client";
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, step }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
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
      icon: '',
      title: 'Verified Users',
      description: 'Every user is verified through email, phone, and optional ID verification. Hosts and employers know exactly who they\'re working with.',
    },
    {
      icon: '',
      title: 'Verified Reputation',
      description: 'Every interaction builds reputation. Users with excellent ratings and verified status stand out. Trust is earned through consistent, positive behavior.',
    },
    {
      icon: '',
      title: 'Legally Clear Agreements',
      description: 'Dual-language agreements with digital signatures protect both parties. Clear terms, flexible terms, and transparent dispute resolution.',
    },
    {
      icon: '',
      title: 'Global Communication',
      description: 'Connect with people worldwide. Real-time translation removes language barriers so everyone can communicate clearly across 50+ languages.',
    },
    {
      icon: '',
      title: 'Private & Secure Messaging',
      description: 'Encrypted in-app messaging ensures your conversations stay private and secure. No need to share personal details until you\'re comfortable.',
    },
    {
      icon: '',
      title: 'Community Safety Standards',
      description: 'Reporting, blocking, and community guidelines create a safe space for everyone. We enforce standards consistently across all interactions.',
    },
  ];

  const workflowSteps = [
    {
      icon: '',
      title: 'Discover Verified Opportunities',
      description: 'Browse verified listings and profiles. Filter by location, season, and requirements. Preview comprehensive host and employer profiles.',
      step: 1,
    },
    {
      icon: '',
      title: 'Connect with Confidence',
      description: 'Use secure in-app messaging to ask questions and discuss details. Build trust through real conversation before making any commitment.',
      step: 2,
    },
    {
      icon: '',
      title: 'Sign a Clear Agreement',
      description: 'Both parties review and sign a transparent, dual-language agreement with clear terms and legal protections.',
      step: 3,
    },
    {
      icon: '',
      title: 'Start Your Experience',
      description: 'Begin your seasonal journey with confidence. Stay connected through Seasoners, build your verified reputation, and unlock future opportunities.',
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
