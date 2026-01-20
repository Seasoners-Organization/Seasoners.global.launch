"use client";
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export function StaysEmptyState({ region }) {
  const { t } = useLanguage();
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">🏠</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {t('noListingsFound') || 'No listings yet'}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Be the first to list a seasonal stay in {region}. Help other seasonal workers find accommodation!
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/list?type=Stays"
          className="px-6 py-3 bg-amber-700 text-white rounded-lg font-semibold hover:bg-amber-800 transition-colors"
        >
          Create First Listing
        </Link>
        <Link
          href="/stays"
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Browse Other Regions
        </Link>
      </div>
    </div>
  );
}

export function JobsEmptyState({ region }) {
  const { t } = useLanguage();
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">💼</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {t('noListingsFound') || 'No jobs posted yet'}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Be the first to post a seasonal job in {region}. Attract talented seasonal workers today!
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/list?type=SeasonalJob"
          className="px-6 py-3 bg-amber-700 text-white rounded-lg font-semibold hover:bg-amber-800 transition-colors"
        >
          Post First Job
        </Link>
        <Link
          href="/jobs"
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Browse Other Regions
        </Link>
      </div>
    </div>
  );
}

export function FlatshareEmptyState({ region }) {
  const { t } = useLanguage();
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">🏘️</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {t('noListingsFound') || 'No flatshares available'}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Be the first to share a seasonal flatshare in {region}. Connect with other seasonal workers!
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/list?type=Flatshare"
          className="px-6 py-3 bg-amber-700 text-white rounded-lg font-semibold hover:bg-amber-800 transition-colors"
        >
          Create First Flatshare
        </Link>
        <Link
          href="/flatshares"
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Browse Other Regions
        </Link>
      </div>
    </div>
  );
}
