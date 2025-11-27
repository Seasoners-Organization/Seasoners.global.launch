"use client";
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { getZoneBySlug } from '../../../data/zones';
import Link from 'next/link';
import ZoneAgreementCTA from '../../../components/ZoneAgreementCTA';
import { useLanguage } from '../../../components/LanguageProvider';

export default function ZonePage({ params }) {
  const { zone } = params;
  const { t } = useLanguage();
  const zoneData = getZoneBySlug(zone);
  if (typeof window !== 'undefined') {
    // Debug: log params and zoneData
    // eslint-disable-next-line no-console
    console.log('ZonePage params:', params, 'zoneData:', zoneData);
  }

  if (!zoneData) {
    return (
      <main>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">{t('listingNotFound')}<br/>Zone slug: {zone}</div>
        <Footer />
      </main>
    );
  }

  // Language selection for summary/description
  const { lang } = useLanguage() || {};
  const safeLang = typeof lang === 'string' && lang.length > 0 ? lang : 'en';
  const langKey = safeLang.charAt(0).toUpperCase() + safeLang.slice(1);
  const summary = zoneData[`summary${langKey}`] || zoneData.summary;
  const description = zoneData[`description${langKey}`] || zoneData.description;

  return (
    <main>
      <Navbar />

      {/* Hero Section with Image */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img 
          src={zoneData.hero} 
          alt={zoneData.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {zoneData.title}
            </h1>
            <p className="text-xl text-white/95 max-w-3xl drop-shadow-md">
              {summary}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto p-6 md:p-12">
        {/* Description */}
        <div className="mb-12">
          <p className="text-lg text-slate-700 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-8">
          <Link href={`/zones/${zone}/stays`} className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium transition">
            {t('stays')}
          </Link>
          <Link href={`/zones/${zone}/jobs`} className="px-6 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition">
            {t('jobs')}
          </Link>
          <Link href={`/zones/${zone}/guides`} className="px-6 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition">
            {t('guides')}
          </Link>
        </div>

        {/* Featured Hotspots */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-sky-800 mb-6">{t('featuredDestinations')}</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {zoneData.hotspots.map((h) => (
              <div key={h} className="rounded-xl p-6 border border-slate-200 bg-white hover:shadow-lg transition text-center">
                <span className="text-lg font-medium text-slate-800">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted Stay Guide */}
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-8 mb-12">
          <h2 className="text-2xl font-semibold text-sky-800 mb-4">{t('trustedStayGuide')}</h2>
          <p className="text-slate-700 leading-relaxed">
            {t('trustedStayGuideDesc').replace('{zone}', zoneData.title)}
          </p>
        </div>

        {/* Resources & Guides */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-sky-800 mb-6">{t('resourcesGuides')}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition">
              <h4 className="font-semibold text-slate-900 mb-2">🏔️ {t('howToFindJob').replace('{zone}', zoneData.title)}</h4>
              <p className="text-sm text-slate-600">{t('comingSoonJobTips')}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition">
              <h4 className="font-semibold text-slate-900 mb-2">🏠 {t('staffHousingOptions')}</h4>
              <p className="text-sm text-slate-600">{t('comingSoonStaffHousing')}</p>
            </div>
          </div>
        </div>

        {/* Agreement CTA */}
        <div className="text-center">
          <ZoneAgreementCTA zone={zone} preset={zoneData.preset} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
