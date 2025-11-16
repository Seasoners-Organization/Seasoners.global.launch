"use client";
import { useEffect, useState, useMemo } from 'react';
import { getCountriesBySeason, getRegionsByCountry, getLocations, applyFilters } from '../utils/geo';
import { SEASONS } from '../utils/destinations';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

// Debounce helper
function useDebouncedEffect(effect, deps, delay) {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);
    return () => clearTimeout(handler);
  }, [...deps, delay]);
}

export default function FilterSidebar({ listings, onFiltered, context = 'stays' }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Core filters
  const [season, setSeason] = useState('all');
  const [country, setCountry] = useState('all');
  const [region, setRegion] = useState('all');
  const [location, setLocation] = useState('all');
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
    init('location', setLocation, 'all');
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
  const countries = useMemo(() => getCountriesBySeason(season), [season]);
  const regions = useMemo(() => country === 'all' ? [] : getRegionsByCountry(country), [country]);
  const locations = useMemo(() => getLocations(season, country), [season, country]);

  const showProperty = context === 'stays' || context === 'flatshares';
  const showJobs = context === 'jobs';

  // Reset dependent fields when upstream changes
  useEffect(() => { setCountry('all'); setRegion('all'); setLocation('all'); }, [season]);
  useEffect(() => { setRegion('all'); setLocation('all'); }, [country]);
  useEffect(() => { setLocation('all'); }, [region]);

  // Apply filters
  const filtered = useMemo(() => applyFilters(listings, {
    season, country, region, location,
    priceMin: priceMin || null,
    priceMax: priceMax || null,
    bedrooms: bedrooms || null,
    roommates: roommates || null,
    jobType, industry
  }), [listings, season, country, region, location, priceMin, priceMax, bedrooms, roommates, jobType, industry]);

  useEffect(() => { onFiltered(filtered); }, [filtered, onFiltered]);

  // URL sync (debounced for numeric inputs)
  useDebouncedEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams();
    if (season !== 'all') params.set('season', season);
    if (country !== 'all') params.set('country', country);
    if (region !== 'all') params.set('region', region);
    if (location !== 'all') params.set('location', location);
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
  }, [season, country, region, location, priceMin, priceMax, bedrooms, roommates, jobType, industry, hydrated, showProperty, showJobs], 250);

  function resetAll() {
    setSeason('all');
    setCountry('all');
    setRegion('all');
    setLocation('all');
    setPriceMin('');
    setPriceMax('');
    setBedrooms('');
    setRoommates('');
    setJobType('all');
    setIndustry('all');
  }

  return (
    <aside className="space-y-6" aria-label="Filters sidebar">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Filters</h2>
        <button onClick={resetAll} className="text-xs text-sky-700 hover:underline" aria-label="Reset all filters">Reset</button>
      </div>

      {/* Availability Section */}
      <fieldset className="space-y-3 border rounded-lg p-4 border-slate-200">
        <legend className="text-xs font-medium text-slate-500 px-1">Season & Location</legend>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-600">Season
            <select aria-label="Season" value={season} onChange={e => setSeason(e.target.value)} className="mt-1 w-full border rounded p-1.5 text-xs">
              <option value="all">All</option>
              {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-slate-600">Country
            <select aria-label="Country" value={country} onChange={e => setCountry(e.target.value)} className="mt-1 w-full border rounded p-1.5 text-xs" disabled={season==='all'}>
              <option value="all">{season==='all' ? 'All' : 'Select country'}</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-slate-600">Region
            <select aria-label="Region" value={region} onChange={e => setRegion(e.target.value)} className="mt-1 w-full border rounded p-1.5 text-xs" disabled={country==='all' || regions.length===0}>
              <option value="all">{country==='all' ? 'All' : 'Select region'}</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-slate-600">Location
            <select aria-label="Location" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 w-full border rounded p-1.5 text-xs" disabled={season==='all'}>
              <option value="all">All</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
        </div>
      </fieldset>

      {/* Economic Section */}
      <fieldset className="space-y-3 border rounded-lg p-4 border-slate-200">
        <legend className="text-xs font-medium text-slate-500 px-1">Economics</legend>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs font-medium text-slate-600">Price Min
            <input aria-label="Price minimum" type="number" min="0" value={priceMin} onChange={e=>setPriceMin(e.target.value)} className="mt-1 w-full border rounded p-1.5 text-xs" />
          </label>
          <label className="text-xs font-medium text-slate-600">Price Max
            <input aria-label="Price maximum" type="number" min="0" value={priceMax} onChange={e=>setPriceMax(e.target.value)} className="mt-1 w-full border rounded p-1.5 text-xs" />
          </label>
        </div>
      </fieldset>

      {/* Property Section */}
      {showProperty && (
        <fieldset className="space-y-3 border rounded-lg p-4 border-slate-200">
          <legend className="text-xs font-medium text-slate-500 px-1">Property</legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-medium text-slate-600">Bedrooms
              <input aria-label="Bedrooms" type="number" min="0" value={bedrooms} onChange={e=>setBedrooms(e.target.value)} className="mt-1 w-full border rounded p-1.5 text-xs" />
            </label>
            <label className="text-xs font-medium text-slate-600">Roommates
              <input aria-label="Roommates" type="number" min="0" value={roommates} onChange={e=>setRoommates(e.target.value)} className="mt-1 w-full border rounded p-1.5 text-xs" />
            </label>
          </div>
        </fieldset>
      )}

      {/* Jobs Section */}
      {showJobs && (
        <fieldset className="space-y-3 border rounded-lg p-4 border-slate-200">
          <legend className="text-xs font-medium text-slate-500 px-1">Jobs</legend>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-600">Job Type
              <select aria-label="Job type" value={jobType} onChange={e=>setJobType(e.target.value)} className="mt-1 w-full border rounded p-1.5 text-xs">
                <option value="all">All</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="SEASONAL">Seasonal</option>
                <option value="TEMPORARY">Temporary</option>
              </select>
            </label>
            <label className="text-xs font-medium text-slate-600">Industry
              <select aria-label="Industry" value={industry} onChange={e=>setIndustry(e.target.value)} className="mt-1 w-full border rounded p-1.5 text-xs">
                <option value="all">All</option>
                <option value="HOSPITALITY">Hospitality</option>
                <option value="FOOD_SERVICE">Food Service</option>
                <option value="RETAIL">Retail</option>
                <option value="OUTDOOR">Outdoor</option>
                <option value="TRAVEL">Travel</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OTHER">Other</option>
              </select>
            </label>
          </div>
        </fieldset>
      )}
    </aside>
  );
}
