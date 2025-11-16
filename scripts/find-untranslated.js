#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../locales');
const en = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en.json'), 'utf8'));

['de', 'es', 'fr', 'it', 'pt'].forEach(locale => {
  const tr = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, `${locale}.json`), 'utf8'));
  const untranslated = [];
  Object.keys(en).forEach(k => {
    if (tr[k] === en[k]) untranslated.push(k);
  });
  if (untranslated.length) {
    console.log(`\n${locale}: ${untranslated.length} untranslated`);
    untranslated.forEach(k => console.log(`  ${k}: "${en[k]}"`));
  }
});
