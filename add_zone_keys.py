#!/usr/bin/env python3
import json

translations = {
    "seasonAll": {
        "en": "All Seasons",
        "de": "Alle Jahreszeiten",
        "es": "Todas las Temporadas",
        "fr": "Toutes les Saisons",
        "it": "Tutte le Stagioni",
        "pt": "Todas as Estações"
    },
    "seasonWinter": {
        "en": "Winter",
        "de": "Winter",
        "es": "Invierno",
        "fr": "Hiver",
        "it": "Inverno",
        "pt": "Inverno"
    },
    "seasonSummer": {
        "en": "Summer",
        "de": "Sommer",
        "es": "Verano",
        "fr": "Été",
        "it": "Estate",
        "pt": "Verão"
    },
    "seasonSpring": {
        "en": "Spring",
        "de": "Frühling",
        "es": "Primavera",
        "fr": "Printemps",
        "it": "Primavera",
        "pt": "Primavera"
    },
    "seasonFall": {
        "en": "Fall",
        "de": "Herbst",
        "es": "Otoño",
        "fr": "Automne",
        "it": "Autunno",
        "pt": "Outono"
    },
    "zonePreviewTitle": {
        "en": "Explore Seasons & Destinations",
        "de": "Erkunden Sie Jahreszeiten und Ziele",
        "es": "Explorar Temporadas y Destinos",
        "fr": "Explorez les Saisons et Destinations",
        "it": "Esplora Stagioni e Destinazioni",
        "pt": "Explorar Estações e Destinos"
    },
    "zonePreviewDesc": {
        "en": "Find seasonal opportunities across Europe, from ski resorts to wine regions",
        "de": "Finden Sie saisonale Gelegenheiten in ganz Europa, von Skigebieten bis zu Weinregionen",
        "es": "Encontrar oportunidades estacionales en toda Europa, desde estaciones de esquí hasta regiones vinícolas",
        "fr": "Trouvez des opportunités saisonnières à travers l'Europe, des stations de ski aux régions viticoles",
        "it": "Trova opportunità stagionali in tutta Europa, dalle stazioni sciistiche alle regioni vinicole",
        "pt": "Encontre oportunidades sazonais em toda a Europa, desde estações de esqui até regiões vinícolas"
    }
}

locales = ["en", "de", "es", "fr", "it", "pt"]

for locale in locales:
    file_path = f"locales/{locale}.json"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for key, trans in translations.items():
        if key not in data:
            data[key] = trans[locale]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Updated {file_path}")

print("✓ All zone preview translation keys added!")
