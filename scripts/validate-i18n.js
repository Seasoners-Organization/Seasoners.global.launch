#!/usr/bin/env node

const en = require('../locales/en.json');
const de = require('../locales/de.json');

console.log('✓ Locale files loaded successfully');
console.log('EN keys:', Object.keys(en).length);
console.log('DE keys:', Object.keys(de).length);

// Test interpolation patterns
const interpolatedEN = Object.keys(en).filter(k => en[k].includes('{{'));
const interpolatedDE = Object.keys(de).filter(k => de[k].includes('{{'));

console.log('\nInterpolated strings:');
console.log('EN:', interpolatedEN.length, '-', interpolatedEN.slice(0, 5).join(', '));
console.log('DE:', interpolatedDE.length, '-', interpolatedDE.slice(0, 5).join(', '));

console.log('\nSample interpolated strings:');
interpolatedEN.slice(0, 3).forEach(key => {
  console.log(`  ${key}:`);
  console.log(`    EN: ${en[key]}`);
  console.log(`    DE: ${de[key]}`);
});

// Check for missing keys
const missingInDE = Object.keys(en).filter(k => !de[k]);
const missingInEN = Object.keys(de).filter(k => !en[k]);

if (missingInDE.length > 0) {
  console.log('\n⚠️  Keys in EN but missing in DE:', missingInDE);
} else {
  console.log('\n✓ All EN keys have DE translations');
}

if (missingInEN.length > 0) {
  console.log('⚠️  Keys in DE but missing in EN:', missingInEN);
} else {
  console.log('✓ All DE keys have EN translations');
}

console.log('\n✓ i18n validation complete!');
