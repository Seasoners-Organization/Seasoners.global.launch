# Message Translation Setup Guide

## Current Implementation

Messages now have **on-demand translation** with a translate button (🌐) on received messages.

### Features:
- ✅ Translate button appears on messages from others
- ✅ Shows both original + translated text
- ✅ Language detection for sender's text
- ✅ Uses recipient's `preferredLanguage` as target
- ✅ Translated text cached per session
- ✅ Full i18n support (6 languages)

## How It Works

1. **User receives message in another language**
2. **Clicks 🌐 translate button**
3. **System detects source language & translates to user's preferred language**
4. **Shows original + translation in the message bubble**

## Production Setup

### Option 1: Google Translate API (Recommended)

1. Get API key: https://cloud.google.com/translate/docs/setup
2. Add to `.env`:
   ```bash
   GOOGLE_TRANSLATE_API_KEY=your_key_here
   ```
3. Uncomment lines 19-36 in `/app/api/translate/route.ts`
4. **Cost**: $20 per million characters (~1 cent per 500 messages)

### Option 2: DeepL API (Higher Quality)

1. Get API key: https://www.deepl.com/pro-api
2. Add to `.env`:
   ```bash
   DEEPL_API_KEY=your_key_here
   ```
3. Uncomment lines 40-59 in `/app/api/translate/route.ts`
4. **Cost**: Free tier: 500,000 chars/month, then €5 per million

### Option 3: Azure Translator

1. Create Azure resource
2. Add to `.env`:
   ```bash
   AZURE_TRANSLATOR_KEY=your_key_here
   AZURE_TRANSLATOR_REGION=your_region
   ```
3. Add implementation in `/app/api/translate/route.ts`

## Alternative Approaches

### Auto-Translate Everything
- Automatically translate all messages to recipient's language
- Store both original + translation in database
- **Pros**: No manual action needed
- **Cons**: Higher API costs, privacy concerns

### Browser Built-in Translation
- Use Chrome's built-in translation API
- **Pros**: Free, no API needed
- **Cons**: Only works in Chrome, experimental

### Pre-translate Suggestions
- Suggest common phrases in recipient's language while typing
- **Pros**: Better UX, less translation needed
- **Cons**: More complex implementation

## Current Fallback

Without API key configured, messages show:
```
[Translation service not configured. Original: "original text"]
```

Users can still communicate, but manual translation outside app is needed.

## Recommended Next Steps

1. **Add Google Translate API** - most cost-effective for MVP
2. **Track translation usage** - add analytics to monitor costs
3. **Add rate limiting** - prevent abuse (currently 50/min per user)
4. **Store translations** - cache in DB to reduce API calls
5. **Language preferences UI** - let users set preferred language in profile

## Testing

1. Have two users with different `preferredLanguage` settings
2. Send messages in one language
3. Recipient clicks 🌐 to translate
4. Check translation appears below original text
