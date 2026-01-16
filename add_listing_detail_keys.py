#!/usr/bin/env python3
import json
import os

# Define translations for listing detail page
translations = {
    "listingPosted": {
        "en": "Posted",
        "de": "Veröffentlicht",
        "es": "Publicado",
        "fr": "Publié",
        "it": "Pubblicato",
        "pt": "Publicado"
    },
    "listingRegion": {
        "en": "Region",
        "de": "Region",
        "es": "Región",
        "fr": "Région",
        "it": "Regione",
        "pt": "Região"
    },
    "listingCity": {
        "en": "City",
        "de": "Stadt",
        "es": "Ciudad",
        "fr": "Ville",
        "it": "Città",
        "pt": "Cidade"
    },
    "listingType": {
        "en": "Type",
        "de": "Typ",
        "es": "Tipo",
        "fr": "Type",
        "it": "Tipo",
        "pt": "Tipo"
    },
    "seasonalJob": {
        "en": "Seasonal Job",
        "de": "Saisonarbeitsplatz",
        "es": "Trabajo Estacional",
        "fr": "Emploi Saisonnier",
        "it": "Lavoro Stagionale",
        "pt": "Trabalho Sazonal"
    },
    "shortTermStay": {
        "en": "Short-Term Stay",
        "de": "Kurzzeitaufenthalt",
        "es": "Estadía Corta",
        "fr": "Séjour Temporaire",
        "it": "Soggiorno Breve",
        "pt": "Estadia Curta"
    },
    "pricePerMonth": {
        "en": "/month",
        "de": "/Monat",
        "es": "/mes",
        "fr": "/mois",
        "it": "/mese",
        "pt": "/mês"
    },
    "about": {
        "en": "About",
        "de": "Über",
        "es": "Acerca de",
        "fr": "À propos",
        "it": "Su",
        "pt": "Sobre"
    },
    "languages": {
        "en": "Languages",
        "de": "Sprachen",
        "es": "Idiomas",
        "fr": "Langues",
        "it": "Lingue",
        "pt": "Idiomas"
    },
    "interests": {
        "en": "Interests",
        "de": "Interessen",
        "es": "Intereses",
        "fr": "Intérêts",
        "it": "Interessi",
        "pt": "Interesses"
    },
    "trustScore": {
        "en": "Trust Score",
        "de": "Vertrauenswert",
        "es": "Puntuación de Confianza",
        "fr": "Score de Confiance",
        "it": "Punteggio Fiducia",
        "pt": "Pontuação de Confiança"
    },
    "responseRate": {
        "en": "Response Rate",
        "de": "Reaktionsquote",
        "es": "Tasa de Respuesta",
        "fr": "Taux de Réponse",
        "it": "Tasso di Risposta",
        "pt": "Taxa de Resposta"
    },
    "memberSince": {
        "en": "Member Since",
        "de": "Mitglied seit",
        "es": "Miembro desde",
        "fr": "Membre depuis",
        "it": "Membro dal",
        "pt": "Membro desde"
    },
    "editListing": {
        "en": "Edit Listing",
        "de": "Angebot bearbeiten",
        "es": "Editar Anuncio",
        "fr": "Modifier l'Annonce",
        "it": "Modifica Annuncio",
        "pt": "Editar Anúncio"
    },
    "contactEmployer": {
        "en": "Contact Employer",
        "de": "Arbeitgeber kontaktieren",
        "es": "Contactar Empleador",
        "fr": "Contacter l'Employeur",
        "it": "Contatta Datore di Lavoro",
        "pt": "Contatar Empregador"
    },
    "contactHost": {
        "en": "Contact Host",
        "de": "Gastgeber kontaktieren",
        "es": "Contactar Anfitrión",
        "fr": "Contacter l'Hôte",
        "it": "Contatta Ospite",
        "pt": "Contatar Anfitrião"
    },
    "signInRequired": {
        "en": "Sign in required to contact",
        "de": "Anmeldung erforderlich zum Kontaktieren",
        "es": "Se requiere iniciar sesión para contactar",
        "fr": "Connexion requise pour contacter",
        "it": "Accesso richiesto per contattare",
        "pt": "É necessário fazer login para contatar"
    },
    "reportListing": {
        "en": "Report this listing",
        "de": "Dieses Angebot melden",
        "es": "Reportar este anuncio",
        "fr": "Signaler cette annonce",
        "it": "Segnala questo annuncio",
        "pt": "Denunciar este anúncio"
    },
    "verified": {
        "en": "Verified",
        "de": "Verifiziert",
        "es": "Verificado",
        "fr": "Vérifié",
        "it": "Verificato",
        "pt": "Verificado"
    },
    "employer": {
        "en": "Employer",
        "de": "Arbeitgeber",
        "es": "Empleador",
        "fr": "Employeur",
        "it": "Datore di Lavoro",
        "pt": "Empregador"
    },
    "host": {
        "en": "Host",
        "de": "Gastgeber",
        "es": "Anfitrión",
        "fr": "Hôte",
        "it": "Ospite",
        "pt": "Anfitrião"
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

print("✓ All listing detail translation keys added!")
