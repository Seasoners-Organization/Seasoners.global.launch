"use client";
import { useEffect, useState, useMemo } from 'react';
import { getCountriesBySeason, getRegionsByCountry, getLocations, applyFilters, getCountryName, prettyRegionName } from '../utils/geo';
import { SEASONS } from '../utils/destinations';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useLanguage } from './LanguageProvider';

// Debounce helper
function useDebouncedEffect(effect, deps, delay) {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);
    return () => clearTimeout(handler);
  }, [...deps, delay]);
}

export default function FilterSidebar({ listings, onFiltered, context = 'stays' }) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Core filters
  const [season, setSeason] = useState('all');
  const [country, setCountry] = useState('all');
  const [region, setRegion] = useState('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [roommates, setRoommates] = useState('');
  const [jobType, setJobType] = useState('all');
  const [industry, setIndustry] = useState('all');
  const [hydrated, setHydrated] = useState(false);

  // Initialize from URL
  useEffect(() => {
    const sp = searchParams;
    const init = (key, setter, fallback='') => { const v = sp.get(key); if (v) setter(v); };
    init('season', setSeason, 'all');
    init('country', setCountry, 'all');
    init('region', setRegion, 'all');
    init('priceMin', setPriceMin);
    init('priceMax', setPriceMax);
    init('bedrooms', setBedrooms);
    init('roommates', setRoommates);
    init('jobType', setJobType, 'all');
    init('industry', setIndustry, 'all');
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived options
  // Show all countries when "All" season is selected to avoid hiding valid options
  const countries = useMemo(() => getCountriesBySeason(season === 'all' ? null : season), [season]);
  const regions = useMemo(() => country === 'all' ? [] : getRegionsByCountry(country), [country]);

  const showProperty = context === 'stays' || context === 'flatshares';
  const showJobs = context === 'jobs';

  // Reset dependent fields when upstream changes
  useEffect(() => { setCountry('all'); setRegion('all'); }, [season]);
  useEffect(() => { setRegion('all'); }, [country]);

  // Apply filters
  const filtered = useMemo(() => applyFilters(listings, {
    season, country, region,
    priceMin: priceMin || null,
    priceMax: priceMax || null,
    bedrooms: bedrooms || null,
    roommates: roommates || null,
    jobType, industry
  }), [listings, season, country, region, priceMin, priceMax, bedrooms, roommates, jobType, industry]);

  useEffect(() => { onFiltered(filtered); }, [filtered, onFiltered]);

  // URL sync (debounced for numeric inputs)
  useDebouncedEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams();
    if (season !== 'all') params.set('season', season);
    if (country !== 'all') params.set('country', country);
    if (region !== 'all') params.set('region', region);
    if (priceMin) params.set('priceMin', priceMin);
    if (priceMax) params.set('priceMax', priceMax);
    if (showProperty) {
      if (bedrooms) params.set('bedrooms', bedrooms);
      if (roommates) params.set('roommates', roommates);
    }
    if (showJobs) {
      if (jobType !== 'all') params.set('jobType', jobType);
      if (industry !== 'all') params.set('industry', industry);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [season, country, region, priceMin, priceMax, bedrooms, roommates, jobType, industry, hydrated, showProperty, showJobs], 250);

  function resetAll() {
    setSeason('all');
    setCountry('all');
    setRegion('all');
    setPriceMin('');
    setPriceMax('');
    setBedrooms('');
    setRoommates('');
    setJobType('all');
    setIndustry('all');
  }

  const hasAny = (
    season !== 'all' || country !== 'all' || region !== 'all' ||
    priceMin || priceMax || bedrooms || roommates || (showJobs && (jobType !== 'all' || industry !== 'all'))
  );

  return (
    <aside className="space-y-6" aria-label="Filters sidebar">
      {/* Active filter chips */}
      <div className="flex flex-wrap gap-2 items-center">
        {season !== 'all' && (
          <button onClick={() => setSeason('all')} className="px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-700">Season: {season} ×</button>
        )}
        {country !== 'all' && (
          <button onClick={() => setCountry('all')} className="px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-700">Country: {getCountryName(country)} ×</button>
        )}
        {region !== 'all' && (
          <button onClick={() => setRegion('all')} className="px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-700">Region: {prettyRegionName(region)} ×</button>
        )}
        {priceMin && (
          <button onClick={() => setPriceMin('')} className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">Min: €{priceMin} ×</button>
        )}
        {priceMax && (
          <button onClick={() => setPriceMax('')} className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">Max: €{priceMax} ×</button>
        )}
        {bedrooms && (
          <button onClick={() => setBedrooms('')} className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">Bedrooms: {bedrooms} ×</button>
        )}
        {roommates && (
          <button onClick={() => setRoommates('')} className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">Roommates: {roommates} ×</button>
        )}
        {jobType !== 'all' && (
          <button onClick={() => setJobType('all')} className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Job: {jobType.replace('_',' ').toLowerCase()} ×</button>
        )}
        {industry !== 'all' && (
          <button onClick={() => setIndustry('all')} className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Industry: {industry.replace('_',' ').toLowerCase()} ×</button>
        )}
        {hasAny && (
          <button onClick={resetAll} className="px-2 py-1 text-xs rounded-full bg-slate-200 text-slate-700">{t('filterClearAll')}</button>
        )}
      </div>
      {/* Mobile compact summary */}
      {hasAny && (
        <div className="sm:hidden text-xs text-slate-600">Active: {[
          season!=='all'&&`season:${season}`,
          country!=='all'&&`country:${getCountryName(country)}`,
          region!=='all'&&`region:${prettyRegionName(region)}`,
          priceMin&&`min:€${priceMin}`,
          priceMax&&`max:€${priceMax}`,
          bedrooms&&`beds:${bedrooms}`,
          roommates&&`roommates:${roommates}`,
          (showJobs&&jobType!=='all')&&`job:${jobType.toLowerCase()}`,
          (showJobs&&industry!=='all')&&`industry:${industry.toLowerCase()}`
        ].filter(Boolean).join(' · ')}</div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">{t('filterSidebarTitle')}</h2>
        <button onClick={resetAll} className="text-xs text-sky-700 hover:underline" aria-label="Reset all filters">{t('filterReset')}</button>
      </div>

      {/* Availability Section */}
      <fieldset className="space-y-3 border rounded-lg p-4 border-slate-200">
        <legend className="text-xs font-medium text-slate-500 px-1">{t('filterSeasonLocation')}</legend>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-600">{t('filterSeason')}
            <select aria-label="Season" value={season} onChange={e => setSeason(e.target.value)} className="mt-1 w-full border border-slate-300 rounded p-3 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all">
              <option value="all">{t('filterAll')}</option>
              {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-slate-600">{t('filterCountry')}
            <select aria-label="Country" value={country} onChange={e => setCountry(e.target.value)} className="mt-1 w-full border border-slate-300 rounded p-3 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all">
              <option value="all">{t('filterAll')}</option>
              {countries.map(c => <option key={c} value={c}>{getCountryName(c)}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-slate-600">{t('filterRegion')}
            <select aria-label="Region" value={region} onChange={e => setRegion(e.target.value)} className="mt-1 w-full border border-slate-300 rounded p-3 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all" disabled={country==='all' || regions.length===0}>
              <option value="all">{country==='all' ? t('filterAll') : t('filterSelectRegion')}</option>
              {regions.map(r => <option key={r} value={r}>{prettyRegionName(r)}</option>)}
            </select>
          </label>
        </div>
      </fieldset>

      {/* Economic Section */}
      <fieldset className="space-y-3 border rounded-lg p-4 border-slate-200">
        <legend className="text-xs font-medium text-slate-500 px-1">{t('filterEconomics')}</legend>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs font-medium text-slate-600">{t('filterPriceMin')}
            <input aria-label="Price minimum" type="number" min="0" value={priceMin} onChange={e=>setPriceMin(e.target.value)} className="mt-1 w-full border border-slate-300 rounded p-3 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all" />
          </label>
          <label className="text-xs font-medium text-slate-600">{t('filterPriceMax')}
            <input aria-label="Price maximum" type="number" min="0" value={priceMax} onChange={e=>setPriceMax(e.target.value)} className="mt-1 w-full border border-slate-300 rounded p-3 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all" />
          </label>
        </div>
      </fieldset>

      {/* Property Section */}
      {showProperty && (
        <fieldset className="space-y-3 border rounded-lg p-4 border-slate-200">
          <legend className="text-xs font-medium text-slate-500 px-1">{t('filterProperty')}</legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-medium text-slate-600">{t('filterBedrooms')}
              <input aria-label="Bedrooms" type="number" min="0" value={bedrooms} onChange={e=>setBedrooms(e.target.value)} className="mt-1 w-full border border-slate-300 rounded p-3 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all" />
            </label>
            <label className="text-xs font-medium text-slate-600">{t('filterRoommates')}
              <input aria-label="Roommates" type="number" min="0" value={roommates} onChange={e=>setRoommates(e.target.value)} className="mt-1 w-full border border-slate-300 rounded p-3 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all" />
            </label>
          </div>
        </fieldset>
      )}

      {/* Jobs Section */}
      {showJobs && (
        <fieldset className="space-y-3 border rounded-lg p-4 border-slate-200">
          <legend className="text-xs font-medium text-slate-500 px-1">{t('filterJobs')}</legend>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-600">{t('filterJobType')}
              <select aria-label="Job type" value={jobType} onChange={e=>setJobType(e.target.value)} className="mt-1 w-full border border-slate-300 rounded p-3 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all">
                <option value="all">{t('filterAll')}</option>
                <option value="FULL_TIME">{t('filterJobFullTime')}</option>
                <option value="PART_TIME">{t('filterJobPartTime')}</option>
                <option value="SEASONAL">{t('filterJobSeasonal')}</option>
                <option value="TEMPORARY">{t('filterJobTemporary')}</option>
              </select>
            </label>
            <label className="text-xs font-medium text-slate-600">{t('filterIndustry')}
              <select aria-label="Industry" value={industry} onChange={e=>setIndustry(e.target.value)} className="mt-1 w-full border border-slate-300 rounded p-3 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all">
                <option value="all">{t('filterAll')}</option>
                <option value="HOSPITALITY">{t('filterIndustryHospitality')}</option>
                <option value="FOOD_SERVICE">{t('filterIndustryFoodService')}</option>
                <option value="RETAIL">{t('filterIndustryRetail')}</option>
                <option value="OUTDOOR">{t('filterIndustryOutdoor')}</option>
                <option value="TRAVEL">{t('filterIndustryTravel')}</option>
                <option value="MAINTENANCE">{t('filterIndustryMaintenance')}</option>
                <option value="OTHER">{t('filterIndustryOther')}</option>
              </select>
            </label>
          </div>
        </fieldset>
      )}
    </aside>
  );
}
