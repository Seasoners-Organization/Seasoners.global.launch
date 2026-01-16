#!/usr/bin/env python3
import json
import os

# Define translations for stays page and other pages
translations = {
    "failedToLoadStays": {
        "en": "Failed to load stays",
        "de": "Fehler beim Laden der Unterkünfte",
        "es": "Error al cargar los alojamientos",
        "fr": "Échec du chargement des séjours",
        "it": "Errore nel caricamento dei soggiorni",
        "pt": "Falha ao carregar hospedagens"
    },
    "emptyStaysTitle": {
        "en": "Be the First to List!",
        "de": "Sei der Erste, der anbietet!",
        "es": "¡Sé el primero en listar!",
        "fr": "Soyez le premier à lister!",
        "it": "Sii il primo a elencare!",
        "pt": "Seja o primeiro a listar!"
    },
    "emptyStaysDesc": {
        "en": "We're in early stages and looking for hosts. List your space today and be featured as one of our founding members. Help build the future of seasonal living.",
        "de": "Wir befinden uns in einem frühen Stadium und suchen Gastgeber. Bieten Sie Ihren Platz heute an und werden Sie einer unserer Gründungsmitglieder. Helfen Sie, die Zukunft des Saisonlebens zu gestalten.",
        "es": "Estamos en las primeras etapas y buscamos anfitriones. Enumera tu espacio hoy y destacado como uno de nuestros miembros fundadores. Ayuda a construir el futuro de la vida estacional.",
        "fr": "Nous en sommes aux premiers stades et recherchons des hôtes. Listez votre espace aujourd'hui et soyez présenté comme l'un de nos membres fondateurs. Aidez à construire l'avenir de la vie saisonnière.",
        "it": "Siamo nelle fasi iniziali e cerchiamo host. Elenca il tuo spazio oggi e sia presente come uno dei nostri membri fondatori. Aiuta a costruire il futuro della vita stagionale.",
        "pt": "Estamos nos estágios iniciais e procuramos anfitriões. Liste seu espaço hoje e seja destacado como um de nossos membros fundadores. Ajude a construir o futuro da vida sazonal."
    },
    "listYourStayNow": {
        "en": "List Your Stay Now",
        "de": "Jetzt Ihre Unterkunft anbieten",
        "es": "Lista tu alojamiento ahora",
        "fr": "Listez votre séjour maintenant",
        "it": "Elenca il tuo soggiorno ora",
        "pt": "Liste sua hospedagem agora"
    },
    "browseListings": {
        "en": "Browse Listings",
        "de": "Angebote durchsuchen",
        "es": "Explorar anuncios",
        "fr": "Parcourir les annonces",
        "it": "Sfoglia gli annunci",
        "pt": "Explorar anúncios"
    },
    "pricePerMonth": {
        "en": "/mo",
        "de": "/Monat",
        "es": "/mes",
        "fr": "/mois",
        "it": "/mese",
        "pt": "/mês"
    },
    "manageListing": {
        "en": "Manage Listing",
        "de": "Angebot verwalten",
        "es": "Administrar Anuncio",
        "fr": "Gérer l'Annonce",
        "it": "Gestisci Annuncio",
        "pt": "Gerenciar Anúncio"
    },
    "contactSeller": {
        "en": "Contact Host",
        "de": "Gastgeber kontaktieren",
        "es": "Contactar Anfitrión",
        "fr": "Contacter l'Hôte",
        "it": "Contatta Ospite",
        "pt": "Contatar Anfitrião"
    },
    "failedToLoadJobs": {
        "en": "Failed to load jobs",
        "de": "Fehler beim Laden der Jobs",
        "es": "Error al cargar los trabajos",
        "fr": "Échec du chargement des emplois",
        "it": "Errore nel caricamento dei lavori",
        "pt": "Falha ao carregar empregos"
    },
    "emptyJobsTitle": {
        "en": "Be the First to Post!",
        "de": "Sei der Erste, der postet!",
        "es": "¡Sé el primero en publicar!",
        "fr": "Soyez le premier à publier!",
        "it": "Sii il primo a pubblicare!",
        "pt": "Seja o primeiro a postar!"
    },
    "emptyJobsDesc": {
        "en": "We're in early stages and looking for employers. Post your opportunity today and be featured as one of our founding partners. Help build the future of seasonal hiring.",
        "de": "Wir befinden uns in einem frühen Stadium und suchen Arbeitgeber. Veröffentlichen Sie Ihre Gelegenheit heute und werden Sie einer unserer Gründungspartner. Helfen Sie, die Zukunft der saisonalen Einstellung zu gestalten.",
        "es": "Estamos en las primeras etapas y buscamos empleadores. Publica tu oportunidad hoy y destacado como uno de nuestros socios fundadores. Ayuda a construir el futuro de la contratación estacional.",
        "fr": "Nous en sommes aux premiers stades et recherchons des employeurs. Publiez votre opportunité aujourd'hui et soyez présenté comme l'un de nos partenaires fondateurs. Aidez à construire l'avenir du recrutement saisonnier.",
        "it": "Siamo nelle fasi iniziali e cerchiamo datori di lavoro. Pubblica la tua opportunità oggi e sia presente come uno dei nostri partner fondatori. Aiuta a costruire il futuro dell'assunzione stagionale.",
        "pt": "Estamos nos estágios iniciais e procuramos empregadores. Publique sua oportunidade hoje e seja destacado como um de nossos parceiros fundadores. Ajude a construir o futuro da contratação sazonal."
    },
    "postJobNow": {
        "en": "Post Job Now",
        "de": "Job jetzt veröffentlichen",
        "es": "Publica un trabajo ahora",
        "fr": "Publier un emploi maintenant",
        "it": "Pubblica un lavoro ora",
        "pt": "Postar emprego agora"
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

print("✓ All stays/jobs translation keys added!")
