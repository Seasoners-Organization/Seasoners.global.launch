"use client";
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

const FeatureCard = ({ icon, title, description, step }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex-1 mb-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
    {step && (
      <div className="inline-block text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-full">
        Step {step}
      </div>
    )}
  </motion.div>
);

export default function FeatureHighlights() {
  const { t } = useLanguage();
  const features = [
    {
      icon: '',
      titleKey: 'featureVerifiedUsersTitle',
      descKey: 'featureVerifiedUsersDesc',
    },
    {
      icon: '',
      titleKey: 'featureReputationTitle',
      descKey: 'featureReputationDesc',
    },
    {
      icon: '',
      titleKey: 'featureAgreementsTitle',
      descKey: 'featureAgreementsDesc',
    },
    {
      icon: '',
      titleKey: 'featureCommunicationTitle',
      descKey: 'featureCommunicationDesc',
    },
    {
      icon: '',
      titleKey: 'featureMessagingTitle',
      descKey: 'featureMessagingDesc',
    },
    {
      icon: '',
      titleKey: 'featureSafetyTitle',
      descKey: 'featureSafetyDesc',
    },
  ];

  const workflowSteps = [
    {
      icon: '',
      titleKey: 'workflowDiscoverTitle',
      descKey: 'workflowDiscoverDesc',
      step: 1,
    },
    {
      icon: '',
      titleKey: 'workflowConnectTitle',
      descKey: 'workflowConnectDesc',
      step: 2,
    },
    {
      icon: '',
      titleKey: 'workflowSignTitle',
      descKey: 'workflowSignDesc',
      step: 3,
    },
    {
      icon: '',
      titleKey: 'workflowStartTitle',
      descKey: 'workflowStartDesc',
      step: 4,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      {/* Key Features */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
            {t('featureSectionTitle')}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {t('featureSectionDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={t(feature.titleKey)} description={t(feature.descKey)} />
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {t('howItWorksDesc')}
          </p>
        </div>

        {/* Desktop Flow */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 mb-12">
          {workflowSteps.map((step, index) => (
            <div key={index} className="relative">
              <FeatureCard icon={step.icon} title={t(step.titleKey)} description={t(step.descKey)} step={step.step} />
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
              <FeatureCard icon={step.icon} title={t(step.titleKey)} description={t(step.descKey)} step={step.step} />
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
