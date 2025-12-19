const REGION_TO_CODE: Record<string, string> = {
  US: '+1', CA: '+1', GB: '+44', IE: '+353', AU: '+61', NZ: '+64',
  AT: '+43', DE: '+49', CH: '+41', FR: '+33', ES: '+34', IT: '+39', PT: '+351', NL: '+31', BE: '+32', DK: '+45', SE: '+46', NO: '+47', FI: '+358', PL: '+48', CZ: '+420', SK: '+421', HU: '+36', RO: '+40', BG: '+359', HR: '+385', SI: '+386', GR: '+30', TR: '+90', UA: '+380',
  JP: '+81', KR: '+82', CN: '+86', TW: '+886', HK: '+852', MO: '+853', SG: '+65', MY: '+60', TH: '+66', VN: '+84', ID: '+62', PH: '+63', IN: '+91', PK: '+92', BD: '+880', LK: '+94',
  AE: '+971', SA: '+966', IL: '+972', EG: '+20', MA: '+212',
  ZA: '+27', NG: '+234', KE: '+254',
  MX: '+52', BR: '+55', AR: '+54', CL: '+56', CO: '+57', PE: '+51', EC: '+593', UY: '+598', PY: '+595', BO: '+591', VE: '+58',
};

export function detectDefaultCountryCode(): string | null {
  if (typeof navigator === 'undefined') return null;
  const lang = navigator.languages?.[0] || navigator.language || '';
  // Expect formats like en-US, de-AT, pt-PT
  const region = lang.split('-')[1]?.toUpperCase() || '';
  if (region && REGION_TO_CODE[region]) return REGION_TO_CODE[region];
  // Fallback based on common defaults
  const base = lang.split('-')[0]?.toLowerCase();
  if (base === 'en') return '+44'; // default to UK for generic en-*
  if (base === 'de') return '+49';
  if (base === 'fr') return '+33';
  if (base === 'es') return '+34';
  if (base === 'pt') return '+351';
  return null;
}
