#!/usr/bin/env python3
import json
import os

# Translations for the About page
translations = {
    "en": {
        "ourValuesTitle": "Our Values",
        "ourValuesSubtitle": "The principles that guide everything we do"
    },
    "de": {
        "ourValuesTitle": "Unsere Werte",
        "ourValuesSubtitle": "Die Prinzipien, die alles leiten, was wir tun"
    },
    "es": {
        "ourValuesTitle": "Nuestros Valores",
        "ourValuesSubtitle": "Los principios que guían todo lo que hacemos"
    },
    "fr": {
        "ourValuesTitle": "Nos Valeurs",
        "ourValuesSubtitle": "Les principes qui guident tout ce que nous faisons"
    },
    "it": {
        "ourValuesTitle": "I Nostri Valori",
        "ourValuesSubtitle": "I principi che guidano tutto ciò che facciamo"
    },
    "pt": {
        "ourValuesTitle": "Nossos Valores",
        "ourValuesSubtitle": "Os princípios que orientam tudo o que fazemos"
    }
}

# Base path to locales
locales_dir = "locales"
added_count = 0

# Add keys to each locale file
for lang, new_keys in translations.items():
    file_path = os.path.join(locales_dir, f"{lang}.json")
    
    try:
        # Read existing translations
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Add new keys
        for key, value in new_keys.items():
            if key not in data:
                data[key] = value
                added_count += 1
                print(f"✅ Added '{key}' to {lang}.json")
            else:
                print(f"⚠️  Key '{key}' already exists in {lang}.json")
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    except FileNotFoundError:
        print(f"❌ File not found: {file_path}")
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON in: {file_path}")
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")

print(f"\n✅ Complete! Added {added_count} total translations")
