"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from './LanguageProvider';

export default function MessageQuotaIndicator() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    fetchQuota();
  }, [session]);

  const fetchQuota = async () => {
    try {
      const response = await fetch('/api/messages/quota');
      if (response.ok) {
        const data = await response.json();
        setQuota(data);
      }
    } catch (err) {
      console.error('Failed to fetch message quota:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user || loading || !quota) {
    return null;
  }

  // Don't show anything for unlimited users
  if (quota.unlimited) {
    return null;
  }

  const { used, total, remaining } = quota.quota;
  const percentage = (used / total) * 100;
  const isNearLimit = remaining <= 2;
  const isAtLimit = remaining === 0;

  return (
    <div className={`rounded-lg border p-4 ${
      isAtLimit ? 'bg-red-50 border-red-200' : 
      isNearLimit ? 'bg-amber-50 border-amber-200' : 
      'bg-sky-50 border-sky-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-900">
          Messages this month
        </span>
        {isAtLimit && (
          <a 
            href="/subscribe" 
            className="text-xs font-semibold text-red-600 hover:text-red-700"
          >
            Upgrade →
          </a>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              isAtLimit ? 'bg-red-500' : 
              isNearLimit ? 'bg-amber-500' : 
              'bg-sky-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <span className={`text-sm font-semibold ${
          isAtLimit ? 'text-red-600' : 
          isNearLimit ? 'text-amber-600' : 
          'text-sky-600'
        }`}>
          {used}/{total}
        </span>
      </div>
      
      {isAtLimit ? (
        <p className="text-xs text-red-600 mt-2">
          Message limit reached. <a href="/subscribe" className="underline font-medium">Upgrade to Plus</a> for unlimited messages.
        </p>
      ) : isNearLimit ? (
        <p className="text-xs text-amber-600 mt-2">
          Only {remaining} message{remaining !== 1 ? 's' : ''} remaining this month.
        </p>
      ) : (
        <p className="text-xs text-slate-600 mt-2">
          {remaining} message{remaining !== 1 ? 's' : ''} remaining. Resets monthly.
        </p>
      )}
    </div>
  );
}
