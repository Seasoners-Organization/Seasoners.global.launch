# Seasoners i18n Guide

## Overview
Seasoners now supports full English/German (EN/DE) internationalization across the entire application using a lightweight React Context-based solution.

## Features

### 1. Language Toggle
- Located in the far right of the navbar
- Persists selection to localStorage
- Automatically detects browser language on first visit
- Updates `document.lang` attribute for accessibility

### 2. Interpolation Support
The translation function `t()` now supports dynamic parameters using `{{param}}` syntax:

```jsx
// Simple usage
t('checkYourEmail')  // "Check your email"

// With interpolation
t('signInLinkSent', { email: 'user@example.com' })
// "We've sent a sign-in link to user@example.com. Click the link to sign in."

t('passwordTooWeak', { suggestion: 'Try adding more characters' })
// "Password too weak. Try adding more characters"
```

### 3. Missing Key Detection
In development mode, missing translation keys:
- Log a console warning: `[i18n] Missing key "someKey" for locale "de"`
- Display as `[someKey]` in the UI for easy spotting

### 4. Coverage
All pages are fully localized:

#### Public Pages
- `/` - Home (hero, cards, CTAs)
- `/about` - About page
- `/stays` - Browse stays
- `/jobs` - Browse jobs
- `/listings/[id]` - Listing details
- `/agreement` - Smart Stay Agreement template
- `/subscribe` - Subscription plans

#### Auth Pages
- `/auth/signin` - Sign in form
- `/auth/register` - Multi-step registration
- `/auth/verify` - Account verification dashboard
- `/auth/verify-request` - Email confirmation
- `/auth/error` - Auth error messages

#### Protected Pages
- `/profile` - User dashboard (overview, listings, subscription, settings)
- `/list` - Create listing form

#### Components
- `Navbar` - All navigation and auth buttons
- `Footer` - Footer content (if localized)

## Usage in Components

### Basic Usage
```jsx
"use client";
import { useLanguage } from '../components/LanguageProvider';

export default function MyComponent() {
  const { t, locale, setLocale } = useLanguage();
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      
      {/* Switch language programmatically */}
      <button onClick={() => setLocale('de')}>Deutsch</button>
    </div>
  );
}
```

### With Interpolation
```jsx
const email = 'user@example.com';
const phone = '+43 123 456789';

<p>{t('signInLinkSent', { email })}</p>
<p>{t('enterSmsCodePhone', { phone })}</p>
<p>{t('confirmDeleteListing', { title: listing.title })}</p>
```

## Adding New Translations

1. **Add keys to locale files**:
   - `/locales/en.json` - English translations
   - `/locales/de.json` - German translations

2. **Use consistent key naming**:
   ```json
   {
     "pageTitle": "Simple text",
     "dynamicMessage": "Text with {{param}} interpolation",
     "buttonAction": "Action Button"
   }
   ```

3. **Import and use in components**:
   ```jsx
   const { t } = useLanguage();
   return <h1>{t('pageTitle')}</h1>;
   ```

## File Structure

```
/locales/
  en.json          # English translations (~210 keys)
  de.json          # German translations (~210 keys)

/components/
  LanguageProvider.jsx   # i18n context and logic
  LanguageToggle.jsx     # EN/DE toggle UI component

/app/
  providers.jsx          # Combines session + language providers
  layout.jsx             # Wraps app with providers
```

## Advanced Features

### Conditional Content
```jsx
const { locale } = useLanguage();

return (
  <div>
    {locale === 'de' ? (
      <GermanOnlyComponent />
    ) : (
      <EnglishOnlyComponent />
    )}
  </div>
);
```

### Form Validation Messages
```jsx
// Validation with interpolation
if (!valid) {
  setError(t('passwordTooWeak', { 
    suggestion: passwordStrength.feedback.suggestions[0] 
  }));
}
```

### Multi-Step Forms
```jsx
const stepKeys = [
  'stepAccountDetails',
  'stepContactInformation',
  'stepAccountType',
  'stepVerification'
];

{stepKeys.map((key, index) => (
  <Step key={key} label={t(key)} active={index === currentStep} />
))}
```

## Testing Different Languages

1. **Via UI**: Click the EN/DE toggle in the navbar
2. **Via localStorage**: 
   ```js
   localStorage.setItem('locale', 'de');
   window.location.reload();
   ```
3. **Via Browser**: Set browser language to German and visit for first time

## Performance Notes

- Locale files are imported at build time (no runtime fetch)
- Total bundle size impact: ~10-15 KB for both locales
- No external dependencies (react-i18next not needed)
- Translations cached in React Context (no re-parsing)

## Future Enhancements

Consider adding:
- Pluralization support: `t('items', { count: 5 })` → "5 items" vs "1 item"
- Date/number formatting per locale
- Right-to-left (RTL) support for additional languages
- Translation management tool integration
- Lazy-load locale files for additional languages
