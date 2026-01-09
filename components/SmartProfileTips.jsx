"use client";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const tips = [
  {
    icon: '',
    title: 'Profile Picture Impact',
    description: 'Users with profile pictures are 3x more likely to receive messages.',
    field: 'profilePicture',
  },
  {
    icon: '',
    title: 'Email Verification Matters',
    description: 'Verify your email to build trust and unlock messaging features.',
    field: 'emailVerified',
  },
  {
    icon: '',
    title: 'Phone Verification',
    description: 'Add your phone number to get access to premium features.',
    field: 'phoneVerified',
  },
  {
    icon: '',
    title: 'Write a Compelling Bio',
    description: 'A 50+ character bio helps others understand who you are. Be authentic!',
    field: 'aboutMe',
  },
  {
    icon: '',
    title: 'Language Skills',
    description: 'List languages you speak to connect with more people.',
    field: 'spokenLanguages',
  },
  {
    icon: '',
    title: 'Showcase Your Skills',
    description: 'Professional skills help hosts/employers evaluate compatibility.',
    field: 'skills',
  },
  {
    icon: '',
    title: 'Share Your Interests',
    description: 'Interests help find people with similar passions for better matches.',
    field: 'interests',
  },
  {
    icon: '',
    title: 'Mark Preferred Regions',
    description: 'Help others know where you want to live or work.',
    field: 'preferredRegions',
  },
];

export default function SmartProfileTips({ user, currentField }) {
  const [visibleTips, setVisibleTips] = useState([]);
  const [dismissedTips, setDismissedTips] = useState(new Set());

  useEffect(() => {
    // Show relevant tips based on what's incomplete
    const relevantTips = tips.filter(tip => {
      // Don't show tips for completed fields
      const isCompleted = getFieldCompletion(tip.field, user);
      return !isCompleted && !dismissedTips.has(tip.field);
    });

    // Show max 2 tips at a time
    setVisibleTips(relevantTips.slice(0, 2));
  }, [user, dismissedTips]);

  const getFieldCompletion = (field, user) => {
    switch (field) {
      case 'profilePicture':
        return !!user?.profilePicture;
      case 'emailVerified':
        return !!user?.emailVerified;
      case 'phoneVerified':
        return !!user?.phoneVerified;
      case 'aboutMe':
        return !!user?.aboutMe && user.aboutMe.length >= 50;
      case 'spokenLanguages':
        return !!user?.spokenLanguages && user.spokenLanguages.length > 0;
      case 'skills':
        return !!user?.skills && user.skills.length > 0;
      case 'interests':
        return !!user?.interests && user.interests.length > 0;
      case 'preferredRegions':
        return !!user?.preferredRegions && user.preferredRegions.length > 0;
      default:
        return false;
    }
  };

  const handleDismiss = (field) => {
    setDismissedTips(prev => new Set([...prev, field]));
  };

  if (visibleTips.length === 0) return null;

  return (
    <div className="space-y-3">
      {visibleTips.map((tip, index) => (
        <motion.div
          key={tip.field}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-4 rounded-lg flex items-start gap-3"
        >
          <div className="text-2xl flex-shrink-0">{tip.icon}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 text-sm mb-1">{tip.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{tip.description}</p>
          </div>
          <button
            onClick={() => handleDismiss(tip.field)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </motion.div>
      ))}
    </div>
  );
}
