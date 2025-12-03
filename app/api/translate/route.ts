import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Simple translation endpoint
// For production, integrate with Google Translate API, DeepL, or Azure Translator
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, targetLang, sourceLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Rate limiting: max 50 translations per minute per user
    // In production, store this in Redis or database

    // OPTION 2: Use DeepL API (Higher Quality) - ACTIVE
    if (process.env.DEEPL_API_KEY) {
      const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          target_lang: targetLang.toUpperCase(),
          source_lang: sourceLang?.toUpperCase() || 'AUTO'
        })
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          translatedText: data.translations[0].text,
          detectedSourceLanguage: data.translations[0].detected_source_language?.toLowerCase()
        });
      } else {
        const error = await response.text();
        console.error('DeepL API error:', error);
      }
    }

    // OPTION 1: Use Google Translate API (requires API key)
    // Uncomment and add GOOGLE_TRANSLATE_API_KEY to .env
    /*
    if (process.env.GOOGLE_TRANSLATE_API_KEY) {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            target: targetLang,
            source: sourceLang || 'auto',
            format: 'text'
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          translatedText: data.data.translations[0].translatedText,
          detectedSourceLanguage: data.data.translations[0].detectedSourceLanguage
        });
      }
    }
    */

    // FALLBACK: Return message indicating translation service not configured
    // In production, you MUST configure one of the above services
    return NextResponse.json({
      translatedText: `[Translation service not configured. Original: "${text}"]`,
      note: 'Add GOOGLE_TRANSLATE_API_KEY or DEEPL_API_KEY to enable translations'
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
