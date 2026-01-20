"use client";
import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';

export default function ProfileCompletionPrompt({ user, onDismiss }) {
  const { t } = useLanguage();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Calculate profile completion in real-time
    let completed = 0;
    const fields = [
      { key: 'name', weight: 15 },
      { key: 'email', weight: 15 },
      { key: 'image', weight: 10 },
      { key: 'bio', weight: 10 },
      { key: 'phoneVerified', weight: 15 },
      { key: 'identityVerified', weight: 20 },
      { key: 'city', weight: 5 },
      { key: 'country', weight: 5 },
    ];

    let total = 0;
    fields.forEach(field => {
      total += field.weight;
      if (user[field.key]) {
        completed += field.weight;
      }
    });

    const percentage = Math.round((completed / total) * 100);
    setCompletionPercentage(percentage);
    setShow(percentage < 100 && percentage > 0); // Show if between 1-99%
  }, [user]);

  if (!show) return null;

  const remainingItems = 100 - completionPercentage;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-xl border border-sky-200 p-4 z-40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">
            Profile {completionPercentage}% Complete
          </h4>
          <p className="text-xs text-gray-600 mb-3">
            Complete {remainingItems}% more to unlock full featured access
          </p>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <a
            href="/profile/edit"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 inline-block py-1"
          >
            Complete Profile →
          </a>
        </div>

        <button
          onClick={() => {
            setShow(false);
            onDismiss?.();
          }}
          className="text-gray-400 hover:text-gray-600 mt-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
