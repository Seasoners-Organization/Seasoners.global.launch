// Translation utility using browser's built-in APIs or fallback
export async function translateText(text, targetLang) {
  // Option 1: Use browser's built-in translation API (experimental)
  if ('translation' in self && 'createTranslator' in self.translation) {
    try {
      const translator = await self.translation.createTranslator({
        sourceLanguage: 'auto',
        targetLanguage: targetLang,
      });
      return await translator.translate(text);
    } catch (err) {
      console.warn('Browser translation failed:', err);
    }
  }

  // Option 2: Use external API (needs API key)
  // Uncomment and add your API key to use Google Translate, DeepL, etc.
  /*
  try {
    const response = await fetch(`/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang }),
    });
    const data = await response.json();
    return data.translatedText;
  } catch (err) {
    console.error('API translation failed:', err);
  }
  */

  // Fallback: Return original text with note
  return `[Translation unavailable] ${text}`;
}

export function detectLanguage(text) {
  // Simple heuristic based on character sets
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const hasCyrillic = /[\u0400-\u04FF]/.test(text);
  const hasChinese = /[\u4E00-\u9FFF]/.test(text);
  const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
  const hasKorean = /[\uAC00-\uD7AF]/.test(text);

  if (hasArabic) return 'ar';
  if (hasCyrillic) return 'ru';
  if (hasChinese) return 'zh';
  if (hasJapanese) return 'ja';
  if (hasKorean) return 'ko';

  // Default to English/Latin scripts
  return 'en';
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];
