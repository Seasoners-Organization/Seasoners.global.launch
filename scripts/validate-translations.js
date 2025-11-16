#!/usr/bin/env node

/**
 * Validate translation files against en.json
 * - Ensures all keys exist in each locale
 * - Flags extra keys
 * - Verifies placeholders (e.g., {{email}}, [Address]) are preserved
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../locales');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');
const TARGET_LOCALES = ['de', 'es', 'fr', 'it', 'pt'];

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function extractPlaceholders(str) {
  if (typeof str !== 'string') return { mustache: [], bracket: [] };
  const mustache = (str.match(/\{\{\s*[^}]+\s*\}\}/g) || []).sort();
  const bracket = (str.match(/\[[^\]]+\]/g) || []).sort();
  return { mustache, bracket };
}

function diff(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  return {
    missing: [...setA].filter((x) => !setB.has(x)),
    extra: [...setB].filter((x) => !setA.has(x)),
  };
}

function main() {
  const en = loadJSON(EN_PATH);
  const enKeys = Object.keys(en);
  let hasError = false;

  console.log('🔎 Validating translations against en.json');
  console.log(`   Total base keys: ${enKeys.length}`);

  TARGET_LOCALES.forEach((locale) => {
    const localePath = path.join(LOCALES_DIR, `${locale}.json`);
    if (!fs.existsSync(localePath)) {
      console.log(`\n❌ ${locale}.json missing entirely`);
      hasError = true;
      return;
    }
    const tr = loadJSON(localePath);
    const trKeys = Object.keys(tr);

    const missing = enKeys.filter((k) => !(k in tr));
    const extras = trKeys.filter((k) => !(k in en));

    const placeholderIssues = [];
    let untranslatedCount = 0;
    enKeys.forEach((k) => {
      const base = en[k];
      const loc = tr[k];
      if (typeof base !== 'string' || typeof loc !== 'string') return;
      if (locale !== 'en' && loc === base) {
        untranslatedCount++;
      }
      const b = extractPlaceholders(base);
      const l = extractPlaceholders(loc);
      const mDiff = diff(b.mustache, l.mustache);
      const bDiff = diff(b.bracket, l.bracket);
      if (mDiff.missing.length || mDiff.extra.length || bDiff.missing.length || bDiff.extra.length) {
        placeholderIssues.push({ key: k, base: b, locale: l, mDiff, bDiff });
      }
    });

    console.log(`\n🌍 ${locale}.json`);
    console.log(`   Keys: ${trKeys.length} | Missing: ${missing.length} | Extra: ${extras.length} | Placeholder issues: ${placeholderIssues.length} | Untranslated: ${untranslatedCount}`);

    if (missing.length) {
      hasError = true;
      console.log('   Missing keys (first 10):', missing.slice(0, 10).join(', ') + (missing.length > 10 ? '…' : ''));
    }
    if (untranslatedCount) {
      hasError = true;
      console.log(`   Untranslated values detected: ${untranslatedCount}`);
    }
    if (extras.length) {
      console.log('   Extra keys (first 10):', extras.slice(0, 10).join(', ') + (extras.length > 10 ? '…' : ''));
    }
    if (placeholderIssues.length) {
      hasError = true;
      const sample = placeholderIssues.slice(0, 5).map((p) => p.key);
      console.log('   Placeholder issues in keys (sample):', sample.join(', ') + (placeholderIssues.length > 5 ? '…' : ''));
    }
  });

  if (hasError) {
    console.log('\n❌ Translation validation failed. See issues above.');
    process.exit(1);
  }
  console.log('\n✅ All locales validated successfully.');
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error('💥 Validation error:', e);
    process.exit(1);
  }
}
