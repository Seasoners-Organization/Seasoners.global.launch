// Season -> Countries mapping (ISO-like codes)
export const SEASON_COUNTRIES = {
  winter: ['AT','CH','FR','JP','NO','ES','PT','NZ','AU'], // ES/PT for winter sun belt
  summer: ['GR','ES','IT','PT','AU','ID','TH','VN']
};

// Human-friendly country names
export const COUNTRY_NAMES = {
  AT: 'Austria',
  CH: 'Switzerland',
  FR: 'France',
  JP: 'Japan',
  NO: 'Norway',
  ES: 'Spain',
  PT: 'Portugal',
  NZ: 'New Zealand',
  AU: 'Australia',
  GR: 'Greece',
  IT: 'Italy',
  ID: 'Indonesia',
  TH: 'Thailand',
  VN: 'Vietnam',
};

// Reverse map for loose name matching
const COUNTRY_NAME_TO_CODE = Object.fromEntries(
  Object.entries(COUNTRY_NAMES).map(([code, name]) => [name.toLowerCase(), code])
);

// Country -> Cities/Towns mapping (replacing state-based regions with actual cities)
export const COUNTRY_REGIONS = {
  AT: [
    'Innsbruck', 'St. Anton', 'Sölden', 'Ischgl', 'Kitzbühel',
    'Mayrhofen', 'Zillertal', 'Obertauern', 'Zell am See', 'Saalbach',
    'Schladming', 'Bad Hofgastein', 'Lienz', 'Salzburg', 'Vienna',
    'Linz', 'Graz', 'Innsbruck', 'Wörgl', 'Telfs'
  ],
  CH: [
    'Zermatt', 'Verbier', 'St. Moritz', 'Davos', 'Interlaken',
    'Saas-Fee', 'Crans-Montana', 'Gstaad', 'Andermatt', 'Engelberg',
    'Grindelwald', 'Wengen', 'Mürren', 'Valais', 'Lucerne',
    'Zurich', 'Geneva', 'Bern', 'Lugano', 'Zug'
  ],
  FR: [
    'Chamonix', 'Val d\'Isère', 'Courchevel', 'Les Deux Alpes', 'Tignes',
    'Méribel', 'Val Thorens', 'La Plagne', 'Alpe d\'Huez', 'Megève',
    'Morzine', 'Annecy', 'Grenoble', 'Nice', 'Cannes',
    'Saint-Tropez', 'Marseille', 'Biarritz', 'Bordeaux', 'Lyon'
  ],
  JP: [
    'Niseko', 'Hakuba', 'Nozawa', 'Myoko', 'Furano',
    'Rusutsu', 'Shiga Kogen', 'Appi Kogen', 'Zao', 'Banff',
    'Tokyo', 'Yokohama', 'Osaka', 'Kyoto', 'Hiroshima',
    'Sapporo', 'Nagano', 'Sendai', 'Fukuoka', 'Kobe'
  ],
  NO: [
    'Tromsø', 'Hemsedal', 'Trysil', 'Geilo', 'Lillehammer',
    'Lofoten', 'Svalbard', 'Longyearbyen', 'Narvik', 'Bodø',
    'Bergen', 'Oslo', 'Stavanger', 'Ålesund', 'Trondheim'
  ],
  ES: [
    'Madrid', 'Barcelona', 'Seville', 'Valencia', 'Málaga',
    'Bilbao', 'Zaragoza', 'Granada', 'Córdoba', 'Almería',
    'Ibiza', 'Mallorca', 'Menorca', 'Formentera', 'Tenerife',
    'Gran Canaria', 'Lanzarote', 'Fuerteventura', 'Andorra', 'San Sebastián'
  ],
  PT: [
    'Lisbon', 'Porto', 'Faro', 'Albufeira', 'Lagos',
    'Cascais', 'Sintra', 'Covilhã', 'Funchal', 'Ponta Delgada',
    'Évora', 'Coimbra', 'Braga', 'Aveiro', 'Vilamoura',
    'Tavira', 'Guarda', 'Viseu', 'Guarda', 'Madeira'
  ],
  NZ: [
    'Queenstown', 'Wanaka', 'Cardrona', 'Treble Cone', 'Mount Hutt',
    'Ruapehu', 'Taupo', 'Rotorua', 'Arrowtown', 'Glenorchy',
    'Auckland', 'Wellington', 'Christchurch', 'Dunedin', 'Napier',
    'Tauranga', 'Hamilton', 'New Plymouth', 'Palmerston North', 'Invercargill'
  ],
  AU: [
    'Sydney', 'Melbourne', 'Brisbane', 'Gold Coast', 'Byron Bay',
    'Cairns', 'Noosa', 'Bondi', 'Surfers Paradise', 'Port Douglas',
    'Thredbo', 'Perisher', 'Falls Creek', 'Mount Buller', 'Mount Hotham',
    'Hobart', 'Darwin', 'Perth', 'Adelaide', 'Canberra'
  ],
  GR: [
    'Santorini', 'Mykonos', 'Rhodes', 'Corfu', 'Zakynthos',
    'Paros', 'Naxos', 'Chania', 'Heraklion', 'Athens',
    'Thessaloniki', 'Ios', 'Milos', 'Skiathos', 'Halkidiki',
    'Crete', 'Delphi', 'Meteora', 'Hydra', 'Spetses'
  ],
  IT: [
    'Rome', 'Florence', 'Venice', 'Milan', 'Naples',
    'Cortina d\'Ampezzo', 'Val Gardena', 'Livigno', 'Cervinia', 'Courmayeur',
    'Madonna di Campiglio', 'Amalfi', 'Positano', 'Capri', 'Taormina',
    'Palermo', 'Bologna', 'Turin', 'Genoa', 'Verona'
  ],
  ID: [
    'Bali', 'Jakarta', 'Lombok', 'Yogyakarta', 'Bandung',
    'Seminyak', 'Canggu', 'Ubud', 'Uluwatu', 'Nusa Dua',
    'Sanur', 'Gili Islands', 'Kuta', 'Jimbaran', 'Bogor',
    'Surabaya', 'Medan', 'Denpasar', 'Palembang', 'Makassar'
  ],
  TH: [
    'Bangkok', 'Phuket', 'Krabi', 'Chiang Mai', 'Koh Samui',
    'Pattaya', 'Hua Hin', 'Koh Phi Phi', 'Koh Phangan', 'Koh Tao',
    'Patong', 'Kata Beach', 'Ao Nang', 'Railay Beach', 'Chaweng',
    'Lamai', 'Sukhumvit', 'Silom', 'Khao San Road', 'Nana'
  ],
  VN: [
    'Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hoi An', 'Nha Trang',
    'Phu Quoc', 'Halong Bay', 'Dalat', 'Mui Ne', 'Vung Tau',
    'Hue', 'Quy Nhon', 'Con Dao', 'Sapa', 'Cat Ba',
    'My Khe Beach', 'Can Tho', 'Ha Giang', 'Ninh Binh', 'Sa Pa'
  ]
};

// Location (hotspot/city) -> Country mapping
export const LOCATION_COUNTRY = {
  'Innsbruck': 'AT',
  'St Anton': 'AT',
  'Zermatt': 'CH',
  'Courchevel': 'FR',
  'Niseko': 'JP',
  'Hakuba': 'JP',
  'Nozawa': 'JP',
  'Tromsø': 'NO',
  'Longyearbyen': 'NO',
  'Canary Islands': 'ES',
  'Madeira': 'PT',
  'Wanaka': 'NZ',
  'Perisher': 'AU',
  'Santorini': 'GR',
  'Mykonos': 'GR',
  'Crete': 'GR',
  'Corfu': 'GR',
  'Bali': 'ID',
  'Phuket': 'TH',
  'Da Nang': 'VN',
  'Byron Bay': 'AU',
  'Gold Coast': 'AU',
  'Sydney': 'AU'
};

// Get countries by season
export function getCountriesBySeason(season) {
  if (!season || season === 'all') {
    // union of all countries
    const set = new Set();
    Object.values(SEASON_COUNTRIES).forEach(arr => arr.forEach(c => set.add(c)));
    return Array.from(set);
  }
  return SEASON_COUNTRIES[season] || [];
}

export function getCountryName(code) {
  return COUNTRY_NAMES[code] || code;
}

export function prettyRegionName(region) {
  if (!region) return '';
  return region.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Get regions by country
export function getRegionsByCountry(country) {
  return COUNTRY_REGIONS[country] || [];
}

// Get locations filtered by optional season and country
export function getLocations(season = 'all', country = 'all') {
  // Build from LOCATION_COUNTRY keys
  const all = Object.keys(LOCATION_COUNTRY);
  return all.filter(loc => {
    const c = LOCATION_COUNTRY[loc];
    const seasonMatch = season === 'all' || (SEASON_COUNTRIES[season] || []).includes(c);
    const countryMatch = country === 'all' || c === country;
    return seasonMatch && countryMatch;
  });
}

// Build a reverse map for quick season inference from location
export function locationSeasonMap() {
  const map = new Map();
  Object.entries(LOCATION_COUNTRY).forEach(([loc, country]) => {
    const season = Object.entries(SEASON_COUNTRIES).find(([_season, countries]) => countries.includes(country));
    if (season) map.set(loc, season[0]);
  });
  return map;
}

// Apply compound filters to listings (client-side)
// Region enums currently map to Austria; expand here if more structured regions are added later
const REGION_COUNTRY = {
  BURGENLAND: 'AT',
  CARINTHIA: 'AT',
  LOWER_AUSTRIA: 'AT',
  SALZBURG: 'AT',
  STYRIA: 'AT',
  TIROL: 'AT',
  UPPER_AUSTRIA: 'AT',
  VIENNA: 'AT',
  VORARLBERG: 'AT'
};

const REGION_DISPLAY = Object.fromEntries(
  Object.entries(REGION_COUNTRY).map(([key, val]) => [prettyRegionName(key).toLowerCase(), val])
);

function inferCountry(listing) {
  if (listing.countryCode) return listing.countryCode;
  if (listing.region && REGION_COUNTRY[listing.region]) return REGION_COUNTRY[listing.region];

  const loc = (listing.city || listing.location || '').toString();
  if (!loc) return null;

  // Break apart composite locations like "Innsbruck, Tirol"
  const tokens = loc.split(',').map(t => t.trim()).filter(Boolean);
  const candidates = [loc.trim(), ...tokens];

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();

    // Country full name (e.g., "Portugal")
    if (COUNTRY_NAME_TO_CODE[normalized]) return COUNTRY_NAME_TO_CODE[normalized];

    // Region display names (e.g., "Tirol")
    if (REGION_DISPLAY[normalized]) return REGION_DISPLAY[normalized];

    // Try city/region lists (case-insensitive exact)
    for (const [countryCode, regionList] of Object.entries(COUNTRY_REGIONS)) {
      if (regionList.some(r => r.toLowerCase() === normalized)) return countryCode;
    }

    // Try exact hotspot mapping
    for (const [locName, countryCode] of Object.entries(LOCATION_COUNTRY)) {
      if (locName.toLowerCase() === normalized) return countryCode;
    }
  }

  return null;
}

function regionMatchesFilter(listing, regionFilter) {
  if (regionFilter === 'all') return true;
  const normalizedFilter = regionFilter.toLowerCase();

  // Match structured Region enum (convert to display form)
  if (listing.region) {
    const pretty = prettyRegionName(listing.region).toLowerCase();
    if (pretty === normalizedFilter) return true;
  }

  // Match city/location free text
  const loc = (listing.city || listing.location || '').toString().trim().toLowerCase();
  if (loc && loc === normalizedFilter) return true;

  return false;
}

export function applyFilters(listings, filters) {
  const {
    season = 'all',
    country = 'all',
    region = 'all',
    priceMin,
    priceMax,
    bedrooms,
    roommates,
    jobType,
    industry
  } = filters;

  const countriesForSeason = getCountriesBySeason(season);

  return listings.filter(l => {
    const listingCountry = inferCountry(l);

    // Season filter (require inferred country to narrow correctly)
    if (season !== 'all') {
      if (!listingCountry) return false;
      if (!countriesForSeason.includes(listingCountry)) return false;
    }

    // Country filter
    if (country !== 'all') {
      if (!listingCountry) return false;
      if (listingCountry !== country) return false;
    }

    // Region / city filter
    if (!regionMatchesFilter(l, region)) return false;

    // Price filters
    if (priceMin != null && priceMin !== '' && l.price < Number(priceMin)) return false;
    if (priceMax != null && priceMax !== '' && l.price > Number(priceMax)) return false;

    // Bedrooms (for stays/flatshares) - tolerate missing field
    if (bedrooms != null && bedrooms !== '' && l.bedrooms != null && l.bedrooms !== Number(bedrooms)) return false;

    // Roommates/spots (flatshare specifics)
    if (roommates != null && roommates !== '' && l.totalRoommates != null && l.totalRoommates !== Number(roommates)) return false;

    // Job type / industry apply only to JOB listings (type field expected)
    if (l.type === 'JOB') {
      if (jobType && jobType !== 'all' && l.jobType !== jobType) return false;
      if (industry && industry !== 'all' && l.industry !== industry) return false;
    }

    return true;
  });
}
