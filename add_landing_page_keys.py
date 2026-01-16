#!/usr/bin/env python3
import json
import os

# New translation keys for missing landing page content
KEYS_TO_ADD = {
    'en': {
        # SocialProof - Additional info text (hardcoded text)
        'socialProofAdditionalText': 'Verified members across 50+ countries creating meaningful work and living experiences through fair agreements and transparent communication.',
        
        # TrustAndSafety - Hardcoded percentages
        'emailVerificationPercent': '100% of users',
        'phoneVerificationPercent': '92% of active users',
        'idVerificationPercent': '78% of premium users',
        'trustBadgeText': '🛡️ Trust is our top priority',
        
        # ZonePreview - Hardcoded CTAs
        'zoneListingsAvailable': 'Listings available',
        'zoneExploreMore': 'Explore more regions and seasonal opportunities',
        'zoneBrowseAllBtn': 'Browse All Listings →',
        'zoneSummerTag': 'Summer',
        'zoneWinterTag': 'Winter',
        
        # Footer - Navigation and labels
        'footerBrand': 'Seasoners',
        'footerBrandMotto': 'Helping travelers and hosts connect globally.',
        'footerPlatformSection': 'Platform',
        'footerResourcesSection': 'Resources',
        'footerCompanySection': 'Company',
        'footerStays': 'Seasonal Stays',
        'footerJobs': 'Seasonal Jobs',
        'footerFlatshares': 'Flatshares',
        'footerListPlace': 'List Your Place',
        'footerHelp': 'Help Center',
        'footerDocs': 'Documentation',
        'footerCommunity': 'Community Forum',
        'footerAgreements': 'Agreements',
        'footerAbout': 'About Us',
        'footerMembers': 'Founding Members',
        'footerContact': 'Contact',
        'footerSupport': 'Support',
        'footerCopyright': '© {{year}} Seasoners — All Rights Reserved.',
        'footerEmail': 'hello@seasoners.eu',
    },
    'de': {
        'socialProofAdditionalText': 'Verifizierte Mitglieder in 50+ Ländern, die sinnvolle Arbeits- und Wohnerfahrungen durch faire Vereinbarungen und transparente Kommunikation schaffen.',
        'emailVerificationPercent': '100% der Benutzer',
        'phoneVerificationPercent': '92% der aktiven Benutzer',
        'idVerificationPercent': '78% der Premium-Benutzer',
        'trustBadgeText': '🛡️ Vertrauen ist unsere oberste Priorität',
        'zoneListingsAvailable': 'Verfügbare Angebote',
        'zoneExploreMore': 'Erkunden Sie mehr Regionen und saisonale Möglichkeiten',
        'zoneBrowseAllBtn': 'Alle Angebote durchsuchen →',
        'zoneSummerTag': 'Sommer',
        'zoneWinterTag': 'Winter',
        'footerBrand': 'Seasoners',
        'footerBrandMotto': 'Reisende und Gastgeber weltweit verbinden.',
        'footerPlatformSection': 'Plattform',
        'footerResourcesSection': 'Ressourcen',
        'footerCompanySection': 'Unternehmen',
        'footerStays': 'Saisonale Aufenthalte',
        'footerJobs': 'Saisonale Jobs',
        'footerFlatshares': 'Wohngemeinschaften',
        'footerListPlace': 'Ihre Unterkunft eintragen',
        'footerHelp': 'Hilfe-Center',
        'footerDocs': 'Dokumentation',
        'footerCommunity': 'Community-Forum',
        'footerAgreements': 'Vereinbarungen',
        'footerAbout': 'Über uns',
        'footerMembers': 'Gründungsmitglieder',
        'footerContact': 'Kontakt',
        'footerSupport': 'Unterstützung',
        'footerCopyright': '© {{year}} Seasoners – Alle Rechte vorbehalten.',
        'footerEmail': 'hello@seasoners.eu',
    },
    'es': {
        'socialProofAdditionalText': 'Miembros verificados en 50+ países creando experiencias laborales y de vivienda significativas a través de acuerdos justos y comunicación transparente.',
        'emailVerificationPercent': '100% de los usuarios',
        'phoneVerificationPercent': '92% de usuarios activos',
        'idVerificationPercent': '78% de usuarios premium',
        'trustBadgeText': '🛡️ La confianza es nuestra prioridad',
        'zoneListingsAvailable': 'Anuncios disponibles',
        'zoneExploreMore': 'Explora más regiones y oportunidades estacionales',
        'zoneBrowseAllBtn': 'Ver todos los anuncios →',
        'zoneSummerTag': 'Verano',
        'zoneWinterTag': 'Invierno',
        'footerBrand': 'Seasoners',
        'footerBrandMotto': 'Conectando viajeros y anfitriones en todo el mundo.',
        'footerPlatformSection': 'Plataforma',
        'footerResourcesSection': 'Recursos',
        'footerCompanySection': 'Empresa',
        'footerStays': 'Estancias estacionales',
        'footerJobs': 'Trabajos estacionales',
        'footerFlatshares': 'Compartir apartamento',
        'footerListPlace': 'Publica tu propiedad',
        'footerHelp': 'Centro de ayuda',
        'footerDocs': 'Documentación',
        'footerCommunity': 'Foro comunitario',
        'footerAgreements': 'Acuerdos',
        'footerAbout': 'Acerca de nosotros',
        'footerMembers': 'Miembros fundadores',
        'footerContact': 'Contacto',
        'footerSupport': 'Soporte',
        'footerCopyright': '© {{year}} Seasoners — Todos los derechos reservados.',
        'footerEmail': 'hello@seasoners.eu',
    },
    'fr': {
        'socialProofAdditionalText': 'Membres vérifiés dans 50+ pays créant des expériences de travail et de vie significatives par des accords équitables et une communication transparente.',
        'emailVerificationPercent': '100% des utilisateurs',
        'phoneVerificationPercent': '92% des utilisateurs actifs',
        'idVerificationPercent': '78% des utilisateurs premium',
        'trustBadgeText': '🛡️ La confiance est notre priorité',
        'zoneListingsAvailable': 'Annonces disponibles',
        'zoneExploreMore': 'Explorez plus de régions et d\'opportunités saisonnières',
        'zoneBrowseAllBtn': 'Voir tous les annonces →',
        'zoneSummerTag': 'Été',
        'zoneWinterTag': 'Hiver',
        'footerBrand': 'Seasoners',
        'footerBrandMotto': 'Connecter les voyageurs et les hôtes dans le monde.',
        'footerPlatformSection': 'Plateforme',
        'footerResourcesSection': 'Ressources',
        'footerCompanySection': 'Entreprise',
        'footerStays': 'Séjours saisonniers',
        'footerJobs': 'Emplois saisonniers',
        'footerFlatshares': 'Colocation',
        'footerListPlace': 'Listez votre propriété',
        'footerHelp': 'Centre d\'aide',
        'footerDocs': 'Documentation',
        'footerCommunity': 'Forum communautaire',
        'footerAgreements': 'Accords',
        'footerAbout': 'À propos',
        'footerMembers': 'Membres fondateurs',
        'footerContact': 'Contact',
        'footerSupport': 'Support',
        'footerCopyright': '© {{year}} Seasoners — Tous droits réservés.',
        'footerEmail': 'hello@seasoners.eu',
    },
    'it': {
        'socialProofAdditionalText': 'Membri verificati in 50+ paesi che creano esperienze di lavoro e di vita significative attraverso accordi equi e comunicazione trasparente.',
        'emailVerificationPercent': '100% degli utenti',
        'phoneVerificationPercent': '92% degli utenti attivi',
        'idVerificationPercent': '78% degli utenti premium',
        'trustBadgeText': '🛡️ La fiducia è la nostra priorità',
        'zoneListingsAvailable': 'Annunci disponibili',
        'zoneExploreMore': 'Esplora più regioni e opportunità stagionali',
        'zoneBrowseAllBtn': 'Sfoglia tutti gli annunci →',
        'zoneSummerTag': 'Estate',
        'zoneWinterTag': 'Inverno',
        'footerBrand': 'Seasoners',
        'footerBrandMotto': 'Connettere viaggiatori e host in tutto il mondo.',
        'footerPlatformSection': 'Piattaforma',
        'footerResourcesSection': 'Risorse',
        'footerCompanySection': 'Azienda',
        'footerStays': 'Soggiorni stagionali',
        'footerJobs': 'Lavori stagionali',
        'footerFlatshares': 'Condivisione appartamento',
        'footerListPlace': 'Elenca la tua proprietà',
        'footerHelp': 'Centro assistenza',
        'footerDocs': 'Documentazione',
        'footerCommunity': 'Forum della comunità',
        'footerAgreements': 'Accordi',
        'footerAbout': 'Chi siamo',
        'footerMembers': 'Membri fondatori',
        'footerContact': 'Contatti',
        'footerSupport': 'Supporto',
        'footerCopyright': '© {{year}} Seasoners — Tutti i diritti riservati.',
        'footerEmail': 'hello@seasoners.eu',
    },
    'pt': {
        'socialProofAdditionalText': 'Membros verificados em 50+ países criando experiências de trabalho e vida significativas através de acordos justos e comunicação transparente.',
        'emailVerificationPercent': '100% dos usuários',
        'phoneVerificationPercent': '92% dos usuários ativos',
        'idVerificationPercent': '78% dos usuários premium',
        'trustBadgeText': '🛡️ A confiança é nossa prioridade',
        'zoneListingsAvailable': 'Anúncios disponíveis',
        'zoneExploreMore': 'Explore mais regiões e oportunidades sazonais',
        'zoneBrowseAllBtn': 'Ver todos os anúncios →',
        'zoneSummerTag': 'Verão',
        'zoneWinterTag': 'Inverno',
        'footerBrand': 'Seasoners',
        'footerBrandMotto': 'Conectando viajantes e anfitriões globalmente.',
        'footerPlatformSection': 'Plataforma',
        'footerResourcesSection': 'Recursos',
        'footerCompanySection': 'Empresa',
        'footerStays': 'Estadias sazonais',
        'footerJobs': 'Empregos sazonais',
        'footerFlatshares': 'Compartilhamento de apartamento',
        'footerListPlace': 'Liste sua propriedade',
        'footerHelp': 'Centro de ajuda',
        'footerDocs': 'Documentação',
        'footerCommunity': 'Fórum da comunidade',
        'footerAgreements': 'Acordos',
        'footerAbout': 'Sobre nós',
        'footerMembers': 'Membros fundadores',
        'footerContact': 'Contato',
        'footerSupport': 'Suporte',
        'footerCopyright': '© {{year}} Seasoners — Todos os direitos reservados.',
        'footerEmail': 'hello@seasoners.eu',
    },
}

def update_locale_file(locale_code, new_keys):
    """Update a locale JSON file with new keys."""
    file_path = f'locales/{locale_code}.json'
    
    try:
        # Read existing file
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Add new keys
        for key, value in new_keys.items():
            if key not in data:
                data[key] = value
                print(f"  ✓ Added '{key}' to {locale_code}")
            else:
                print(f"  ~ '{key}' already exists in {locale_code}")
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"  ✗ Error updating {locale_code}.json: {e}")

# Main execution
print("Adding landing page translation keys...\n")

for locale, keys in KEYS_TO_ADD.items():
    print(f"Updating {locale}.json:")
    update_locale_file(locale, keys)
    print()

print("✓ All landing page translation keys added!")
