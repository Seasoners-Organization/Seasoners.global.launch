#!/usr/bin/env python3
"""
Add missing translation keys for streamlined landing page
"""
import json
from pathlib import Path

NEW_KEYS = {
    "howItWorksSubtitle": {
        "en": "Get started in three simple steps",
        "de": "Erste Schritte in drei einfachen Schritten",
        "es": "Comienza en tres simples pasos",
        "fr": "Commencez en trois étapes simples",
        "it": "Inizia in tre semplici passaggi",
        "pt": "Comece em três passos simples"
    },
    "learnMoreAboutSafety": {
        "en": "Learn More About Safety",
        "de": "Mehr über Sicherheit erfahren",
        "es": "Más información sobre seguridad",
        "fr": "En savoir plus sur la sécurité",
        "it": "Scopri di più sulla sicurezza",
        "pt": "Saiba mais sobre segurança"
    }
}

def add_keys_to_locale(locale_code):
    """Add new keys to a locale file"""
    locale_path = Path(f"locales/{locale_code}.json")
    
    with open(locale_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    added_count = 0
    for key, translations in NEW_KEYS.items():
        if key not in data:
            data[key] = translations[locale_code]
            added_count += 1
            print(f"  Added: {key}")
    
    sorted_data = dict(sorted(data.items()))
    with open(locale_path, 'w', encoding='utf-8') as f:
        json.dump(sorted_data, f, indent=2, ensure_ascii=False)
        f.write('\n')
    
    return added_count

def main():
    locales = ['en', 'de', 'es', 'fr', 'it', 'pt']
    
    print("Adding landing page translation keys...")
    print(f"Total new keys: {len(NEW_KEYS)}")
    print()
    
    total_added = 0
    for locale in locales:
        print(f"Processing {locale}.json...")
        added = add_keys_to_locale(locale)
        total_added += added
        print(f"  {added} new keys added")
        print()
    
    print(f"✅ Complete! Added {total_added} total translations")

if __name__ == "__main__":
    main()
