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

// Country -> Regions mapping (minimal starter sets; extend later)
export const COUNTRY_REGIONS = {
  AT: [
    'BURGENLAND','CARINTHIA','LOWER_AUSTRIA','SALZBURG','STYRIA','TIROL','UPPER_AUSTRIA','VIENNA','VORARLBERG',
    'Innsbruck', 'St. Anton am Arlberg', 'Ischgl', 'Kitzbühel', 'Sölden',
    'Zell am See', 'Saalbach', 'Mayrhofen', 'Schladming', 'Obertauern'
  ],
  CH: [
    'Valais','Graubünden','Bernese Oberland','Uri','Ticino','Vaud',
    'Zermatt', 'Verbier', 'St. Moritz', 'Davos', 'Interlaken',
    'Saas-Fee', 'Crans-Montana', 'Gstaad', 'Andermatt', 'Engelberg',
    'Lausanne', 'Geneva', 'Zurich', 'Lucerne', 'Lugano'
  ],
  FR: [
    'Savoie','Haute-Savoie','Isère','Hautes-Alpes','Alpes-Maritimes',
    'Provence-Alpes-Côte d\'Azur', 'Occitanie', 'Nouvelle-Aquitaine',
    'Chamonix', 'Val d\'Isère', 'Courchevel', 'Les Deux Alpes', 'Tignes',
    'Méribel', 'Val Thorens', 'La Plagne', 'Alpe d\'Huez', 'Megève',
    'Nice', 'Cannes', 'Saint-Tropez', 'Marseille', 'Biarritz', 'Bordeaux'
  ],
  JP: [
    'Hokkaido','Nagano','Niigata','Yamagata','Gunma',
    'Niseko', 'Hakuba', 'Nozawa Onsen', 'Myoko Kogen', 'Furano',
    'Rusutsu', 'Shiga Kogen', 'Appi Kogen', 'Zao Onsen', 'Tokyo'
  ],
  NO: [
    'Troms','Svalbard','Trøndelag','Vestland','Viken',
    'Tromsø', 'Hemsedal', 'Trysil', 'Geilo', 'Lillehammer',
    'Lofoten', 'Bergen', 'Oslo', 'Stavanger'
  ],
  ES: [
    'Canary Islands','Balearic Islands','Andalusia','Catalonia','Aragon','Asturias','Cantabria','Valencia',
    'Sierra Nevada', 'Baqueira-Beret', 'Formigal', 'Candanchú',
    'Barcelona', 'Madrid', 'Seville', 'Valencia', 'Málaga',
    'Ibiza', 'Mallorca', 'Tenerife', 'Gran Canaria', 'Marbella'
  ],
  PT: [
    'Madeira','Lisbon District','Algarve','Porto District','Azores',
    'Faro', 'Albufeira', 'Lagos', 'Cascais', 'Sintra',
    'Funchal', 'Ponta Delgada', 'Évora', 'Coimbra', 'Braga'
  ],
  NZ: [
    'Otago','Canterbury','Southland','West Coast','Manawatu-Wanganui',
    'Queenstown', 'Wanaka', 'Cardrona', 'Treble Cone', 'Mount Hutt',
    'Ruapehu', 'Auckland', 'Wellington', 'Christchurch', 'Dunedin'
  ],
  AU: [
    'New South Wales','Queensland','Victoria','Tasmania','South Australia',
    'Thredbo', 'Perisher', 'Falls Creek', 'Mount Buller', 'Mount Hotham',
    'Sydney', 'Melbourne', 'Brisbane', 'Gold Coast', 'Byron Bay',
    'Cairns', 'Noosa', 'Bondi', 'Surfers Paradise', 'Port Douglas'
  ],
  GR: [
    'Cyclades','Dodecanese','Ionian Islands','Crete','Attica','Central Macedonia',
    'Santorini', 'Mykonos', 'Rhodes', 'Corfu', 'Zakynthos',
    'Paros', 'Naxos', 'Chania', 'Heraklion', 'Athens',
    'Thessaloniki', 'Ios', 'Milos', 'Skiathos', 'Halkidiki'
  ],
  IT: [
    'Sicily','Sardinia','Trentino-Alto Adige','Veneto','Lombardy','Piedmont','Aosta Valley',
    'Tuscany','Lazio','Campania',
    'Cortina d\'Ampezzo', 'Val Gardena', 'Livigno', 'Cervinia', 'Courmayeur',
    'Madonna di Campiglio', 'Rome', 'Florence', 'Venice', 'Milan',
    'Naples', 'Amalfi Coast', 'Positano', 'Capri', 'Taormina'
  ],
  ID: [
    'Bali','Jakarta','Lombok','Sumatra','Java',
    'Seminyak', 'Canggu', 'Ubud', 'Uluwatu', 'Nusa Dua',
    'Sanur', 'Gili Islands', 'Kuta', 'Jimbaran', 'Yogyakarta',
    'Bandung', 'Surabaya', 'Medan', 'Denpasar', 'Bogor'
  ],
  TH: [
    'Phuket','Bangkok','Krabi','Chiang Mai','Koh Samui',
    'Pattaya', 'Hua Hin', 'Koh Phi Phi', 'Koh Phangan', 'Koh Tao',
    'Patong', 'Kata Beach', 'Ao Nang', 'Railay Beach', 'Chaweng',
    'Lamai', 'Sukhumvit', 'Silom', 'Khao San Road', 'Nana'
  ],
  VN: [
    'Da Nang','Hanoi','Ho Chi Minh City','Nha Trang','Hoi An',
    'Phu Quoc', 'Halong Bay', 'Dalat', 'Mui Ne', 'Vung Tau',
    'Hue', 'Quy Nhon', 'Con Dao', 'Sapa', 'Cat Ba',
    'My Khe Beach', 'An Bang Beach', 'Long Beach', 'Bai Sao', 'Can Tho'
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
export function applyFilters(listings, filters) {
  const {
    season = 'all',
    country = 'all',
    region = 'all',
    location = 'all',
    priceMin,
    priceMax,
    bedrooms,
    roommates,
    jobType,
    industry
  } = filters;

  const countriesForSeason = getCountriesBySeason(season);
  const locationsForContext = getLocations(season, country);

  return listings.filter(l => {
    // Structured location fields (future-proof: countryCode may be absent)
    const locName = (l.city || l.location || '').toString();
    const listingCountry = l.countryCode || LOCATION_COUNTRY[locName];

    // Season filter
    if (season !== 'all' && (!listingCountry || !countriesForSeason.includes(listingCountry))) return false;

    // Country filter
    if (country !== 'all' && listingCountry !== country) return false;

    // Region filter (only applies if structured region present)
    if (region !== 'all' && l.region && l.region !== region) return false;

    // Location filter
    if (location !== 'all' && locName !== location) return false;

    // Location must be in derived list if season narrowed
    if (season !== 'all' && !locationsForContext.includes(locName)) return false;

    // Price filters
    if (priceMin != null && l.price < Number(priceMin)) return false;
    if (priceMax != null && l.price > Number(priceMax)) return false;

    // Bedrooms (for stays/flatshares) - tolerate missing field
    if (bedrooms != null && l.bedrooms != null && l.bedrooms !== Number(bedrooms)) return false;

    // Roommates/spots (flatshare specifics)
    if (roommates != null && l.totalRoommates != null && l.totalRoommates !== Number(roommates)) return false;

    // Job type / industry apply only to JOB listings (type field expected)
    if (l.type === 'JOB') {
      if (jobType && jobType !== 'all' && l.jobType && l.jobType !== jobType) return false;
      if (industry && industry !== 'all' && l.industry && l.industry !== industry) return false;
    }

    return true;
  });
}
