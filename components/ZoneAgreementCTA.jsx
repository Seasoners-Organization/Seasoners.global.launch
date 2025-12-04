"use client";

import React from 'react';
import { useLanguage } from './LanguageProvider';
import Link from 'next/link';

export default function ZoneAgreementCTA({ zone }) {
  const { t } = useLanguage();

  return (
    <div className="text-center mt-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href={`/stays?zone=${encodeURIComponent(zone)}`}
          className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors"
        >
          {t('browseStays') || 'Browse Stays'}
        </Link>
        <Link 
          href={`/jobs?zone=${encodeURIComponent(zone)}`}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
        >
          {t('browseJobs') || 'Browse Jobs'}
        </Link>
      </div>
    </div>
  );
}
