#!/usr/bin/env node

/**
 * Automated Translation Generator for Seasoners
 * 
 * This script uses OpenAI's API to translate all keys from en.json to target locales.
 * It preserves existing high-quality translations and only translates missing keys.
 * 
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-translations-auto.js
 *   or
 *   DEEPL_API_KEY=xxxx:fx node scripts/generate-translations-auto.js
 * 
 * Requirements:
 *   - OpenAI API key set in environment variable OPENAI_API_KEY
 *   - Node.js 18+ with fetch support
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LOCALES_DIR = path.join(__dirname, '../locales');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');
const TARGET_LOCALES = ['es', 'fr', 'it', 'pt'];
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

// Language names for better translation context
const LOCALE_NAMES = {
  es: 'Spanish',
  fr: 'French',
  it: 'Italian',
  pt: 'Portuguese (European)',
  de: 'German',
};

// Protect placeholders like {{email}} or [Address] from being translated
function protectPlaceholders(text) {
  const placeholders = [];
  let processed = text;
  const patterns = [/\{\{[^}]+\}\}/g, /\[[^\]]+\]/g];
  patterns.forEach((re) => {
    processed = processed.replace(re, (match) => {
      const token = `__PH_${placeholders.length}__`;
      placeholders.push({ token, match });
      return token;
    });
  });
  return { processed, placeholders };
}

function restorePlaceholders(text, placeholders) {
  let restored = text;
  placeholders.forEach(({ token, match }) => {
    restored = restored.replaceAll(token, match);
  });
  return restored;
}

/**
 * Call OpenAI API to translate a batch of keys
 */
async function translateBatchOpenAI(keys, sourceTexts, targetLocale) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const protectedTexts = sourceTexts.map((t) => protectPlaceholders(t));
  const keysContext = keys
    .map((key, i) => `"${key}": "${protectedTexts[i].processed}"`)
    .join('\n');

  const prompt = `You are a professional translator for a seasonal work and accommodation platform called Seasoners.

Translate the following JSON translation keys from English to ${LOCALE_NAMES[targetLocale]}.

Context:
- This is a platform connecting travelers, hosts, and seasonal workers
- Maintain a friendly, professional, and inclusive tone
- Preserve all placeholders like {{email}}, [Address], etc. exactly as written
- Keep special formatting like emojis (⭐, 👑, ✓)
- For legal/agreement text, be precise and clear

Source keys (English):
${keysContext}

Return ONLY a valid JSON object with the translated values, using the same keys. Do not include any other text or explanation.`;

  const modelToUse = process.env.OPENAI_MODEL || 'gpt-5.1-codex-max';
  // Use OPENAI_MODEL env var to allow switching models (defaults to GPT-5.1-Codex-Max preview)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: modelToUse,
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator. Always return valid JSON only, no other text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in OpenAI response');
  }

  const translated = JSON.parse(jsonMatch[0]);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (translated[k]) {
      translated[k] = restorePlaceholders(translated[k], protectedTexts[i].placeholders);
    }
  }
  return translated;
}

/**
 * Call DeepL API to translate a batch of keys
 */
async function translateBatchDeepL(keys, sourceTexts, targetLocale) {
  if (!DEEPL_API_KEY) {
    throw new Error('DEEPL_API_KEY environment variable is not set');
  }
  const protectedItems = sourceTexts.map((t) => protectPlaceholders(t));
  const texts = protectedItems.map((p) => p.processed);
  const form = new URLSearchParams();
  texts.forEach((t) => form.append('text', t));
  form.append('source_lang', 'EN');
  const deeplTarget = targetLocale.toUpperCase() === 'PT' ? 'PT-PT' : targetLocale.toUpperCase();
  form.append('target_lang', deeplTarget);
  form.append('preserve_formatting', '1');
  form.append('split_sentences', 'nonewlines');

  // Auto-detect Free vs Pro endpoint based on key suffix ':fx'
  const deeplEndpoint = (DEEPL_API_KEY || '').endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';

  const response = await fetch(deeplEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepL API error: ${response.status} ${error}`);
  }
  const data = await response.json();
  const out = {};
  data.translations.forEach((t, i) => {
    const restored = restorePlaceholders(t.text, protectedItems[i].placeholders);
    out[keys[i]] = restored;
  });
  return out;
}

/**
 * Split translations into smaller batches to avoid token limits
 */
function chunkObject(obj, chunkSize = 30) {
  const entries = Object.entries(obj);
  const chunks = [];
  
  for (let i = 0; i < entries.length; i += chunkSize) {
    chunks.push(Object.fromEntries(entries.slice(i, i + chunkSize)));
  }
  
  return chunks;
}

/**
 * Process translations for a single locale
 */
async function translateLocale(targetLocale) {
  console.log(`\n🌍 Processing ${LOCALE_NAMES[targetLocale]} (${targetLocale})...`);
  
  // Load source and target translations
  const enTranslations = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
  const targetPath = path.join(LOCALES_DIR, `${targetLocale}.json`);
  
  let existingTranslations = {};
  if (fs.existsSync(targetPath)) {
    existingTranslations = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
  }
  
  // Find missing keys (keys where value equals English value = not translated)
  const missingKeys = [];
  const missingTexts = [];
  
  for (const [key, enValue] of Object.entries(enTranslations)) {
    const existingValue = existingTranslations[key];
    
    // Consider missing if: not present, empty, or equals English value
    if (!existingValue || existingValue === enValue) {
      missingKeys.push(key);
      missingTexts.push(enValue);
    }
  }
  
  if (missingKeys.length === 0) {
    console.log(`✅ ${targetLocale}.json is already complete (${Object.keys(enTranslations).length} keys)`);
    return existingTranslations;
  }
  
  console.log(`📝 Found ${missingKeys.length} keys to translate`);
  
  // Split into batches
  const missingObj = Object.fromEntries(missingKeys.map((k, i) => [k, missingTexts[i]]));
  const batches = chunkObject(missingObj, 30);
  
  console.log(`📦 Processing ${batches.length} batches...`);
  
  let newTranslations = { ...existingTranslations };
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchKeys = Object.keys(batch);
    const batchTexts = Object.values(batch);
    
    console.log(`   Batch ${i + 1}/${batches.length} (${batchKeys.length} keys)...`);
    
    try {
      const translated = DEEPL_API_KEY
        ? await translateBatchDeepL(batchKeys, batchTexts, targetLocale)
        : await translateBatchOpenAI(batchKeys, batchTexts, targetLocale);
      Object.assign(newTranslations, translated);
      
      // Rate limiting: wait 1s between batches
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Failed to translate batch ${i + 1}: ${error.message}`);
      console.log('   Keeping English fallback for this batch');
      // Keep English fallback for failed batch
      batchKeys.forEach(key => {
        if (!newTranslations[key]) {
          newTranslations[key] = batch[key];
        }
      });
    }
  }
  
  // Ensure all keys are present (final fallback)
  for (const [key, enValue] of Object.entries(enTranslations)) {
    if (!newTranslations[key]) {
      newTranslations[key] = enValue;
    }
  }
  
  // Write back to file
  fs.writeFileSync(targetPath, JSON.stringify(newTranslations, null, 2) + '\n', 'utf8');
  console.log(`✅ Generated ${targetPath} (${Object.keys(newTranslations).length} keys)`);
  
  return newTranslations;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Automated Translation Generator for Seasoners\n');
  console.log('📚 Base locale: en.json');
  console.log(`🎯 Target locales: ${TARGET_LOCALES.join(', ')}`);
  console.log(`🔌 Provider: ${DEEPL_API_KEY ? 'DeepL' : OPENAI_API_KEY ? 'OpenAI' : 'None'}`);

  if (!OPENAI_API_KEY && !DEEPL_API_KEY) {
    console.error('\n❌ Error: No translation provider configured.');
    console.error('\nSet one of:');
    console.error('  OPENAI_API_KEY=sk-... node scripts/generate-translations-auto.js');
    console.error('  or');
    console.error('  DEEPL_API_KEY=xxxx:fx node scripts/generate-translations-auto.js');
    process.exit(1);
  }
  
  const results = {};
  
  for (const locale of TARGET_LOCALES) {
    try {
      results[locale] = await translateLocale(locale);
    } catch (error) {
      console.error(`\n❌ Failed to process ${locale}: ${error.message}`);
      results[locale] = null;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Translation Summary\n');
  
  const enTranslations = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
  const totalKeys = Object.keys(enTranslations).length;
  
  console.log(`Total keys in en.json: ${totalKeys}\n`);
  
  for (const locale of TARGET_LOCALES) {
    if (results[locale]) {
      const translated = Object.keys(results[locale]).length;
      const percentage = ((translated / totalKeys) * 100).toFixed(1);
      console.log(`✅ ${locale}.json: ${translated}/${totalKeys} keys (${percentage}%)`);
    } else {
      console.log(`❌ ${locale}.json: FAILED`);
    }
  }
  
  console.log('\n✨ Translation generation complete!');
  console.log('\nNext steps:');
  console.log('  1. Review generated files in locales/');
  console.log('  2. Spot-check translation quality');
  console.log('  3. Commit changes: git add locales/*.json');
  console.log('  4. Push to remote and verify CI passes');
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { translateLocale, translateBatchOpenAI, translateBatchDeepL };
