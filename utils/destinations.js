import { ZONES } from '../data/zones';

export const SEASONS = ['winter', 'summer'];

export function getAllLocations() {
  const set = new Set();
  for (const z of ZONES) {
    (z.hotspots || []).forEach(h => set.add(h));
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getLocationsBySeason(season) {
  if (!season || !SEASONS.includes(season)) return getAllLocations();
  const set = new Set();
  for (const z of ZONES) {
    if (z.season === season) {
      (z.hotspots || []).forEach(h => set.add(h));
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function locationSeasonMap() {
  const map = new Map();
  for (const z of ZONES) {
    for (const h of z.hotspots || []) {
      map.set(h, z.season);
    }
  }
  return map; // Map<Location, 'winter'|'summer'>
}
